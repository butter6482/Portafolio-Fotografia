import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Gallery } from './components/Gallery'
import { InstagramSection } from './components/InstagramSection'
import { Footer } from './components/Footer'
import { AdminApp } from './admin/AdminApp'
import { useSiteSettings } from './hooks/useSiteSettings'

function PublicSite() {
  return (
    <div className="w-full min-h-screen font-sans" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  )
}

export function App() {
  useSiteSettings()
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </HashRouter>
  )
}
