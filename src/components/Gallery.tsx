import React, { useState } from 'react';

const allPhotos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `/${i + 1}.jpg`,
  alt: `Foto ${i + 1}`
}));

// Categorías actualizadas
const photoCategories = {
  retratos: [1, 2, 3, 4, 5, 6, 7, 12],
  productos: [8, 9, 10, 11, 13, 14],
  arquitectura: [15, 16, 17, 18, 19, 20],
};

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const renderCategory = (title, ids, anchor) => (
    <div className="mb-16" id={anchor}>
      <h3 className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPhotos
          .filter((img) => ids.includes(img.id))
          .map((image) => (
            <div
              key={image.id}
              className="aspect-w-4 aspect-h-3 overflow-hidden cursor-pointer"
              onClick={() => openLightbox(image)}
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
  );

  return (
    <section id="galeria" className="w-full py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-center">
          Galería
        </h2>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto text-gray-600">
          Esta es una selección de fotos que he tomado.  
          Una mirada a través de mi lente, capturando momentos que no siempre se ven a primera vista.
        </p>

        {/* Navegación por categoría */}
        <div className="flex justify-center gap-6 mb-12 text-center flex-wrap">
          <a href="#retratos" className="text-green-700 hover:underline font-semibold transition-all duration-300">Retratos</a>
          <a href="#productos" className="text-green-700 hover:underline font-semibold transition-all duration-300">Productos</a>
          <a href="#arquitectura" className="text-green-700 hover:underline font-semibold transition-all duration-300">Arquitectura</a>
        </div>

        {/* Categorías */}
        {renderCategory('Retratos', photoCategories.retratos, 'retratos')}
        {renderCategory('Productos', photoCategories.productos, 'productos')}
        {renderCategory('Arquitectura', photoCategories.arquitectura, 'arquitectura')}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-h-full max-w-full object-contain rounded"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeLightbox}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
