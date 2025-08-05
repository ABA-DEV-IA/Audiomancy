"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { HomePage } from "@/components/home-page"
import { LecturePage } from "@/components/lecture-page"
import { SearchPage } from "@/components/search-page"
import { AboutPage } from "@/components/about-page"
import { GenerationPage } from "@/components/generation-page"
import { Footer } from "@/components/footer"

export default function App() {
  const [currentPage, setCurrentPage] = useState("categories")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>("default") // playlist par défaut

  // Aller sur la page lecture avec un morceau spécifique et playlist associée
  const goToLecture = (trackId: string, playlistId: string = "default") => {
    setCurrentTrackId(trackId)
    setCurrentPlaylistId(playlistId)
    setCurrentPage("lecture")
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    if (page !== "lecture") {
      setCurrentTrackId(null)
      setCurrentPlaylistId(null)
    }
  }

  const handleGenerationComplete = () => {
    setCurrentPage("lecture")
  }

  const handleGenerationBack = () => {
    setCurrentPage("categories")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "categories":
        // Ici il faut que HomePage appelle onCategoryClick avec un vrai trackId
        // Par exemple :
        return <HomePage onCategoryClick={(trackId: string) => goToLecture(trackId, "default")} />
      case "generation":
        return (
          <GenerationPage
            onBack={handleGenerationBack}
            onComplete={handleGenerationComplete}
          />
        )
      case "lecture":
        return (
          <LecturePage
            trackId={currentTrackId}
            playlistId={currentPlaylistId}
          />
        )
      case "recherches":
        // Ici onTrackClick doit passer aussi playlistId si besoin, sinon "default"
        return <SearchPage onTrackClick={(trackId: string) => goToLecture(trackId, "default")} />
      case "about":
        return <AboutPage />
      default:
        return <HomePage onCategoryClick={(trackId: string) => goToLecture(trackId, "default")} />
    }
  }

  return (
    <div className="flex h-screen bg-[#F2E9E4]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-hidden">{renderPage()}</main>
        <Footer />
      </div>
    </div>
  )
}
