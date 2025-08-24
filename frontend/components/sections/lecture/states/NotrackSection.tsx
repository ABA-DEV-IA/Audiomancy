import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';

export default function NoTracksPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#2B2B2B] text-white">
      <div className="flex flex-col flex-grow p-6">
        {/* HEADER */}
        <div className="mb-6 rounded bg-[#6A0DAD] p-6 text-white">
          <h1 className="text-2xl font-bold">Aucune piste trouvée</h1>
          <p className="mt-2">La playlist demandée ne contient aucun morceau.</p>
          <button
            onClick={() => router.push('/')}
            aria-label="Retour à l'accueil"
            className="mt-4 rounded bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] px-4 py-2 font-semibold text-white transition hover:scale-105"
          >
            ← Retour à l&apos;accueil
          </button>
        </div>

        {/* EMPTY STATE */}
        <div
          className="mx-auto mb-6 w-full max-w-3xl rounded-lg bg-[#301934] p-6 shadow-lg text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-[#D9B3FF] text-lg">Nous n’avons trouvé aucune piste pour cette playlist.</p>
          <p className="mt-2 text-sm text-[#FF934F]">
            Vérifiez que le nom de la playlist est correct ou essayez une autre.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
