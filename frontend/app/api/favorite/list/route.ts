import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL;
const FASTAPI_KEY = process.env.FASTAPI_KEY;

export async function GET(request: Request) {
  if (!FASTAPI_URL || !FASTAPI_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    // Récupérer user_id depuis l'URL
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "user_id manquant" }, { status: 400 });
    }

    // Appel FastAPI
    const res = await fetch(`${FASTAPI_URL}/favorite/list/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": FASTAPI_KEY,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (connexion):", err);
    return NextResponse.json({ error: "Failed to reach FastAPI /favorite/list" }, { status: 500 });
  }
}