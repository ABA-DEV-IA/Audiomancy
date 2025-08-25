'use client';

interface StepSizeProps {
  onSelect: (size: number) => void;
}

export function StepSize({ onSelect }: StepSizeProps) {
  const sizes = [
    { size: 10, label: 'Sort Mineur', desc: 'Pour une écoute rapide', icon: '🌙' },
    { size: 25, label: 'Sort Équilibré', desc: 'Le choix parfait', icon: '🌟' },
    { size: 50, label: 'Sort Puissant', desc: 'Pour les grandes aventures', icon: '🔥' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-[#2B2B2B] p-8">
      <h2 className="text-white text-3xl font-bold mb-4 flex items-center justify-center">
        <span className="mr-3 text-2xl">🎵</span>
        Choisis la Puissance de ton Sort
        <span className="ml-3 text-2xl">🎵</span>
      </h2>
      <p className="text-[#D9B3FF] text-lg mb-8">Combien de pistes magiques veux-tu dans ta playlist ?</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto w-full">
        {sizes.map(({ size, label, desc, icon }) => (
          <div
            key={size}
            onClick={() => onSelect(size)}
            className="cursor-pointer flex flex-col justify-between p-6 rounded-lg bg-[#3A1E5F] hover:bg-[#4B2A7B] transition-all duration-300 border border-[#A45EE5] min-h-[220px]"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-semibold text-white text-lg mb-1">{label}</h3>
              <p className="text-[#D9B3FF] text-center">{desc}</p>
            </div>
            <p className="text-center text-xl text-[#FF934F] font-bold">{size} pistes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
