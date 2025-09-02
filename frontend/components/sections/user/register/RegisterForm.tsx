"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isPasswordValid, doPasswordsMatch } from "@/utils/user/register";

interface RegisterFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  acceptTerms: boolean;
  isLoading: boolean;
  error: string | null;
  onChange: (field: string, value: string) => void;
  onToggleTerms: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  formData,
  acceptTerms,
  isLoading,
  error,
  onChange,
  onToggleTerms,
  onSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validPassword = isPasswordValid(formData.password);
  const passwordsMatch = doPasswordsMatch(formData.password, formData.confirmPassword);
  const isFormValid =
    formData.username.trim() !== "" &&
    formData.email.trim() !== "" &&
    validPassword &&
    passwordsMatch &&
    acceptTerms;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Nom d'utilisateur */}
      <div className="space-y-2">
        <label className="text-[#D9B3FF] text-sm font-medium">Nom d'utilisateur</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="Ton nom mystique"
            className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-[#D9B3FF] text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="ton-email@exemple.com"
            className="pl-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
            required
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div className="space-y-2">
        <label className="text-[#D9B3FF] text-sm font-medium">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
          <Input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A45EE5]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs text-[#D9B3FF]/80">
          {validPassword ? (
            <span className="text-[#4CE0B3] flex items-center">
              <Check className="h-3 w-3 mr-1" /> Mot de passe valide
            </span>
          ) : (
            "Minimum 6 caractères"
          )}
        </div>
      </div>

      {/* Confirmation */}
      <div className="space-y-2">
        <label className="text-[#D9B3FF] text-sm font-medium">Confirmer le mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A45EE5] h-5 w-5" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
            className="pl-12 pr-12 bg-[#301934] border-[#A45EE5] text-white placeholder:text-[#D9B3FF]/60 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A45EE5]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs text-[#D9B3FF]/80">
          {formData.confirmPassword &&
            (passwordsMatch ? (
              <span className="text-[#4CE0B3] flex items-center">
                <Check className="h-3 w-3 mr-1" /> Les mots de passe correspondent
              </span>
            ) : (
              <span className="text-[#FF7BAC]">Les mots de passe ne correspondent pas</span>
            ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="flex items-start space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-5 w-5 rounded border-2 ${
            acceptTerms ? "bg-[#4CE0B3] border-[#4CE0B3]" : "border-[#A45EE5]"
          }`}
          onClick={onToggleTerms}
        >
          {acceptTerms && <Check className="h-3 w-3" />}
        </Button>
        <div className="text-sm text-[#D9B3FF]">
          J'accepte les politique de confidentialité
          et la politique de confidentialité
        </div>
      </div>

      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] text-white font-bold py-3"
      >
        {isLoading ? "Création du compte..." : "Créer mon compte"}
      </Button>
    </form>
  );
}
