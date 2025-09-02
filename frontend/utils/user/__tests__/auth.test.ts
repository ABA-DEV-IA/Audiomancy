import { generateParticles, Particle } from "@/utils/user/auth";

describe("generateParticles", () => {
  it("génère le bon nombre de particules demandé", () => {
    const particles = generateParticles(10);
    expect(particles).toHaveLength(10);
  });

  it("utilise 15 particules par défaut si aucun argument n’est passé", () => {
    const particles = generateParticles();
    expect(particles).toHaveLength(15);
  });

  it("chaque particule a un id unique et incrémenté", () => {
    const particles = generateParticles(5);
    particles.forEach((p, index) => {
      expect(p.id).toBe(index);
    });
  });

  it("chaque particule respecte les bornes des valeurs", () => {
    const particles = generateParticles(5);
    particles.forEach((p: Particle) => {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(100);
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThanOrEqual(3);
    });
  });
});
