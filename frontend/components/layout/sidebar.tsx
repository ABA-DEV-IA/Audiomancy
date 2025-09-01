'use client';

import {
  Home, Sparkles, Search, Info, Menu, LogIn, UserPlus, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth_context';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  currentPage,
  onPageChange,
}: SidebarProps) {
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { id: 'categories', label: 'Catégories', icon: Home },
    { id: 'generation', label: 'Génération', icon: Sparkles },
    { id: 'recherches', label: 'Recherche', icon: Search },
    { id: 'about', label: 'À propos', icon: Info },
  ];

  const authItems = [
    { id: "login", label: "Connexion", icon: LogIn },
    { id: "register", label: "Inscription", icon: UserPlus },
  ]

  const userItems = [
    { id: "acount", label: "Mon profil", icon: User }
  ]

  const handleLogout = () => {
    logout() 
    onPageChange("login")
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#F2E9E4] border-r border-gray-300 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'} flex flex-col z-[9999]`}
    >
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="mb-4">
          <Menu className="h-5 w-5" />
        </Button>

        {isOpen && (
          <div className="mb-8">
            {isAuthenticated ? (
              <h1 className="text-xl font-bold text-[#2B2B2B] mb-2">
                Bonjour {user?.username} 👋
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-[#2B2B2B] mb-2">Bonjour !</h1>
            )}
          </div>
        )}
      </div>

      <nav className="px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-2 text-[#2B2B2B] hover:bg-[#D9B3FF] hover:text-[#6A0DAD] ${
                !isOpen ? 'px-2' : ''
              } ${currentPage === item.id ? 'bg-[#D9B3FF] text-[#6A0DAD]' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-300">
          <h3 className="text-sm font-medium text-[#6A0DAD] px-3 mb-2">Compte</h3>

        {isAuthenticated ? (
        <nav className="px-2 flex-1">
        {userItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-2 text-[#2B2B2B] hover:bg-[#D9B3FF] hover:text-[#6A0DAD] ${
                !isOpen ? 'px-2' : ''
              } ${currentPage === item.id ? 'bg-[#D9B3FF] text-[#6A0DAD]' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
      </nav>
            

        ) : (
        <nav className="px-2 flex-1">
        {authItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-2 text-[#2B2B2B] hover:bg-[#D9B3FF] hover:text-[#6A0DAD] ${
                !isOpen ? 'px-2' : ''
              } ${currentPage === item.id ? 'bg-[#D9B3FF] text-[#6A0DAD]' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>
        )}
      </div>
    </div>
  );
}
