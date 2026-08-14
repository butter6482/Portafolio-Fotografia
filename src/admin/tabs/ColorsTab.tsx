import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type ColorState = { color_bg: string; color_text: string; color_accent: string }

const COLOR_FIELDS = [
  { key: 'color_bg' as const, label: 'Fondo', cssVar: '--color-bg' },
  { key: 'color_text' as const, label: 'Texto', cssVar: '--color-text' },
  { key: 'color_accent' as const, label: 'Acento (links y botones)', cssVar: '--color-accent' },
]

const DEFAULTS: ColorState = {
  color_bg: '#f3f4f6',
  color_text: '#111827',
  color_accent: '#15803d',
}

export const ColorsTab = () => {
  const [colors, setColors] = useState<ColorState>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', COLOR_FIELDS.map(f => f.key))
      .then(({ data }) => {
        if (!data) return
        const next = { ...DEFAULTS }
        data.forEach(({ key, value }) => {
          if (key in next) next[key as keyof ColorState] = value
        })
        setColors(next)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all(
      COLOR_FIELDS.map(({ key, cssVar }) => {
        document.documentElement.style.setProperty(cssVar, colors[key])
        return supabase.from('site_settings').upsert({ key, value: colors[key] })
      })
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 space-y-6">
      <p className="text-sm text-gray-500">Los cambios se aplican en el sitio después de guardar.</p>

      {COLOR_FIELDS.map(({ key, label }) => (
        <div key={key} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-sm text-gray-400 font-mono">{colors[key]}</p>
          </div>
          <input
            type="color"
            value={colors[key]}
            onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-16 h-16 rounded-xl cursor-pointer border-0 p-1 bg-transparent"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 text-lg bg-gray-900 text-white rounded-xl disabled:opacity-50 active:bg-gray-700"
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar colores'}
      </button>
    </div>
  )
}
