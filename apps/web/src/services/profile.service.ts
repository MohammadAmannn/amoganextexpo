import { createClient } from '@/lib/supabase/client'
import { stringToUuid } from '@/lib/auth'

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  mobile?: string
}

export async function ensureProfileExists(user: {
  accountNo: string
  email: string
  name?: string
  picture?: string
  mobile?: string
}) {
  try {
    const supabase = createClient()
    const fallbackUuid = stringToUuid(user.accountNo || user.email)

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, auth_user_id')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()

    const profileId = existingProfile?.id || fallbackUuid

    const profileData: any = {
      id: profileId,
      name: user.name || user.email.split('@')[0],
      email: user.email.toLowerCase(),
      avatar: user.picture || null,
      updated_at: new Date().toISOString(),
    }
    if (user.mobile) {
      profileData.mobile = user.mobile
    }
    profileData.auth_user_id = existingProfile?.auth_user_id || profileId

    if (existingProfile) {
      await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', existingProfile.id)
    } else {
      await supabase
        .from('profiles')
        .insert(profileData)
    }

    return {
      id: profileId,
      name: profileData.name,
      email: profileData.email,
      avatar_url: profileData.avatar,
    }
  } catch (err) {
    console.error('[ProfileService] Error ensuring profile exists:', err)
    return null
  }
}

export async function updateProfile(
  id: string,
  updates: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = createClient()
    await supabase.from('profiles').update(updates).eq('id', id)
    return true
  } catch (err) {
    console.error('[ProfileService] Error updating profile:', err)
    return false
  }
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()
    if (!data) return null
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar_url: data.avatar,
    }
  } catch (err) {
    return null
  }
}
