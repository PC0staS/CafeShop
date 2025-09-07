import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/constants";

type BackendLoginResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
    }

    const backendRes = await fetch(`${API_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = backendRes.headers.get("content-type") || "";
    if (!backendRes.ok) {
      if (contentType.includes("application/json")) {
        const data = (await backendRes.json()) as BackendLoginResponse;
        return NextResponse.json({ error: data.error || "Credenciales inválidas" }, { status: backendRes.status });
      }
      const text = await backendRes.text();
      return NextResponse.json({ error: text || "Error en el login" }, { status: backendRes.status });
    }

    if (!contentType.includes("application/json")) {
      const text = await backendRes.text();
      return NextResponse.json({ error: `Respuesta no JSON del backend: ${text.slice(0, 120)}` }, { status: 502 });
    }

    const data = (await backendRes.json()) as BackendLoginResponse;
    const { access_token, refresh_token, token_type } = data;
    if (!access_token || !refresh_token || !token_type) {
      return NextResponse.json({ error: "Respuesta inválida del servidor" }, { status: 502 });
    }

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });
    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/admin",
    });
    res.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/admin",
    });
    res.cookies.set("token_type", token_type, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/admin",
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}
