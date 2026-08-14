import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type Photo = {
  id: string
  url: string
  alt: string
  category: string
  sort_order: number
}

const CATEGORIES = ['retratos', 'productos', 'arquitectura'] as const

const FALLBACK_PHOTOS: Photo[] = [
  ...([1, 2, 3, 4, 5, 6, 7].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'retratos', sort_order: i }))),
  ...([8, 9, 10, 11].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'productos', sort_order: i }))),
  { id: '12', url: '/12.jpg', alt: 'Foto 12', category: 'retratos', sort_order: 7 },
  ...([13, 14].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'productos', sort_order: i + 4 }))),
  ...([15, 16, 17, 18, 19, 20].map((n, i) => ({ id: String(n), url: `/${n}.jpg`, alt: `Foto ${n}`, category: 'arquitectura', sort_order: i }))),
]

export const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS)
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)

  useEffect(() => {
    supabase
      .from('photos')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setPhotos(data)
      })
  }, [])

  const renderCategory = (cat: string) => {
    const catPhotos = photos
      .filter(p => p.category === cat)
      .sort((a, b) => a.sort_order - b.sort_order)
    if (catPhotos.length === 0) return null
    return (
      <div className="mb-16" id={cat} key={cat}>
        <h3 className="text-2xl font-semibold mb-6 text-center capitalize" style={{ color: 'var(--color-text)' }}>
          {cat}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catPhotos.map(image => (
            <div
              key={image.id}
              className="aspect-w-4 aspect-h-3 overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="galeria" className="w-full py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-center">
          Galería
        </h2>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto text-gray-600">
          Esta es una selección de fotos que he tomado. Una mirada a través de mi lente, capturando momentos que no siempre se ven a primera vista.
        </p>
        <div className="flex justify-center gap-6 mb-12 text-center flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })}
              className="font-semibold transition-all duration-300 hover:underline"
              style={{ color: 'var(--color-accent)' }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {CATEGORIES.map(renderCategory)}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-h-full max-w-full object-contain rounded"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
