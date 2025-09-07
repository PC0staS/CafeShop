import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/constants";

async function forwardUpdate(method: "PUT" | "PATCH" | "DELETE", req: Request, id: string) {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access_token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    // Build headers and optional body
    const headers: Record<string, string> = {
      ...(access ? { Authorization: `${tokenType} ${access}` } : {}),
    };
    let fetchBody: string | undefined = undefined;
    if (method === "PUT" || method === "PATCH") {
      // Only read/forward JSON body for update methods
      const body = await req.json().catch(() => ({}));
      headers["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(body);
    }

    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method,
      headers,
      ...(fetchBody ? { body: fetchBody } : {}),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    if (!res.ok) {
      // DELETE suele responder 204 sin cuerpo; si llega error, intentar parsear
      const errorPayload = isJson ? await res.json().catch(async () => ({ message: await res.text() })) : { message: await res.text() };
      return NextResponse.json(
        { ok: false, status: res.status, error: errorPayload },
        { status: res.status }
      );
    }
    // Si es 204 No Content o no hay JSON, devolver ok sin intentar parsear
    if (res.status === 204 || !isJson) {
      return NextResponse.json({ ok: true });
    }
    const data = await res.json().catch(async () => ({ text: await res.text() }));
    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forwardUpdate("PUT", req, id);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forwardUpdate("PATCH", req, id);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forwardUpdate("DELETE", req, id);
}
