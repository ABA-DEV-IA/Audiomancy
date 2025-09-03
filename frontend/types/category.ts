export interface Category {
  id: string;          // Identifiant unique de la catégorie
  title: string;        // Nom affiché
  subtitle: string
  tags: string;        // Tags associés à la catégorie (séparés ou en JSON string)
  image?: string;      // URL de l'image représentative (optionnelle)
  description?: string; // Description optionnelle
}
