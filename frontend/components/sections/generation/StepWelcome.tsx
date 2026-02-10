'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-ombre-occulte p-8">
      <div className="w-24 h-24 bg-gradient-to-br from-encre-astrale to-amethyste-magique rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <span className="text-4xl">🔮</span>
      </div>
      <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
        <Sparkles className="h-7 w-7 mr-3 text-eclat-ether" />
        Bienvenue dans l'Atelier Magique
        <Sparkles className="h-7 w-7 ml-3 text-eclat-ether" />
      </h2>
      <p className="text-eclat-ether italic text-lg max-w-lg mx-auto">
        Laisse la magie du hasard et de l'intelligence artificielle créer une playlist parfaitement adaptée à ton âme.
      </p>
<Button
  onClick={onNext}
  className="w-full max-w-xs sm:max-w-md bg-gradient-to-r from-encre-astrale to-amethyste-magique 
             hover:from-amethyste-magique hover:to-encre-astrale 
             px-4 sm:px-6 py-4 text-base sm:text-lg font-bold 
             flex items-center justify-center text-center whitespace-normal
             transition-all duration-300 
             hover:scale-105 hover:shadow-2xl hover:shadow-encre-astrale/50"
>
  🌟 Commencer l'Incantation 🌟
</Button>    
</div>
  );
}
