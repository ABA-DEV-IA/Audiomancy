import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

export function SuccessMessage() {
  return (
    <Card className="bg-vert-dragon/20 border-vert-dragon animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center justify-center text-vert-dragon">
          <Check className="h-5 w-5 mr-2" />
          <span className="font-medium">Profil sauvegardé avec succès ! ✨</span>
        </div>
      </CardContent>
    </Card>
  )
}
