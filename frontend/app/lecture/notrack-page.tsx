import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"

export default function NoTracksPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#2B2B2B] text-white">
      <div className="flex flex-col flex-grow p-6">
        {/* HEADER */}
        <div className="bg-[#6A0DAD] text-white p-6 mb-6 rounded">
          <h1 className="text-2xl font-bold">Aucune piste trouvée</h1>
          <p className="mt-2">La playlist demandée ne contient aucun morceau.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-[#6A0DAD] font-semibold px-4 py-2 mt-4 rounded hover:bg-gray-100 transition"
          >
            ← Retour à l'accueil
          </button>
        </div>

        {/* EMPTY STATE */}
        <div className="bg-[#1E1E1E] text-gray-300 rounded-lg p-6 w-full max-w-3xl mx-auto shadow-lg text-center">
          <p className="text-lg">Nous n’avons trouvé aucune piste pour cette playlist.</p>
          <p className="text-sm mt-2 text-gray-400">Vérifiez que l’ID de la playlist est correct ou essayez une autre.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
