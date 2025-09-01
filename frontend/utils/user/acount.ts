export const generateParticles = (count: number = 25) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }))
}

export const isPasswordValid = (password: string) => {
  return !password || password.length >= 6
}

export const doPasswordsMatch = (newPassword: string, confirmPassword: string) => {
  return !newPassword || (newPassword === confirmPassword && confirmPassword !== "")
}
