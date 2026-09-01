'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord, FaApple, FaSlack, FaTwitter } from 'react-icons/fa'
import { useAuthStore } from '@/stores/auth-store'
import { useEmailSettingsStore } from '@/features/email-settings/store'
import { AuthProviderConfig } from '@/features/email-settings/types'
import { sleep, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { handleAuthRedirect } from '@/services/auth-redirect.service'
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeLoadingProvider, setActiveLoadingProvider] = useState<string | null>(null)
  const router = useRouter()
  const { auth } = useAuthStore()

  const [mounted, setMounted] = useState(false)
  const { config } = useEmailSettingsStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const authProviders = config?.authProviders || []
  const activeProviders = mounted ? authProviders.filter((p) => p.isEnabled) : []

  // Persist the intended redirect in sessionStorage as a reliable fallback
  useEffect(() => {
    if (typeof window !== 'undefined' && redirectTo && redirectTo !== '/') {
      sessionStorage.setItem('post_login_redirect', redirectTo)
    }
  }, [redirectTo])

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
      const redirectValue = redirectTo || '/'
      const targetUrl = redirectValue && redirectValue !== '/' ? redirectValue : '/'

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
          )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,user:email&state=${encodeURIComponent(
            targetUrl
          )}`

          window.location.href = githubAuthUrl
          return
        }
      }

      if (oauthProvider === 'google') {
        await signIn('google', {
          callbackUrl: targetUrl,
        })
      } else {
        await signIn(oauthProvider, { callbackUrl: targetUrl })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `${provider.name} sign in failed. Please try again.`
      console.error(`[DEBUG client] handleProviderLogin failed for ${provider.name}:`, err)
      toast.error(message)
    } finally {
      setActiveLoadingProvider(null)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Check if email exists in profiles table (our records)
      const { data: profileList } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)

      const emailExists = profileList && profileList.length > 0

      if (!emailExists) {
        toast.error('Account not found in our records. Redirecting to Sign Up...')
        await sleep(1500)
        router.push(`/sign-up?email=${encodeURIComponent(data.email)}`)
        return
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      const user = authData.user
      if (!user) throw new Error('No user returned from sign in.')

      auth.setUser({
        id: user.id,
        accountNo: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0],
        picture: user.user_metadata?.avatar_url || undefined,
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
      auth.setAccessToken(authData.session?.access_token || 'mock-access-token')

      const storedRedirect =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('post_login_redirect')
          : null
      const destination = redirectTo || storedRedirect || undefined
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('post_login_redirect')
      }
      handleAuthRedirect(router, destination)

      toast.success(`Welcome back, ${user.email}!`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.'
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
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading || activeLoadingProvider !== null}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
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