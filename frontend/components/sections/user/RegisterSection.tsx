"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth_context";
import { register as registerService } from "@/services/userService";
import { User as UserType } from "@/types/user";
import { RegisterForm } from "@/components/sections/user/register/RegisterForm";
import { generateParticles, Particle } from "@/utils/user/register";
import { Button } from "@/components/ui/button";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setParticles(generateParticles());

    try {
      const user: UserType = await registerService(formData.email, formData.username, formData.password);
      login(user);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || "Échec de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B2B2B] via-[#301934] to-[#6A0DAD] flex items-center justify-center relative overflow-hidden p-4">
      {/* Particules décoratives */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#D9B3FF] rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      {/* Particules inscription */}
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-[#4CE0B3] rounded-full animate-ping opacity-80"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: "2.5s",
              }}
            />
          ))}
        </div>
      )}

      <Card className="w-full max-w-md bg-[#2B2B2B]/90 border-[#A45EE5] relative z-20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6A0DAD] to-[#A45EE5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-3xl">🔮</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-[#D9B3FF]" />
              AUDIOMANCY
              <Sparkles className="h-6 w-6 ml-2 text-[#D9B3FF]" />
            </h1>
            <p className="text-[#D9B3FF] italic">Rejoins la communauté magique</p>
          </div>

          {/* Formulaire */}
          <RegisterForm
            formData={formData}
            acceptTerms={acceptTerms}
            isLoading={isLoading}
            error={error}
            onChange={handleChange}
            onToggleTerms={() => setAcceptTerms(!acceptTerms)}
            onSubmit={handleSubmit}
          />

          {/* Switch to login */}
          <div className="mt-6 text-center text-[#D9B3FF] text-sm">
            Déjà un compte ?{" "}
            <Button variant="link" className="text-[#FF7BAC] p-0 h-auto" onClick={onSwitchToLogin}>
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
