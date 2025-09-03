export interface Particle {
  id: number
  x: number
  y: number
  delay: number
}

export const generateParticles = (count = 15): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }))
}
