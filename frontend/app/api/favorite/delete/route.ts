import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL;
const FASTAPI_KEY = process.env.FASTAPI_KEY;


export async function DELETE(request: Request, { params }: { params: { favorite_id: string }}) {
  if (!FASTAPI_URL || !FASTAPI_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id manquant" }, { status: 400 });

  try {
    const res = await fetch(`${FASTAPI_URL}/favorite/delete/${params.favorite_id}?user_id=${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": FASTAPI_KEY,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reach FastAPI /favorite/delete" }, { status: 500 });
  }
}