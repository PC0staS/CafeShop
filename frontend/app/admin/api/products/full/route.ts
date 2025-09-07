import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/constants";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access_token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    const payload = await req.json();
    const res = await fetch(`${API_URL}/admin/products/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `${tokenType} ${access}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    if (!res.ok) {
      const errorPayload = isJson ? await res.json().catch(async () => ({ message: await res.text() })) : { message: await res.text() };
      return NextResponse.json({ ok: false, status: res.status, error: errorPayload }, { status: res.status });
    }
    if (!isJson) {
      const text = await res.text();
      return NextResponse.json({ ok: true, data: { text } });
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
