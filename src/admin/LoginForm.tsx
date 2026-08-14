import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const USERNAME_MAP: Record<string, string> = {
  'unseen.juan': 'butterchaparro316@gmail.com',
}

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const email = USERNAME_MAP[username.trim().toLowerCase()]
    if (!email) {
      setError('Usuario no reconocido.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('Contraseña incorrecta.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-light tracking-widest text-center mb-8">
          unseen.juan
        </h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg bg-white"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg bg-white"
          required
        />
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg bg-gray-900 text-white rounded-lg disabled:opacity-50 active:bg-gray-700"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
