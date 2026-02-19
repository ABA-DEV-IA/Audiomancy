import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { logHttp } from "@/lib/httpLogger";

export async function POST(request: Request) {
  const start = Date.now();
  const { fastApiUrl, fastApiKey } = getConfig();

  if (!fastApiUrl || !fastApiKey) {
    logHttp(request, "/api/proxyPlaylist", 500, start);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${fastApiUrl}/jamendo/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
      body: JSON.stringify(body),
    });

    let data: any;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { error: await res.text() };
    }

    logHttp(request, "/api/proxyPlaylist", res.status, start);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (proxyPlaylist):", err);
    logHttp(request, "/api/proxyPlaylist", 500, start);
    return NextResponse.json(
      { error: "Failed to reach FastAPI /jamendo/tracks" },
      { status: 500 }
    );
  }
}
