"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface SearchPageProps {
  onPlaylistClick: () => void
}

export function SearchPage({ onPlaylistClick }: SearchPageProps) {
  const searchResults = [
    { title: "Amour et relations", category: "Amour", duration: "12:30" },
    { title: "Carrière professionnelle", category: "Carrière", duration: "8:45" },
    { title: "Santé et bien-être", category: "Santé", duration: "15:20" },
    { title: "Finances personnelles", category: "Argent", duration: "10:15" },
    { title: "Spiritualité", category: "Spirituel", duration: "20:30" },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#2B2B2B] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#D9B3FF]">RECHERCHES</h1>
          <div className="flex items-center space-x-4">
            <span className="text-[#FF934F]">●</span>
            <span className="text-[#A3D5FF]">●</span>
            <span className="text-[#4CE0B3]">●</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Recherche de la médiathèque - contenu thématique"
            className="pl-10 bg-white text-[#2B2B2B]"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 bg-[#2B2B2B] p-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {searchResults.map((result, index) => (
            <Card
              key={index}
              className="bg-[#301934] border-[#A45EE5] hover:bg-[#A45EE5] hover:bg-opacity-20 transition-colors cursor-pointer"
              onClick={onPlaylistClick}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{result.title}</h3>
                  <p className="text-[#D9B3FF] text-sm">{result.category}</p>
                </div>
                <span className="text-[#D9B3FF] text-sm">{result.duration}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
