import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/constants";

async function forwardUpdate(method: "PUT" | "PATCH", req: Request, id: string) {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access_token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    const body = await req.json();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `${tokenType} ${access}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    if (!res.ok) {
      const errorPayload = isJson ? await res.json() : { message: await res.text() };
      return NextResponse.json(
        { ok: false, status: res.status, error: errorPayload },
        { status: res.status }
      );
    }
    const data = isJson ? await res.json() : await res.text();
    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return forwardUpdate("PUT", req, params.id);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return forwardUpdate("PATCH", req, params.id);
}
