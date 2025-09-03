'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Category } from '@/types/category';

const DEFAULT_CATEGORY_BG = '/images/default-category.png';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

/**
 * CategoryCard component displays a category with a background image,
 * title, description, and optional subtitle.
 */
export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const [bgImage, setBgImage] = useState(DEFAULT_CATEGORY_BG);

  useEffect(() => {
    if (!category.image) return;

    fetch(category.image, { method: 'HEAD' })
      .then((res) => setBgImage(res.ok ? category.image! : DEFAULT_CATEGORY_BG))
      .catch(() => setBgImage(DEFAULT_CATEGORY_BG));
  }, [category.image]);

  return (
    <Card
      className="bg-white hover:shadow-accent/20 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-0 relative h-48">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: 'blur(2px) brightness(0.7)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-center">
          <div className="flex-1 flex items-center justify-center">
            <div>
              <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg">
                {category.title}
              </h3>
              {category.description && (
                <p className="text-[#D9B3FF] text-sm font-medium drop-shadow-md">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          {category.subtitle && (
            <p className="text-sm text-[#FF934F] italic font-medium drop-shadow-md">
              {category.subtitle}
            </p>
          )}
        </div>

        {/* Hover shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </CardContent>
    </Card>
  );
}
