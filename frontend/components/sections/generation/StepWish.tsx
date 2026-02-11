'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface StepWishProps {
  wish: string;
  setWish: (value: string) => void;
  onNext: () => void;
}

export function StepWish({ wish, setWish, onNext }: StepWishProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-ombre-occulte p-8">
      <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
        <span className="mr-3 text-2xl">💭</span>
        Exprime ton Désir Musical
        <span className="ml-3 text-2xl">💭</span>
      </h2>
      <p className="text-eclat-ether text-lg mb-8">
        Décris ton humeur, tes envies, ou laisse libre cours à ton imagination...
      </p>
      <div className="max-w-lg w-full">
        <Textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="Je souhaite une playlist qui me donne de l'énergie pour commencer ma journée..."
          rows={6}
          className="mb-8 bg-brume-cosmique border-2 border-amethyste-magique text-white placeholder:text-eclat-ether text-lg p-6 min-h-32 transition-all duration-300 focus:border-encre-astrale focus:shadow-2xl focus:shadow-amethyste-magique/30 focus:scale-105"
        />

        <div className="flex flex-col sm:flex-row w-full gap-4 mt-6">
          <Button
            onClick={onNext}
            disabled={!wish.trim()}
            className="w-full bg-gradient-to-r from-encre-astrale to-amethyste-magique 
                      hover:from-amethyste-magique hover:to-encre-astrale 
                      px-4 py-4 text-base sm:text-lg font-bold 
                      flex items-center justify-center text-center whitespace-normal
                      transition-all duration-300 
                      hover:scale-110 hover:shadow-2xl hover:shadow-encre-astrale/50"
          >
            ✨ Valider mon Souhait ✨
          </Button>
        </div>
      </div>
    </div>
  );
}
