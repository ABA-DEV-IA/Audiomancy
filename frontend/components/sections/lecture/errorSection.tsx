import { Footer } from "@/components/layout/footer"
import { useRouter } from "next/navigation"

interface ErrorPageProps {
  error: string
}

export default function ErrorPage({ error }: ErrorPageProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#2B2B2B] text-white">
      <div className="flex flex-col flex-grow p-6">
        {/* HEADER */}
        <div className="bg-[#6A0DAD] text-white p-6 mb-6 rounded">
          <h1 className="text-2xl font-bold">Erreur</h1>
          <p className="mt-2">Une erreur est survenue lors du chargement de la playlist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-[#6A0DAD] font-semibold px-4 py-2 mt-4 rounded hover:bg-gray-100 transition"
          >
            ← Retour à l'accueil
          </button>
        </div>

        {/* ERROR MESSAGE */}
        <div className="bg-red-100 text-red-800 rounded-lg p-6 w-full max-w-3xl mx-auto shadow-lg">
          <h2 className="text-xl font-bold mb-2">Message d'erreur :</h2>
          <p className="text-sm break-words">{error}</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
