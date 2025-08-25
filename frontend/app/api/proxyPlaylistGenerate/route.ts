import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL; // ex: https://mon-backend.azurewebsites.net
const FASTAPI_KEY = process.env.FASTAPI_KEY;

export async function POST(request: Request) {
  const body = await request.json();

  if (!FASTAPI_URL || !FASTAPI_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(`${FASTAPI_URL}/generate/playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": FASTAPI_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch FastAPI /generate/playlist" }, { status: 500 });
  }
}
