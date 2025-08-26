'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types/category';
import CategoriesJSON from '@/public/categories/categories.json';

const MoodCategories: Category[] = CategoriesJSON.categories.mood;
const ActivityCategories: Category[] = CategoriesJSON.categories.activity;

export function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (id: string) => {
    router.push(`/lecture/${id}`);
  };

  const filterCategories = (categories: Category[]) =>
    categories.filter(
      (category) =>
        (category.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredMood = filterCategories(MoodCategories);
  const filteredActivity = filterCategories(ActivityCategories);

  return (
    <div className="min-h-screen flex flex-col bg-[#2B2B2B] text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#6A0DAD] text-white p-4 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-wider">RECHERCHE</h1>
        <p className="text-[#D9B3FF] italic text-sm sm:text-base">~ Trouver vos envies ~</p>
      </div>

      {/* Search bar */}
      <div className="bg-[#2B2B2B] p-6">
        <h2 className="text-xl font-semibold text-white mb-4 max-w-2xl mx-auto">Recherche</h2>
        <div className="max-w-2xl mx-auto">
          <Input
            placeholder="Recherche de la médiathèque - contenu thématique"
            className="w-full 
                        bg-[#301934] 
                        text-white 
                        placeholder-[#D9B3FF] 
                        border border-[#A45EE5] 
                        rounded-lg 
                        px-4 py-2 
                        transition-colors"            
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 p-6 space-y-10">
        {/* Section Mood */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-xl font-semibold text-white mb-3">Mood</h2>
          {filteredMood.length > 0 ? (
            filteredMood.map((result) => (
              <Card
                key={result.id}
                className="bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5] hover:bg-opacity-20 transition-colors cursor-pointer"
                onClick={() => handleClick(result.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/default-category.png';
                    }}
                  />
                  <div className="flex flex-col">
                    <h3 className="text-white font-medium">{result.title}</h3>
                    <p className="text-[#D9B3FF] text-sm">{result.description}</p>
                    <span className="text-[#FF934F] text-sm mt-1">{result.subtitle}</span>
                  </div>
                </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-white text-center">Aucun résultat trouvé.</p>
          )}
        </div>

        {/* Section Activity */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-xl font-semibold text-white mb-3">Activité</h2>
          {filteredActivity.length > 0 ? (
            filteredActivity.map((result) => (
              <Card
                key={result.id}
                className="bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5] hover:bg-opacity-20 transition-colors cursor-pointer"
                onClick={() => handleClick(result.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/default-category.png';
                    }}
                  />
                  <div className="flex flex-col">
                    <h3 className="text-white font-medium">{result.title}</h3>
                    <p className="text-[#D9B3FF] text-sm">{result.description}</p>
                    <span className="text-[#FF934F] text-sm mt-1">{result.subtitle}</span>
                  </div>
                </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-white text-center">Aucun résultat trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
