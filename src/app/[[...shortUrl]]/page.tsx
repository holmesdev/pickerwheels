import { Sound } from '@/components/wheel/Sound'
import { SoundCategory } from '@/components/wheel/SoundCategory'
import WheelPage from '@/components/wheel/WheelPage'
import { WheelData } from '@/components/wheel/wheelReducer'
import { Database } from '@/db/types'
import { SupabaseClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function getSoundCategories(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('sound_categories').select('id, label').returns<SoundCategory[]>()

  if (error) {
    console.error(error)
    return []
  }

  return data || []
}

async function getSounds(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('sounds').select('id, sound_category_id, label, url').returns<Sound[]>()
  if (error) {
    console.error(error)
    return []
  }

  return data || []
}

async function getWheelData(supabase: SupabaseClient<Database>, shortUrl: string) {
  const { data, error } = await supabase
    .from('wheels')
    .select(
      `
      short_url,
      show_option_labels,
      last_position,
      wheel_options (
        label,
        enabled
      ),
      wheel_colors (
        hex_code
      )
      wheel_sounds (
        sound_category_id,
        sounds (
          id,
          label,
          url
        )
      )
    `
    )
    .eq('short_url', shortUrl)
    .returns<WheelData[]>()
    .maybeSingle()
  if (error) {
    console.error(error)
    return null
  }

  return data || null
}

export default async function Home({ params: { shortUrl } }: { params: { shortUrl?: string[] } }) {
  let wheelData: WheelData | null = null
  const supabase = createServerComponentClient<Database>({ cookies })

  const soundCategories = await getSoundCategories(supabase)
  const sounds = await getSounds(supabase)

  if (shortUrl && shortUrl.length >= 1) {
    const wheelData = await getWheelData(supabase, shortUrl[0])
  }
  return <WheelPage wheelData={wheelData} sounds={sounds} soundCategories={soundCategories} />
}
