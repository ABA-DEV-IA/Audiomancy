export interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export const generateParticles = (count = 20): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

export const isPasswordValid = (password: string): boolean =>
  password.length >= 6;

export const doPasswordsMatch = (password: string, confirmPassword: string): boolean =>
  password === confirmPassword && confirmPassword.trim() !== "";
