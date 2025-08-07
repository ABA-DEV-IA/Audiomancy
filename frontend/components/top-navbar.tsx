'use client';

import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNavbar() {
  return (
    <div className="bg-[#2B2B2B] text-white p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <span className="text-black text-sm font-bold">🔮</span>
      </div>

      {/* Espace central vide */}
      <div className="flex-1" />

      {/* User Icon */}
      <div className="flex items-center">
        {/* <Button variant="ghost" size="icon" className="text-[#A3D5FF]">
          <User className="h-5 w-5" />
        </Button> */}
      </div>
    </div>
  );
}
