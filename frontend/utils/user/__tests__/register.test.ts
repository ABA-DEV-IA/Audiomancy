import { generateParticles, isPasswordValid, doPasswordsMatch, Particle } from "@/utils/user/register";

describe("generateParticles", () => {
  it("génère le nombre correct de particules", () => {
    const particles = generateParticles(10);
    expect(particles).toHaveLength(10);
  });

  it("génère 20 particules par défaut si aucun argument", () => {
    const particles = generateParticles();
    expect(particles).toHaveLength(20);
  });

  it("chaque particule a un id unique", () => {
    const particles = generateParticles(5);
    const ids = particles.map(p => p.id);
    expect(new Set(ids).size).toBe(5);
  });

  it("chaque particule a des valeurs x, y et delay dans les bonnes bornes", () => {
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

describe("isPasswordValid", () => {
  it("retourne false si mot de passe trop court", () => {
    expect(isPasswordValid("12345")).toBe(false);
  });

  it("retourne true si mot de passe a au moins 6 caractères", () => {
    expect(isPasswordValid("123456")).toBe(true);
    expect(isPasswordValid("superpass")).toBe(true);
  });
});

describe("doPasswordsMatch", () => {
  it("retourne true si les mots de passe correspondent et ne sont pas vides", () => {
    expect(doPasswordsMatch("secret", "secret")).toBe(true);
  });

  it("retourne false si les mots de passe ne correspondent pas", () => {
    expect(doPasswordsMatch("secret", "Secret")).toBe(false);
  });

  it("retourne false si le confirmPassword est vide ou contient que des espaces", () => {
    expect(doPasswordsMatch("secret", "")).toBe(false);
    expect(doPasswordsMatch("secret", "   ")).toBe(false);
  });

  it("retourne false si password est vide mais confirmPassword rempli", () => {
    expect(doPasswordsMatch("", "secret")).toBe(false);
  });
});
