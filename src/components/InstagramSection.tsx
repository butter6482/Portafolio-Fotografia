import React from 'react';
import { InstagramIcon } from 'lucide-react';
import { InstagramEmbed } from 'react-social-media-embed';

export const InstagramSection = () => {
  const posts = [
    "https://www.instagram.com/p/CmroAyyOrMB/",
    "https://www.instagram.com/p/DFbesIKOk30/",
    "https://www.instagram.com/p/Cr7mDhDuWtK/",
    "https://www.instagram.com/p/Cu2vqJSLyzA/",
    "https://www.instagram.com/p/Cid3BBIrzt4/",
    "https://www.instagram.com/p/DJuCcZ9u5b0/"
  ];

  return (
    <section id="instagram" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
          Lo que comparto en Instagram
        </h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          También publico parte de mi trabajo en Instagram, bajo el nombre <strong>@unseen.juan</strong>.
          Es un lugar más casual, más inmediato, pero también fiel a cómo miro el mundo.
        </p>

        <a
          href="https://instagram.com/unseen.juan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center border border-gray-900 px-8 py-3 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          <InstagramIcon size={20} className="mr-2" />
          instagram.com/unseen.juan
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center">
          {posts.map((url, index) => (
            <div
              key={index}
              className="w-full max-w-[328px] h-[500px] overflow-hidden border border-gray-200 rounded"
            >
              <InstagramEmbed url={url} width="100%" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

