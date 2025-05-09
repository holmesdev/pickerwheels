import WheelPage from '@/components/wheel/WheelPage'
import { WheelData } from '@/components/wheel/wheelReducer'
import { createClient } from '@/utils/supabase/server'

type Params = Promise<{ shortUrl: string[] }>

export default async function Home({ params }: { params: Params }) {
  const shortUrl = (await params).shortUrl
  let wheelData: WheelData | null = null
  const supabase = await createClient()

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
