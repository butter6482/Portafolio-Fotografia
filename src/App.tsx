import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Gallery } from './components/Gallery';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
export function App() {
  return <div className="w-full min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <InstagramSection />
      </main>
      <Footer />
    </div>;
}