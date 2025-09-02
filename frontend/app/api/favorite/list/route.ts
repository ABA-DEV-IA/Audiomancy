import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";


export async function GET(request: Request) {
  const { fastApiUrl, fastApiKey } = getConfig();
  if (!fastApiUrl || !fastApiKey) {
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
    const res = await fetch(`${fastApiUrl}/favorite/list/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (connexion):", err);
    return NextResponse.json({ error: "Failed to reach FastAPI /favorite/list" }, { status: 500 });
  }
}