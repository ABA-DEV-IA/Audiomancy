import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { logHttp } from "@/lib/httpLogger";

export async function POST(request: Request) {
  const start = Date.now();
  const { fastApiUrl, fastApiKey } = getConfig();

  if (!fastApiUrl || !fastApiKey) {
    logHttp(request, "/api/proxyPlaylistGenerate", 500, start);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${fastApiUrl}/generate/playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    logHttp(request, "/api/proxyPlaylistGenerate", res.status, start);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (proxyPlaylistGenerate):", err);
    logHttp(request, "/api/proxyPlaylistGenerate", 500, start);
    return NextResponse.json({ error: "Failed to reach FastAPI /generate/playlist" }, { status: 500 });
  }
}
