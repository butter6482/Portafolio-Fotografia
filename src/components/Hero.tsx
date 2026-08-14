import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const FALLBACK_TITLE = 'unseen.juan'
const FALLBACK_SUBTITLE = 'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo. Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista. A veces son momentos, a veces personas, a veces lugares. Todo depende. Esto es unseen.juan.'

export const Hero = () => {
  const [title, setTitle] = useState(FALLBACK_TITLE)
  const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['hero_title', 'hero_subtitle'])
      .then(({ data }) => {
        if (!data) return
        data.forEach(({ key, value }) => {
          if (key === 'hero_title') setTitle(value)
          if (key === 'hero_subtitle') setSubtitle(value)
        })
      })
  }, [])

  return (
    <section
      id="inicio"
      className="w-full min-h-screen flex flex-col justify-center items-center pt-16 px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container mx-auto max-w-3xl text-center">
        <div className="mb-8 max-w-md mx-auto">
          <img
            src="/_MG_7852_copy_-_Copy.jpg"
            alt="Colección de cámaras fotográficas vintage"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-8" style={{ color: 'var(--color-text)' }}>
          {title}
        </h1>
        <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text)' }}>
          {subtitle}
        </p>
        <a
          href="#galeria"
          className="inline-block px-8 py-3 transition-colors"
          style={{
            border: '1px solid var(--color-accent)',
            color: 'var(--color-accent)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'var(--color-accent)'
            el.style.color = '#fff'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'transparent'
            el.style.color = 'var(--color-accent)'
          }}
        >
          Ver fotografías
        </a>
      </div>
    </section>
  )
}