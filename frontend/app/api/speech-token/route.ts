import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function POST(request: Request) {
  const { speechKey, speechRegion, fastApiUrl, fastApiKey } = await getConfig();

  if (!speechKey || !speechRegion) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing Speech Key or Region" },
      { status: 500 }
    );
  }

  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing FastAPI URL or API Key" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${fastApiUrl}/speech-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
      body: await request.text(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Backend error: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error (speech-token):", err);
    return NextResponse.json(
      { error: "Failed to reach backend /speech-token" },
      { status: 500 }
    );
  }
}
