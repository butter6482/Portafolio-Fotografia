import React, { useState } from 'react';

// Generar las 20 imágenes automáticamente
const allPhotos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `/${i + 1}.jpg`,
  alt: `Foto ${i + 1}`
}));

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="galeria" className="w-full py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-center">
          Galería
        </h2>
        <p className="text-center text-lg mb-16 max-w-3xl mx-auto">
          Esta es una selección de fotos que he tomado.  
          Una mirada a través de mi lente, capturando momentos que no siempre se ven a primera vista.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPhotos.map((image) => (
            <div
              key={image.id}
              className="aspect-w-4 aspect-h-3 overflow-hidden cursor-pointer"
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-h-full max-w-full object-contain"
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
