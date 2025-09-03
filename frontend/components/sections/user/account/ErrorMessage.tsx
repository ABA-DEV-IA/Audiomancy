// ./account/ErrorMessage.tsx
"use client"

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full p-4 rounded-2xl bg-red-600/20 border border-red-500 text-red-200 text-center font-medium shadow-lg animate-fade-in">
      Erreur: {message}
    </div>
  )
}
