import React, { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { LoginForm } from './LoginForm'
import { PhotosTab } from './tabs/PhotosTab'
import { ColorsTab } from './tabs/ColorsTab'
import { TextsTab } from './tabs/TextsTab'

type Tab = 'photos' | 'colors' | 'texts'

export const AdminApp = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('photos')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Cargando...</span>
      </div>
    )
  }

  if (!session) return <LoginForm />

  const TAB_LABELS: { id: Tab; label: string }[] = [
    { id: 'photos', label: 'Fotos' },
    { id: 'colors', label: 'Colores' },
    { id: 'texts', label: 'Textos' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <span className="font-light tracking-widest text-lg">unseen.juan</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-500 border border-gray-300 rounded px-3 py-1"
        >
          Salir
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'photos' && <PhotosTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'texts' && <TextsTab />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex bg-white border-t z-10">
        {TAB_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === id ? 'text-gray-900 border-t-2 border-gray-900' : 'text-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
