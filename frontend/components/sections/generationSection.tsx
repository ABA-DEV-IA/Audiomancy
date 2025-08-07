'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useGeneration } from '@/context/generation_context';

interface GenerationPageProps {
  onBack?: () => void
}

export function GenerationPage({ onBack }: GenerationPageProps) {
  const [step, setStep] = useState(1);
  const [wish, setWish] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setGenerationData } = useGeneration();
  const router = useRouter();

  const magicalTransition = (nextStep: number, callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
      if (callback) callback();
    }, 800);
  };

  const handleStart = () => magicalTransition(2);
  const handleWishSubmit = () => magicalTransition(3);

  const handleSizeSelect = (size: number) => {
    // Sauvegarde dans le context global
    setGenerationData({ wish, playlistSize: size });

    magicalTransition(0, () => {
      router.push('/lecture/generation'); // redirection automatique
    });
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-wider">GÉNÉRATION</h1>
        <p className="text-[#D9B3FF] italic">~ Générer vos envies ~</p>
      </div>

      <div className="flex-1 bg-[#2B2B2B] flex items-center justify-center p-8 relative">
        <div
          className={`max-w-2xl w-full transition-all duration-700 ${
            isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-2xl">
              <span className="text-4xl">🔮</span>
            </div>
          </div>

          {/* Étape 1: Accueil */}
          {step === 1 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 mr-3 text-[#D9B3FF]" />
                  Bienvenue dans l'Atelier Magique
                  <Sparkles className="h-7 w-7 ml-3 text-[#D9B3FF]" />
                </h2>
                <p className="text-[#D9B3FF] italic text-lg mb-8 max-w-lg mx-auto">
                  Laisse la magie du hasard et de l'intelligence artificielle créer une playlist parfaitement adaptée à ton âme.
                </p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
              >
                🌟 Commencer l'Incantation 🌟
              </Button>
            </div>
          )}

          {/* Étape 2: Souhait */}
          {step === 2 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <span className="mr-3 text-2xl">💭</span>
                  Exprime ton Désir Musical
                  <span className="ml-3 text-2xl">💭</span>
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8">
                  Décris ton humeur, tes envies, ou laisse libre cours à ton imagination...
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <Textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Je souhaite une playlist qui me donne de l'énergie pour commencer ma journée..."
                  className="mb-8 bg-[#301934] border-2 border-[#A45EE5] text-white placeholder:text-[#D9B3FF] text-lg p-6 min-h-32 transition-all duration-300 focus:border-[#6A0DAD] focus:shadow-2xl focus:shadow-[#A45EE5]/30 focus:scale-105"
                  rows={6}
                />
                <Button
                  onClick={handleWishSubmit}
                  className="bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] hover:from-[#A45EE5] hover:to-[#6A0DAD] px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#6A0DAD]/50"
                  disabled={!wish.trim()}
                >
                  ✨ Valider mon Souhait ✨
                </Button>
              </div>
            </div>
          )}

          {/* Étape 3: Taille */}
          {step === 3 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
                  <span className="mr-3 text-2xl">🎵</span>
                  Choisis la Puissance de ton Sort
                  <span className="ml-3 text-2xl">🎵</span>
                </h2>
                <p className="text-[#D9B3FF] text-lg mb-8">Combien de pistes magiques veux-tu dans ta playlist ?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[10, 25, 50].map((size) => {
                  const label = size === 10 ? 'Sort Mineur' : size === 25 ? 'Sort Équilibré' : 'Sort Puissant';
                  const desc = size === 10 ? 'Pour une écoute rapide' : size === 25 ? 'Le choix parfait' : 'Pour les grandes aventures';
                  const icon = size === 10 ? '🌙' : size === 25 ? '🌟' : '🔥';

                  return (
                    <div
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className="cursor-pointer flex flex-col justify-between p-6 rounded-lg bg-[#3A1E5F] hover:bg-[#4B2A7B] transition-all duration-300 border border-[#A45EE5] min-h-[220px]"
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-3">{icon}</div>
                        <h3 className="font-semibold text-white text-lg mb-1">{label}</h3>
                        <p className="text-[#D9B3FF] text-center">{desc}</p>
                      </div>
                      <p className="text-center text-xl text-[#FF934F] font-bold">{size} pistes</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
