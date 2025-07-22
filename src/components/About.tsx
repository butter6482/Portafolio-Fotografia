import React from 'react';

export const About = () => {
  return (
    <section id="sobre-mi" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-16 text-center">
          Sobre mí
        </h2>
        <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <div className="aspect-w-4 aspect-h-5 overflow-hidden">
              <img
                src="/Foto_Juan.jpg"
                alt="Juan Acevedo, fotógrafo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <p className="text-lg leading-relaxed mb-6">
              Me llamo Juan Acevedo, soy de Puerto Rico.
              Tomo fotos porque hay cosas que me hacen mirar dos veces.
              No siempre sé por qué, pero ahí es donde empiezo.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Este espacio es una extensión de eso.
              De lo que observo.
              De lo que no siempre se ve a primera vista.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              A veces son momentos,  
              a veces personas,  
              a veces lugares.  
              Todo depende.
            </p>
            <p className="text-lg leading-relaxed font-semibold">
              Esto es <em>unseen.juan</em>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
