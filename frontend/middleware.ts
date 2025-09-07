import { NextRequest, NextResponse } from "next/server"
import { API_URL } from "./constants"

// Helper: decode JWT payload to read exp without verifying signature
function getJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/admin/login" || pathname === "/admin/auth/login";
  const isAuthApiPath = pathname.startsWith("/admin/auth");
  const isAdminApiPath = pathname.startsWith("/admin/api");
  const isNextApiPath = pathname.startsWith("/api");

  // Nunca interceptar endpoints de autenticación ni APIs
  if (isAuthApiPath || isNextApiPath || isAdminApiPath) {
    return NextResponse.next();
  }

  if (isAdminPath && !isLoginPath) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // If token seems expired, try refresh; otherwise allow
    const exp = getJwtExp(accessToken);
    if (exp && exp * 1000 < Date.now()) {
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_URL}/admin/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (refreshRes.ok) {
            const ct = refreshRes.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
              const data = await refreshRes.json();
              const { access_token, token_type } = data as { access_token?: string; token_type?: string };
              if (access_token && token_type) {
                const response = NextResponse.next();
                const isProd = process.env.NODE_ENV === "production";
                response.cookies.set("access_token", access_token, { httpOnly: true, sameSite: "lax", secure: isProd, path: "/admin" });
                response.cookies.set("token_type", token_type, { httpOnly: true, sameSite: "lax", secure: isProd, path: "/admin" });
                return response;
              }
            }
          }
        } catch {}
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}