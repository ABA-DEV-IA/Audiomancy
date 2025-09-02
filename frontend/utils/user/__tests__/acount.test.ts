import { generateParticles, isPasswordValid, doPasswordsMatch } from "@/utils/user/acount";

describe("generateParticles", () => {
  it("génère le nombre de particules demandé", () => {
    const particles = generateParticles(10);
    expect(particles).toHaveLength(10);
  });

  it("attribue un id unique par particule", () => {
    const particles = generateParticles(5);
    const ids = particles.map((p) => p.id);
    expect(new Set(ids).size).toBe(5); // tous uniques
  });

  it("chaque particule a des valeurs valides", () => {
    const particles = generateParticles(3);
    particles.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(100);
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThanOrEqual(2);
    });
  });

  it("par défaut génère 25 particules", () => {
    const particles = generateParticles();
    expect(particles).toHaveLength(25);
  });
});

describe("isPasswordValid", () => {
  it("retourne true si mot de passe est vide (non obligatoire)", () => {
    expect(isPasswordValid("")).toBe(true);
  });

  it("retourne false si mot de passe a moins de 6 caractères", () => {
    expect(isPasswordValid("12345")).toBe(false);
  });

  it("retourne true si mot de passe a au moins 6 caractères", () => {
    expect(isPasswordValid("123456")).toBe(true);
    expect(isPasswordValid("superpassword")).toBe(true);
  });
});

describe("doPasswordsMatch", () => {
  it("retourne true si newPassword est vide", () => {
    expect(doPasswordsMatch("", "anything")).toBe(true);
  });

  it("retourne false si mots de passe ne correspondent pas", () => {
    expect(doPasswordsMatch("password", "different")).toBe(false);
  });

  it("retourne false si confirmPassword est vide", () => {
    expect(doPasswordsMatch("password", "")).toBe(false);
  });

  it("retourne true si les deux mots de passe correspondent et ne sont pas vides", () => {
    expect(doPasswordsMatch("secret123", "secret123")).toBe(true);
  });
});
