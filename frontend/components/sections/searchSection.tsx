'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Categories from '@/config/categories/categories.json';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function formatId(str: string | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (id: string) => {
    router.push(`/lecture/${id}`);
  };

  // Filtre les catégories selon le texte saisi
  const filteredCategories = Categories.filter((category) => category.title.toLowerCase().includes(searchTerm.toLowerCase())
    || category.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-wider">RECHERCHE</h1>
        <p className="text-[#D9B3FF] italic">~ Trouver vos envies ~</p>
      </div>

      <div className="bg-[#2B2B2B] text-white p-6">
        <h1>Recherche</h1>
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Recherche de la médiathèque - contenu thématique"
            className="pl-10 bg-white text-[#2B2B2B]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 bg-[#2B2B2B] p-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((result, index) => (
              <Card
                key={index}
                className="bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5] hover:bg-opacity-20 transition-colors cursor-pointer"
                onClick={() => handleClick(result.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{result.title}</h3>
                    <p className="text-[#D9B3FF] text-sm">{result.description}</p>
                  </div>
                  <span className="text-[#FF934F] text-sm">{result.subtitle}</span>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-white text-center mt-10">Aucun résultat trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
