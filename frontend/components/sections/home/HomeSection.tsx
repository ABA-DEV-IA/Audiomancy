'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryCard } from '@/components/sections/home/CategoryCard';
import categoriesList from '@/public/categories/categories_du_jour.json';
import { homeConfig } from '@/config/site/home.config';
import { Category } from '@/types/category';

interface HomePageProps {
  onCategoryClick?: () => void;
}

const DEFAULT_HEADER_COLOR = '#6A0DAD';

export function HomePage({ onCategoryClick }: HomePageProps = {}) {
  const { header } = homeConfig;
  const { categories } = categoriesList;
  const router = useRouter();

  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({
    backgroundColor: DEFAULT_HEADER_COLOR,
  });

  useEffect(() => {
    if (!header.background) return;

    fetch(header.background, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setHeaderStyle({
            backgroundImage: `url(${header.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          });
        } else {
          setHeaderStyle({ backgroundColor: DEFAULT_HEADER_COLOR });
        }
      })
      .catch(() => setHeaderStyle({ backgroundColor: DEFAULT_HEADER_COLOR }));
  }, [header.background]);

  const handleCategoryClick = (category: Category) => {
    sessionStorage.setItem('selectedTags', JSON.stringify(category.tags));
    router.push(`/lecture/${category.id}`);
  };

  const renderCategorySection = (title: string, items: Category[]) => (
    <div className="mb-12">
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 h-px bg-white max-w-32" />
        <span className="text-white italic mx-4 sm:mx-8 text-lg sm:text-xl">{title}</span>
        <div className="flex-1 h-px bg-white max-w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
        {items.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#2B2B2B] text-white overflow-y-auto">
      {/* Header */}
      <div
        className="sticky top-0 z-50 text-white p-4 sm:p-8 text-center transition-all duration-500"
        style={headerStyle}
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-wider">{header.title}</h1>
        <p className="text-[#D9B3FF] italic text-sm sm:text-base">{header.subtitle}</p>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-8">
        {renderCategorySection('Mood', categories.mood)}
        {renderCategorySection('Activités', categories.activity)}

        {/* Footer note */}
        <div className="text-center mt-8">
          <p className="text-[#FF934F] italic text-sm">
            (utilise chacun avec la rubrique Activités en dessous)
          </p>
        </div>
      </div>
    </div>
  );
}
