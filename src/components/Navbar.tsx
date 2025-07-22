import React, { useEffect, useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-light tracking-widest">
          unseen.juan
        </a>
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="hover:text-gray-500 transition-colors">
            Inicio
          </a>
          <a href="#sobre-mi" className="hover:text-gray-500 transition-colors">
            Sobre mí
          </a>
          <a href="#galeria" className="hover:text-gray-500 transition-colors">
            Galería
          </a>
          <a href="#instagram" className="hover:text-gray-500 transition-colors">
            Instagram
          </a>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md">
          <div className="flex flex-col items-center py-4 space-y-4">
            <a href="#inicio" className="hover:text-gray-500 transition-colors" onClick={toggleMenu}>
              Inicio
            </a>
            <a href="#sobre-mi" className="hover:text-gray-500 transition-colors" onClick={toggleMenu}>
              Sobre mí
            </a>
            <a href="#galeria" className="hover:text-gray-500 transition-colors" onClick={toggleMenu}>
              Galería
            </a>
            <a href="#instagram" className="hover:text-gray-500 transition-colors" onClick={toggleMenu}>
              Instagram
            </a>
          </div>
        </div>}
    </header>;
};