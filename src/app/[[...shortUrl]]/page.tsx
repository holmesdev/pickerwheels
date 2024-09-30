import WheelPage from '@/components/wheel/WheelPage'
import { WheelData } from '@/components/wheel/wheelReducer'
import { Database } from '@/db/types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home({ params: { shortUrl } }: { params: { shortUrl?: string[] } }) {
  let wheelData: WheelData | null = null
  const supabase = createServerComponentClient<Database>({ cookies })
  if (shortUrl && shortUrl.length >= 1) {
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
    `,
      )
      .eq('short_url', shortUrl[0])
      .returns<WheelData[]>()
      .maybeSingle()
    if (!error) {
      wheelData = data
    }
  }
  return <WheelPage wheelData={wheelData} />
}
