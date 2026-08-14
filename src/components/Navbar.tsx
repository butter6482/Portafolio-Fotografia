import React, { useEffect, useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navClick = (id: string) => { scrollTo(id); setIsMenuOpen(false); };

  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <button onClick={() => scrollTo('inicio')} className="text-2xl font-light tracking-widest">
          unseen.juan
        </button>
        <div className="hidden md:flex space-x-8">
          <button onClick={() => navClick('inicio')} className="hover:text-gray-500 transition-colors">Inicio</button>
          <button onClick={() => navClick('sobre-mi')} className="hover:text-gray-500 transition-colors">Sobre mí</button>
          <button onClick={() => navClick('galeria')} className="hover:text-gray-500 transition-colors">Galería</button>
          <button onClick={() => navClick('instagram')} className="hover:text-gray-500 transition-colors">Instagram</button>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md">
          <div className="flex flex-col items-center py-4 space-y-4">
            <button onClick={() => navClick('inicio')} className="hover:text-gray-500 transition-colors">Inicio</button>
            <button onClick={() => navClick('sobre-mi')} className="hover:text-gray-500 transition-colors">Sobre mí</button>
            <button onClick={() => navClick('galeria')} className="hover:text-gray-500 transition-colors">Galería</button>
            <button onClick={() => navClick('instagram')} className="hover:text-gray-500 transition-colors">Instagram</button>
          </div>
        </div>}
    </header>;
};