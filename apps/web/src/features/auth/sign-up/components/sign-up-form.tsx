'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord, FaApple, FaSlack, FaTwitter } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useAuthStore } from '@/stores/auth-store'
import { useEmailSettingsStore } from '@/features/email-settings/store'
import { AuthProviderConfig } from '@/features/email-settings/types'
import { createClient } from '@/lib/supabase/client'


const formSchema = z
  .object({
    email: z.string().email('Please enter a valid email.'),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeLoadingProvider, setActiveLoadingProvider] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams ? searchParams.get('email') || '' : ''
  const { setUser, setAccessToken } = useAuthStore((state) => state.auth)

  const [mounted, setMounted] = useState(false)
  const { config } = useEmailSettingsStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const authProviders = config?.authProviders || []
  const activeProviders = mounted ? authProviders.filter((p) => p.isEnabled) : []

  const renderProviderIcon = (provider: { name: string; iconUrl?: string }) => {
    if (provider.iconUrl) {
      return (
        <img
          src={provider.iconUrl}
          alt={provider.name}
          className='h-4 w-4 object-contain shrink-0 rounded-xs'
        />
      )
    }
    const lower = provider.name.toLowerCase()
    if (lower.includes('google')) return <FcGoogle className='h-4 w-4 shrink-0' />
    if (lower.includes('github')) return <FaGithub className='h-4 w-4 shrink-0' />
    if (lower.includes('discord')) return <FaDiscord className='h-4 w-4 shrink-0 text-[#5865F2]' />
    if (lower.includes('apple')) return <FaApple className='h-4 w-4 shrink-0' />
    if (lower.includes('slack')) return <FaSlack className='h-4 w-4 shrink-0' />
    if (lower.includes('twitter') || lower.includes('x'))
      return <FaTwitter className='h-4 w-4 shrink-0 text-[#1DA1F2]' />
    return <ShieldCheck className='h-4 w-4 shrink-0 text-sky-500' />
  }

  const handleProviderLogin = async (
    provider: AuthProviderConfig | { name: string; preset?: string }
  ) => {
    const providerPreset =
      ('preset' in provider && provider.preset)
        ? provider.preset
        : provider.name.toLowerCase()

    const oauthProvider = providerPreset.includes('github')
      ? 'github'
      : providerPreset.includes('discord')
      ? 'discord'
      : providerPreset.includes('apple')
      ? 'apple'
      : providerPreset.includes('slack')
      ? 'slack'
      : providerPreset.includes('twitter')
      ? 'twitter'
      : providerPreset.includes('google')
      ? 'google'
      : providerPreset

    setActiveLoadingProvider(provider.name)
    try {
      if (oauthProvider === 'github') {
        const authProviderObj = provider as AuthProviderConfig
        const clientId = authProviderObj.clientId
        const clientSecret = authProviderObj.clientSecret

        if (clientId) {
          if (typeof window !== 'undefined' && clientSecret) {
            document.cookie = `auth_custom_github=${encodeURIComponent(
              JSON.stringify({ clientId, clientSecret })
            )}; path=/; max-age=600; SameSite=Lax`
          }

          const redirectUri = `${window.location.origin}/api/auth/callback/github`
          const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
            clientId
          )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,user:email&state=/`

          window.location.href = githubAuthUrl
          return
        }
      }

      if (oauthProvider === 'google') {
        await signIn('google', {
          callbackUrl: '/',
        })
      } else {
        await signIn(oauthProvider, { callbackUrl: '/' })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `${provider.name} sign in failed. Please try again.`
      console.error(`[SignUp Provider] Error:`, err)
      toast.error(message)
    } finally {
      setActiveLoadingProvider(null)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailParam,
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (emailParam) {
      form.setValue('email', emailParam)
    }
  }, [emailParam, form])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Sign up the user
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.email.split('@')[0],
          },
        },
      })

      if (error) {
        if (error.message?.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.')
          router.push(`/sign-in?email=${encodeURIComponent(data.email)}`)
          return
        }
        throw error
      }

      const user = authData.user
      if (!user) throw new Error('Registration failed.')

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!authData.session) {
        toast.info('Verification link sent! Please check your email.')
        router.replace('/auth/sign-in')
        return
      }

      setUser({
        id: user.id,
        accountNo: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        picture: user.user_metadata?.avatar_url || undefined,
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })

      setAccessToken(authData.session.access_token)

      router.replace('/')
      toast.success(`Account created for ${data.email}!`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      console.error('Signup error:', err)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading || activeLoadingProvider !== null}>
          {isLoading ? <Loader2 className='animate-spin' /> : <UserPlus />}
          Create Account
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        {/* Dynamic Auth Providers configured in App Settings */}
        <div className='space-y-2'>
          {activeProviders.length > 0 ? (
            activeProviders.map((provider) => (
              <Button
                key={provider.id}
                variant='outline'
                type='button'
                className='w-full'
                disabled={isLoading || activeLoadingProvider !== null}
                onClick={() => handleProviderLogin(provider)}
              >
                {activeLoadingProvider === provider.name ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  renderProviderIcon(provider)
                )}
                Continue with {provider.name}
              </Button>
            ))
          ) : (
            <Button
              variant='outline'
              type='button'
              className='w-full'
              disabled={isLoading || activeLoadingProvider !== null}
              onClick={() => handleProviderLogin({ name: 'Google', preset: 'google' })}
            >
              {activeLoadingProvider === 'Google' ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <FcGoogle className='h-4 w-4' />
              )}
              Continue with Google
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}