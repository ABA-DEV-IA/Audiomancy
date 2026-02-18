import { Button } from "@/components/ui/button"
import { Save, Sparkles } from "lucide-react"

interface SaveButtonProps {
  isLoading: boolean
  disabled: boolean
}

export function SaveButton({ isLoading, disabled }: SaveButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        type="submit"
        disabled={disabled}
        className="bg-gradient-to-r from-encre-astrale to-amethyste-magique hover:from-amethyste-magique hover:to-encre-astrale text-white font-bold w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-encre-astrale/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
            Sauvegarde en cours...
          </div>
        ) : (
          <div className="flex items-center">
            <Save className="h-6 w-6 mr-3" /> Sauvegarder les modifications <Sparkles className="h-6 w-6 ml-3" />
          </div>
        )}
      </Button>
    </div>
  )
}
