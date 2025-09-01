import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function POST(request: Request) {
  const { fastApiUrl, fastApiKey } = getConfig();

  const body = await request.json();

  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(`${fastApiUrl}/generate/playlist`, {
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
    console.error("Proxy error (proxyPlaylistGenerate):", err);
    return NextResponse.json({ error: "Failed to reach FastAPI /generate/playlist" }, { status: 500 });
  }
}
