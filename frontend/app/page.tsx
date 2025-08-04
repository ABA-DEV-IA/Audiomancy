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

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  const handleGenerationComplete = () => {
    setCurrentPage("lecture")
  }

  const handleGenerationBack = () => {
    setCurrentPage("categories")
  }

  const handlePlaylistClick = () => {
    setCurrentPage("lecture")
  }

  const handleCategoryClick = () => {
    setCurrentPage("lecture")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "categories":
        return <HomePage onCategoryClick={handleCategoryClick} />
      case "generation":
        return <GenerationPage onBack={handleGenerationBack} onComplete={handleGenerationComplete} />
      case "lecture":
        return <LecturePage />
      case "recherches":
        return <SearchPage onPlaylistClick={handlePlaylistClick} />
      case "about":
        return <AboutPage />
      default:
        return <HomePage onCategoryClick={handleCategoryClick} />
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
