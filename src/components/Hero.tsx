import React from 'react';
export const Hero = () => {
  return <section id="inicio" className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center pt-16 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="mb-8 max-w-md mx-auto">
          <img src="/_MG_7852_copy_-_Copy.jpg" alt="Colección de cámaras fotográficas vintage" className="w-full h-auto rounded-md shadow-md" />
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-8">
          unseen.juan
        </h1>
        <p className="text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          Me llamo Juan Acevedo, soy de Puerto Rico. Tomo fotos porque hay cosas
          que me hacen mirar dos veces. No siempre sé por qué, pero ahí es donde
          empiezo. Este espacio es una extensión de eso. De lo que observo. De
          lo que no siempre se ve a primera vista. A veces son momentos, a veces
          personas, a veces lugares. Todo depende. Esto es unseen.juan.
        </p>
        <a href="#galeria" className="inline-block border border-gray-900 px-8 py-3 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
          Ver fotografías
        </a>
      </div>
    </section>;
};