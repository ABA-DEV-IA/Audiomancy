'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGeneration } from '@/context/generation_context';
import { StepWelcome } from './StepWelcome';
import { StepWish } from './StepWish';
import { StepSize } from './StepSize';

export function GenerationPage({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [wish, setWish] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { setGenerationData } = useGeneration();
  const router = useRouter();

  const magicalTransition = (nextStep: number, callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep as 1 | 2 | 3);
      setIsTransitioning(false);
      if (callback) callback();
    }, 800);
  };

  const handleSizeSelect = (size: number) => {
    setGenerationData({ wish, playlistSize: size });
    magicalTransition(0, () => router.push('/lecture/generation'));
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#2B2B2B] p-8">
  <div
    className={`flex flex-1 justify-center items-center transition-all duration-700 ${
      isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
    }`}
  >
    <div className="max-w-2xl w-full">
      {step === 1 && <StepWelcome onNext={() => magicalTransition(2)} />}
      {step === 2 && <StepWish wish={wish} setWish={setWish} onNext={() => magicalTransition(3)} />}
      {step === 3 && <StepSize onSelect={handleSizeSelect} />}
    </div>
  </div>
</div>
  );
}
