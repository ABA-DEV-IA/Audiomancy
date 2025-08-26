import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const categoriesPath = path.join(process.cwd(), "public", "categories", "categories.json");
const categoriesDuJourPath = path.join(process.cwd(), "public", "categories", "categories_du_jour.json");

// petite fonction utilitaire pour mélanger un tableau
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() })) // attribuer une clé aléatoire
    .sort((a, b) => a.sort - b.sort) // trier par clé
    .map(({ value }) => value); // récupérer les valeurs
}

export async function GET(req: Request) {

  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.CRON_SECRET_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Lire categories.json
    const data = fs.readFileSync(categoriesPath, "utf-8");
    const categories = JSON.parse(data);

    // Mélange
    const moods = shuffleArray(categories.categories.mood).slice(0, 3);
    const activities = shuffleArray(categories.categories.activity).slice(0, 3);

    // Nouvelle structure
    const categoriesDuJour = {
      categories: {
        mood: moods,
        activity: activities,
      },
    };

    // Écrire le nouveau fichier
    fs.writeFileSync(
      categoriesDuJourPath,
      JSON.stringify(categoriesDuJour, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "categories_du_jour.json mis à jour",
      data: categoriesDuJour,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Impossible de générer les catégories du jour" },
      { status: 500 }
    );
  }
}