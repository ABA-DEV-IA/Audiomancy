/**
 * [DÉSACTIVÉ] Azure Speech Token Proxy
 *
 * This route was used to proxy Azure Speech token requests to the backend.
 * Disabled as part of the migration to a fully local stack without Azure services.
 *
 * Alternative: Future implementation with local TTS (Piper, Coqui, etc.)
 */

import { NextResponse } from "next/server";
// import { getConfig } from "@/lib/config";

export async function POST(request: Request) {
  // [DÉSACTIVÉ] Azure Speech TTS
  return NextResponse.json(
    { error: "Azure Speech service disabled - local-only stack" },
    { status: 501 }
  );

  /*
  const { fastApiUrl, fastApiKey } = getConfig();

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
  */
}
