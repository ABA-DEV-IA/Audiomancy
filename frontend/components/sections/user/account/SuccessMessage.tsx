import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

export function SuccessMessage() {
  return (
    <Card className="bg-[#4CE0B3]/20 border-[#4CE0B3] animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center justify-center text-[#4CE0B3]">
          <Check className="h-5 w-5 mr-2" />
          <span className="font-medium">Profil sauvegardé avec succès ! ✨</span>
        </div>
      </CardContent>
    </Card>
  )
}
