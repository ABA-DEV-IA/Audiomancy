import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function POST(request: Request) {
  const body = await request.json();
  const { fastApiUrl, fastApiKey } = getConfig();
  
  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
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

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (proxyPlaylist):", err);
    return NextResponse.json(
      { error: "Failed to reach FastAPI /jamendo/tracks" },
      { status: 500 }
    );
  }
}
