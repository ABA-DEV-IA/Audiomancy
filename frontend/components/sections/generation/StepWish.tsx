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
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-[#2B2B2B] p-8">
      <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
        <span className="mr-3 text-2xl">💭</span>
        Exprime ton Désir Musical
        <span className="ml-3 text-2xl">💭</span>
      </h2>
      <p className="text-[#D9B3FF] text-lg mb-8">
        Décris ton humeur, tes envies, ou laisse libre cours à ton imagination...
      </p>
      <div className="max-w-lg w-full">
        <Textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="Je souhaite une playlist qui me donne de l'énergie pour commencer ma journée..."
          rows={6}
          className="mb-8 bg-[#301934] border-2 border-[#A45EE5] text-white placeholder:text-[#D9B3FF] text-lg p-6 min-h-32 transition-all duration-300 focus:border-[#6A0DAD] focus:shadow-2xl focus:shadow-[#A45EE5]/30 focus:scale-105"
        />
        <Button
          onClick={onNext}
          disabled={!wish.trim()}
          className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
        >
          ✨ Valider mon Souhait ✨
        </Button>
      </div>
    </div>
  );
}
