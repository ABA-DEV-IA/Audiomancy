import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { logHttp } from "@/lib/httpLogger";

export async function PUT(request: Request) {
  const start = Date.now();
  const { fastApiUrl, fastApiKey } = getConfig();

  if (!fastApiUrl || !fastApiKey) {
    logHttp(request, "/api/user/proxyModify", 500, start);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${fastApiUrl}/user/modify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    logHttp(request, "/api/user/proxyModify", res.status, start);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error (connexion):", err);
    logHttp(request, "/api/user/proxyModify", 500, start);
    return NextResponse.json({ detail: "impossible de se connecter au serveur" }, { status: 500 });
  }
}
