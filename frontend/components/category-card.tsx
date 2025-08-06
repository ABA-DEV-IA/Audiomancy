"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const DEFAULT_CATEGORY_BG = "/images/default-category.png";

interface CategoryProps {
  category: {
    title: string;
    subtitle: string;
    color: string;
    image?: string;
    description: string;
  };
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryProps) {
  const [bgImage, setBgImage] = useState(DEFAULT_CATEGORY_BG);

  useEffect(() => {
    if (category.image) {
      fetch(category.image, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            setBgImage(category.image);
          } else {
            setBgImage(DEFAULT_CATEGORY_BG);
          }
        })
        .catch(() => setBgImage(DEFAULT_CATEGORY_BG));
    }
  }, [category.image]);

  return (
    <Card
      className="bg-white hover:shadow-[#A45EE5]/20 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-0 relative h-48">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: "blur(2px) brightness(0.7)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-center">
          <div className="flex-1 flex items-center justify-center">
            <div>
              <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg">
                {category.title}
              </h3>
              <p className="text-[#D9B3FF] text-sm font-medium drop-shadow-md">
                {category.description}
              </p>
            </div>
          </div>
          <p
            className={`text-sm text-[#FF934F] italic font-medium drop-shadow-md`}
          >
            {category.subtitle}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </CardContent>
    </Card>
  );
}
