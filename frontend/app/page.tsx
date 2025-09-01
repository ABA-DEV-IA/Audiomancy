'use client';

import { useState, useEffect, ReactNode } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { HomePage } from '@/components/sections/home/HomeSection';
import { SearchPage } from '@/components/sections/search/SearchSection';
import { AboutPage } from '@/components/sections/about/AboutSection';
import { GenerationPage } from '@/components/sections/generation/GenerationSection';
import { Footer } from '@/components/layout/footer';
import { AuthPage } from '@/components/sections/user/AuthSection';
import { AccountPage } from '@/components/sections/user/AccountSection'
import { RegisterPage } from '@/components/sections/user/RegisterSection';
import { FavoritesContainer } from '@/components/sections/favorite/favorites-container';


type PageKey = 'categories' | 'generation' | 'favorites' | 'recherches' | 'about' | 'lecture' | 'login' | 'register' | 'acount';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageKey>('categories');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile → sidebar fermée
        setSidebarOpen(false);
      } else if (window.innerWidth < 1024) {
        // Tablette → sidebar réduite
        setSidebarOpen(false); // réduite (donc juste l’icône)
      } else {
        // Desktop → sidebar ouverte
        setSidebarOpen(true);
      }
    };

    handleResize(); // appel initial
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      generation: <GenerationPage onBack={handleGenerationBack} onComplete={handleGenerationComplete} />,
      favorites: <FavoritesContainer />,
      recherches: <SearchPage onTrackClick={goToLecture} />,
      about: <AboutPage />,
      lecture: <HomePage onCategoryClick={() => goToLecture('default')} />,
      login: <AuthPage onLoginSuccess={() => setCurrentPage('categories')} onSwitchToRegister={() => setCurrentPage('register')} />,
      register: <RegisterPage onRegisterSuccess={() => setCurrentPage('categories')} onSwitchToLogin={() => setCurrentPage('login')} />,
      acount: <AccountPage />
    };

    return pages[currentPage];
  };

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-background">
      {/* Sidebar en overlay */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Main content, décalé de la sidebar réduite */}
      <div className="flex flex-1 flex-col min-h-screen overflow-hidden pl-16 transition-all duration-300">
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
