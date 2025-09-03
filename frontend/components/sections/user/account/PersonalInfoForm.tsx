import { User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PersonalInfoFormProps {
  username: string
  onChange: (value: string) => void
}

export function PersonalInfoForm({ username, onChange }: PersonalInfoFormProps) {
  return (
    <Card className="bg-[#2B2B2B]/90 border-[#A45EE5] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="h-5 w-5 mr-2 text-[#D9B3FF]" />
          Informations Personnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-[#D9B3FF] text-sm font-medium">Nom d'utilisateur</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
            <Input
              type="text"
              value={username}
              onChange={(e) => onChange(e.target.value)}
              className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD] transition-all duration-300"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
