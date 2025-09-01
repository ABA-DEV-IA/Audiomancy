import { NextResponse } from "next/server";
import Config from "@/lib/config";

export async function POST(request: Request) {
  const body = await request.json();
  const { fastApiUrl, fastApiKey } = Config;
  
  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(`${fastApiUrl}/user/create`, {
      method: "POST",
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
    return NextResponse.json({ error: "Failed to reach FastAPI /connexion" }, { status: 500 });
  }
}
