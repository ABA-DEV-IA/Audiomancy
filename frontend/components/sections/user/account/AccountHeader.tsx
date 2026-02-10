import { Sparkles } from "lucide-react"

export function AccountHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
        <Sparkles className="h-8 w-8 mr-3 text-eclat-ether" />
        Mon Profil Mystique
        <Sparkles className="h-8 w-8 ml-3 text-eclat-ether" />
      </h1>
      <p className="text-eclat-ether italic">Personnalise ton identité magique</p>
    </div>
  )
}
