import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL;
const FASTAPI_KEY = process.env.FASTAPI_KEY;

export async function POST(request: Request) {
  const body = await request.json();
  console.log(JSON.stringify(body));
  if (!FASTAPI_URL || !FASTAPI_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(`${FASTAPI_URL}/jamendo/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": FASTAPI_KEY,
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
