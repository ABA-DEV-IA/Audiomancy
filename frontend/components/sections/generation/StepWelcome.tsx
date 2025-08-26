'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-[#2B2B2B] p-8">
      <div className="w-24 h-24 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <span className="text-4xl">🔮</span>
      </div>
      <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
        <Sparkles className="h-7 w-7 mr-3 text-[#D9B3FF]" />
        Bienvenue dans l'Atelier Magique
        <Sparkles className="h-7 w-7 ml-3 text-[#D9B3FF]" />
      </h2>
      <p className="text-[#D9B3FF] italic text-lg max-w-lg mx-auto">
        Laisse la magie du hasard et de l'intelligence artificielle créer une playlist parfaitement adaptée à ton âme.
      </p>
<Button
  onClick={onNext}
  className="w-full max-w-xs sm:max-w-md bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] 
             hover:from-[#A45EE5] hover:to-[#6A0DAD] 
             px-4 sm:px-6 py-4 text-base sm:text-lg font-bold 
             flex items-center justify-center text-center whitespace-normal
             transition-all duration-300 
             hover:scale-105 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
>
  🌟 Commencer l'Incantation 🌟
</Button>    
</div>
  );
}
