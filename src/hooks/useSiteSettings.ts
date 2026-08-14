import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const CSS_KEYS = ['color_bg', 'color_text', 'color_accent'] as const

export function useSiteSettings() {
  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [...CSS_KEYS])
      .then(({ data }) => {
        if (!data) return
        data.forEach(({ key, value }) => {
          document.documentElement.style.setProperty(
            `--${key.replace(/_/g, '-')}`,
            value
          )
        })
      })
  }, [])
}
