import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type TextState = Record<string, string>

const TEXT_FIELDS = [
  { key: 'hero_title', label: 'Título principal (Hero)', multiline: false },
  { key: 'hero_subtitle', label: 'Bio / Subtítulo (Hero)', multiline: true },
  { key: 'about_p1', label: 'Sobre mí — Párrafo 1', multiline: true },
  { key: 'about_p2', label: 'Sobre mí — Párrafo 2', multiline: true },
  { key: 'about_p3', label: 'Sobre mí — Párrafo 3', multiline: true },
  { key: 'about_p4', label: 'Sobre mí — Párrafo 4 (firma)', multiline: true },
]

export const TextsTab = () => {
  const [texts, setTexts] = useState<TextState>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', TEXT_FIELDS.map(f => f.key))
      .then(({ data }) => {
        if (!data) return
        const next: TextState = {}
        data.forEach(({ key, value }) => { next[key] = value })
        setTexts(next)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all(
      TEXT_FIELDS.map(({ key }) =>
        supabase.from('site_settings').upsert({ key, value: texts[key] ?? '' })
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 space-y-5">
      {TEXT_FIELDS.map(({ key, label, multiline }) => (
        <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          {multiline ? (
            <textarea
              value={texts[key] ?? ''}
              onChange={e => setTexts(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[80px] resize-y"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={texts[key] ?? ''}
              onChange={e => setTexts(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 text-lg bg-gray-900 text-white rounded-xl disabled:opacity-50 active:bg-gray-700"
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar textos'}
      </button>
    </div>
  )
}
