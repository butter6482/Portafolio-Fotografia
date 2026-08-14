import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const FALLBACK = {
  p1: 'Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde empiezo.',
  p2: 'Este espacio es una extensión de eso. De lo que observo. De lo que no siempre se ve a primera vista.',
  p3: 'A veces son momentos, a veces personas, a veces lugares. Todo depende.',
  p4: 'Esto es unseen.juan.',
}

export const About = () => {
  const [paragraphs, setParagraphs] = useState(FALLBACK)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['about_p1', 'about_p2', 'about_p3', 'about_p4'])
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const next = { ...FALLBACK }
        data.forEach(({ key, value }) => {
          if (key === 'about_p1') next.p1 = value
          if (key === 'about_p2') next.p2 = value
          if (key === 'about_p3') next.p3 = value
          if (key === 'about_p4') next.p4 = value
        })
        setParagraphs(next)
      })
  }, [])

  return (
    <section id="sobre-mi" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-16 text-center">
          Sobre mí
        </h2>
        <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <div className="aspect-w-4 aspect-h-5 overflow-hidden">
              <img src="/Foto_Juan.jpg" alt="Juan Acevedo, fotógrafo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p1}</p>
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p2}</p>
            <p className="text-lg leading-relaxed mb-6">{paragraphs.p3}</p>
            <p className="text-lg leading-relaxed font-semibold">
              <em>{paragraphs.p4}</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
