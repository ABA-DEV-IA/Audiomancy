'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface PredictionModalProps {
  onClose: () => void
  onComplete: () => void
}

export function PredictionModal({ onClose, onComplete }: PredictionModalProps) {
  const [step, setStep] = useState(1);
  const [wish, setWish] = useState('');
  const [playlistSize, setPlaylistSize] = useState(25);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Générer des particules magiques
  const generateParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  };

  // Effet de transition magique
  const magicalTransition = (nextStep: number) => {
    setIsTransitioning(true);
    generateParticles();

    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 800);
  };

  const handleStart = () => {
    magicalTransition(2);
  };

  const handleWishSubmit = () => {
    magicalTransition(3);
  };

  const handleSizeSelect = (size: number) => {
    setPlaylistSize(size);
    magicalTransition(4);

    // Simulate progress après la transition
    setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2B2B2B] rounded-lg p-8 max-w-md w-full mx-4 relative overflow-hidden">
        {/* Particules magiques */}
        {isTransitioning && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-[#D9B3FF] rounded-full animate-ping opacity-70"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: '1.5s',
                }}
              />
            ))}

            {/* Effet de lueur magique */}
            <div className="absolute inset-0 bg-gradient-radial from-[#6A0DAD]/20 via-[#A45EE5]/10 to-transparent animate-pulse" />

            {/* Étoiles scintillantes */}
            <div className="absolute top-4 left-8 text-[#FF7BAC] animate-bounce">✨</div>
            <div className="absolute top-12 right-12 text-[#4CE0B3] animate-bounce" style={{ animationDelay: '0.3s' }}>
              ⭐
            </div>
            <div
              className="absolute bottom-16 left-12 text-[#A3D5FF] animate-bounce"
              style={{ animationDelay: '0.6s' }}
            >
              💫
            </div>
            <div className="absolute bottom-8 right-8 text-[#FF934F] animate-bounce" style={{ animationDelay: '0.9s' }}>
              🌟
            </div>
          </div>
        )}

        {/* Overlay de transition */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/30 via-[#A45EE5]/20 to-[#6A0DAD]/30 animate-pulse z-10" />
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-gray-700 z-20"
        >
          <X className="h-4 w-4" />
        </Button>

        <div
          className={`text-center transition-all duration-800 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <span className="text-2xl">🔮</span>
            {isTransitioning && (
              <div className="absolute inset-0 rounded-full border-2 border-[#D9B3FF] animate-spin" />
            )}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white text-xl mb-4 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2 text-[#D9B3FF]" />
                  AUDIOMANCY
                  <Sparkles className="h-5 w-5 ml-2 text-[#D9B3FF]" />
                </h2>
                <p className="text-[#D9B3FF] mb-6">Laisse la magie du hasard te créer une playlist !</p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-[#6A0DAD] hover:bg-[#A45EE5] px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6A0DAD]/50"
              >
                Commencer
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl mb-4 flex items-center justify-center">
                <span className="mr-2">💭</span>
                Explique ton souhait
                <span className="ml-2">💭</span>
              </h2>
              <Textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Décris ce que tu souhaites..."
                className="mb-6 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF] transition-all duration-300 focus:border-[#6A0DAD] focus:shadow-lg focus:shadow-[#A45EE5]/30"
                rows={4}
              />
              <Button
                onClick={handleWishSubmit}
                className="bg-[#6A0DAD] hover:bg-[#A45EE5] px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6A0DAD]/50"
                disabled={!wish.trim()}
              >
                Valider
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl mb-6 flex items-center justify-center">
                <span className="mr-2">🎵</span>
                Taille de la playlist ?
                <span className="ml-2">🎵</span>
              </h2>
              <div className="space-y-3 mb-6">
                {[10, 25, 50].map((size) => (
                  <Button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    variant={playlistSize === size ? 'default' : 'outline'}
                    className="w-full bg-[#6A0DAD] hover:bg-[#A45EE5] border-[#A45EE5] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6A0DAD]/50"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl mb-6 flex items-center justify-center">
                <span className="mr-2 animate-spin">🌟</span>
                AUDIOMANCY consulte les astres...
                <span className="ml-2 animate-spin" style={{ animationDirection: 'reverse' }}>
                  🌟
                </span>
              </h2>
              <div className="relative">
                <Progress value={progress} className="mb-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9B3FF]/20 to-transparent animate-pulse" />
              </div>
              <p className="text-[#D9B3FF] text-sm">Création de votre playlist personnalisée en cours...</p>
              {progress === 100 && (
                <p className="text-[#4CE0B3] text-sm mt-2 animate-bounce">
                  ✨ Playlist créée ! Redirection vers la lecture...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
