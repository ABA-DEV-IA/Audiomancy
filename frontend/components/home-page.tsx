"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import categoriesList from "@/config/categories.json"; // Ton JSON
import { homeConfig } from "@/config/home.config";
import { CategoryCard } from "@/components/category-card";

interface HomePageProps {
  onCategoryClick?: () => void;
}

const DEFAULT_HEADER_COLOR = "#6A0DAD"; // Couleur fallback
const DEFAULT_CATEGORY_BG = "/images/default-category.png";

export function HomePage({ onCategoryClick }: HomePageProps = {}) {
  const { header } = homeConfig;
  const { categories } = categoriesList;

  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({
    backgroundColor: DEFAULT_HEADER_COLOR,
  });

  // ✅ Vérifie si l'image du header existe
  useEffect(() => {
    if (header.background) {
      fetch(header.background, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            setHeaderStyle({
              backgroundImage: `url(${header.background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            });
          } else {
            setHeaderStyle({ backgroundColor: DEFAULT_HEADER_COLOR });
          }
        })
        .catch(() => setHeaderStyle({ backgroundColor: DEFAULT_HEADER_COLOR }));
    } else {
      setHeaderStyle({ backgroundColor: DEFAULT_HEADER_COLOR });
    }
  }, [header.background]);

  const handleCategoryClick = () => {
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* ✅ Section header avec fallback couleur */}
      <div
        className="text-white p-8 text-center transition-all duration-500"
        style={headerStyle}
      >
        <h1 className="text-4xl font-bold mb-2 tracking-wider">{header.title}</h1>
        <p className="text-[#D9B3FF] italic">{header.subtitle}</p>
      </div>

      {/* Section principale */}
      <div className="flex-1 bg-[#2B2B2B] p-8">
        {/* Header avec icônes */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-8">
            <span className="text-black text-sm">🔮</span>
          </div>
          <h2 className="text-[#D9B3FF] text-2xl font-bold tracking-wider">
            CATÉGORIES
          </h2>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-8">
            <span className="text-black text-sm">🔮</span>
          </div>
        </div>

        {/* 🔹 Section Mood */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-white max-w-32"></div>
            <span className="text-white italic mx-8 text-xl">Mood</span>
            <div className="flex-1 h-px bg-white max-w-32"></div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            {categories.mood.map((category, index) => (
              <CategoryCard
                key={`mood-${index}`}
                category={category}
                fallbackImage={DEFAULT_CATEGORY_BG} // ✅ Fallback image pour les cartes
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* 🔹 Section Activités */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-white max-w-32"></div>
            <span className="text-white italic mx-8 text-xl">Activités</span>
            <div className="flex-1 h-px bg-white max-w-32"></div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            {categories.activity.map((category, index) => (
              <CategoryCard
                key={`activity-${index}`}
                category={category}
                fallbackImage={DEFAULT_CATEGORY_BG} // ✅ Fallback image pour les cartes
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[#FF934F] italic text-sm">
            (utilise chacun avec la rubrique Activités en dessous)
          </p>
        </div>
      </div>
    </div>
  );
}
