import { Footer } from "@/components/layout/footer"
import { useRouter } from "next/navigation"

export default function LoadingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#2B2B2B] text-white">
      <div className="flex flex-col flex-grow p-6">
        {/* HEADER */}
        <div className="bg-[#6A0DAD] text-white p-6 mb-6 rounded">
          <h1 className="text-2xl font-bold">Chargement en cours</h1>
          <p className="mt-2">Récupération des pistes de la playlist...</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-[#6A0DAD] font-semibold px-4 py-2 mt-4 rounded hover:bg-gray-100 transition"
          >
            ← Retour à l'accueil
          </button>
        </div>

        {/* SPINNER */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-lg text-gray-300">Veuillez patienter...</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
