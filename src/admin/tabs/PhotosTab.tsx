import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Photo = {
  id: string
  url: string
  alt: string
  category: string
  sort_order: number
}

const CATEGORIES = ['retratos', 'productos', 'arquitectura'] as const

export const PhotosTab = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState<string | null>(null)

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('sort_order')
    if (data) setPhotos(data)
  }

  useEffect(() => { fetchPhotos() }, [])

  const handleUpload = async (file: File, category: string) => {
    setUploading(category)
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filename, file, { cacheControl: '3600', upsert: false })
    if (uploadError) {
      alert('Error al subir la foto.')
      setUploading(null)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filename)
    const catPhotos = photos.filter(p => p.category === category)
    const maxOrder = catPhotos.reduce((max, p) => Math.max(max, p.sort_order), -1)
    await supabase.from('photos').insert({
      url: publicUrl,
      alt: file.name,
      category,
      sort_order: maxOrder + 1,
    })
    await fetchPhotos()
    setUploading(null)
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm('¿Eliminar esta foto?')) return
    await supabase.from('photos').delete().eq('id', photo.id)
    await fetchPhotos()
  }

  const handleMove = async (photo: Photo, direction: 'up' | 'down') => {
    const catPhotos = photos
      .filter(p => p.category === photo.category)
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = catPhotos.findIndex(p => p.id === photo.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= catPhotos.length) return
    const neighbor = catPhotos[swapIdx]
    await Promise.all([
      supabase.from('photos').update({ sort_order: neighbor.sort_order }).eq('id', photo.id),
      supabase.from('photos').update({ sort_order: photo.sort_order }).eq('id', neighbor.id),
    ])
    await fetchPhotos()
  }

  return (
    <div className="p-4 space-y-10">
      {CATEGORIES.map(cat => {
        const catPhotos = photos
          .filter(p => p.category === cat)
          .sort((a, b) => a.sort_order - b.sort_order)

        return (
          <div key={cat}>
            <h3 className="text-lg font-semibold capitalize mb-3 text-gray-800">
              {cat} ({catPhotos.length})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {catPhotos.map(photo => (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="flex gap-1 p-2">
                    <button
                      onClick={() => handleMove(photo, 'up')}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-lg active:bg-gray-200"
                    >↑</button>
                    <button
                      onClick={() => handleMove(photo, 'down')}
                      className="flex-1 py-2 bg-gray-100 rounded-lg text-lg active:bg-gray-200"
                    >↓</button>
                    <button
                      onClick={() => handleDelete(photo)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-lg active:bg-red-100"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            <label
              htmlFor={`upload-${cat}`}
              className={`mt-3 flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-gray-500 active:bg-gray-50 ${uploading === cat ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading === cat ? 'Subiendo...' : '+ Agregar foto'}
            </label>
            <input
              id={`upload-${cat}`}
              type="file"
              accept="image/*"
              capture="environment"
              disabled={!!uploading}
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file, cat)
                e.target.value = ''
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
