import React, { useState } from 'react';

// Todas las fotos en un solo array
const allPhotos = [
  { id: 1, url: "/_MG_8527_copy.jpg", alt: 'Retrato con iluminación dramática' },
  { id: 2, url: "/_MG_8550_copy.jpg", alt: 'Persona en un tronco al atardecer' },
  { id: 3, url: "/_MG_8606_copy.jpg", alt: 'Persona en un concierto' },
  { id: 4, url: "/_MG_8452_copy.jpg", alt: 'Retrato de persona con camiseta blanca' },
  { id: 5, url: "/_MG_8515_copy.jpg", alt: 'Retrato de persona con cabello rojo' },
  { id: 6, url: "/IMG_5261_copy.jpg", alt: 'Producto en manos' },
  { id: 7, url: "/_MG_8391_copy.jpg", alt: 'Botella de perfume azul con naranjas' },
  { id: 8, url: "/_MG_8426_copy.jpg", alt: 'Dulces Sour Patch Kids' },
  { id: 9, url: "/_MG_8434_copy.jpg", alt: 'Dulces Sour Patch Kids con más caramelos' },
  { id: 10, url: "/_MG_7905_copy.jpg", alt: 'Fotografía arquitectónica' },
  { id: 11, url: "/_MG_8055_copy.jpg", alt: 'Retrato con iluminación' },
  { id: 12, url: "/_MG_8185_copy.jpg", alt: 'Retrato urbano' },
  { id: 13, url: "/_MG_8198_copy.jpg", alt: 'Arquitectura histórica' },
  { id: 14, url: "/_MG_8219_copy.jpg", alt: 'Retrato con fondo rojo' },
];

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
