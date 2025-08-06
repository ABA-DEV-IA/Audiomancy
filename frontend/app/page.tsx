"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { HomePage } from "@/components/home-page"
import { SearchPage } from "@/components/search-page"
import { AboutPage } from "@/components/about-page"
import { GenerationPage } from "@/components/generation-page"
import { Footer } from "@/components/footer"

export default function App() {
  const [currentPage, setCurrentPage] = useState("categories")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Nouvel état pour l'id du morceau sélectionné
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)

  // Aller sur la page lecture avec un morceau spécifique
  const goToLecture = (id: string) => {
    setCurrentTrackId(id)
    setCurrentPage("lecture")
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    if (page !== "lecture") {
      setCurrentTrackId(null)
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
        return <HomePage onCategoryClick={() => goToLecture("default")} />
      case "generation":
        return (
          <GenerationPage
            onBack={handleGenerationBack}
            onComplete={handleGenerationComplete}
          />
        )
      case "recherches":
        return <SearchPage onTrackClick={goToLecture} />
      case "about":
        return <AboutPage />
      default:
        return <HomePage onCategoryClick={() => goToLecture("default")} />
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
