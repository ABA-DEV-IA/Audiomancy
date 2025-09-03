import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function PUT(request: Request) {
  const body = await request.json();
  const { fastApiUrl, fastApiKey } = getConfig();

  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(`${fastApiUrl}/user/modify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (connexion):", err);
    return NextResponse.json({ detail: "impossible de se connecter au serveur" }, { status: 500 });
  }
}
