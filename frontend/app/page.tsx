'use client';

import { useState, ReactNode } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { HomePage } from '@/components/sections/home/HomeSection';
import { SearchPage } from '@/components/sections/search/SearchSection';
import { AboutPage } from '@/components/sections/about/AboutSection';
import { GenerationPage } from '@/components/sections/generation/GenerationSection';
import { Footer } from '@/components/layout/footer';

type PageKey = 'categories' | 'generation' | 'recherches' | 'about' | 'lecture';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageKey>('categories');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const goToLecture = (id: string) => {
    setCurrentTrackId(id);
    setCurrentPage('lecture');
  };

  const handlePageChange = (page: PageKey) => {
    setCurrentPage(page);
    if (page !== 'lecture') {
      setCurrentTrackId(null);
    }
  };

  const handleGenerationComplete = () => {
    setCurrentPage('lecture');
  };

  const handleGenerationBack = () => {
    setCurrentPage('categories');
  };

  const renderPage = (): ReactNode => {
    const pages: Record<PageKey, ReactNode> = {
      categories: <HomePage onCategoryClick={() => goToLecture('default')} />,
      generation: (
        <GenerationPage
          onBack={handleGenerationBack}
          onComplete={handleGenerationComplete}
        />
      ),
      recherches: <SearchPage onTrackClick={goToLecture} />,
      about: <AboutPage />,
      lecture: <HomePage onCategoryClick={() => goToLecture('default')} />,
    };

    return pages[currentPage];
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      {/* Sidebar toujours à gauche */}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />


      {/* Main content */}
      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">

        <TopNavbar />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderPage()}
        </main>

        <Footer />
      </div>
    </div>
  );
}
