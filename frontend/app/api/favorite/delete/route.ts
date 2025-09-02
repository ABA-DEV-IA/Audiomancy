import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";


export async function DELETE(request: Request, { params }: { params: { favorite_id: string }}) {
  const { fastApiUrl, fastApiKey } = getConfig();
  if (!fastApiUrl || !fastApiKey) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  if (!user_id) return NextResponse.json({ error: "user_id manquant" }, { status: 400 });

  try {
    const res = await fetch(`${fastApiUrl}/favorite/delete/${params.favorite_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": fastApiKey,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reach FastAPI /favorite/delete" }, { status: 500 });
  }
}