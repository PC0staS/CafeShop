import { NextResponse } from "next/server";

async function clearCookies() {
	const res = NextResponse.json({ ok: true });
	const isProd = process.env.NODE_ENV === "production";
	const common = { httpOnly: true as const, sameSite: "lax" as const, secure: isProd, path: "/admin" };
	// Borrar cookies poniendo fecha expirada
	res.cookies.set("access_token", "", { ...common, expires: new Date(0) });
	res.cookies.set("refresh_token", "", { ...common, expires: new Date(0) });
	res.cookies.set("token_type", "", { ...common, expires: new Date(0) });
	return res;
}

export async function POST() {
	return await clearCookies();
}

export async function GET() {
	// Permitir logout vía GET también
	return await clearCookies();
}

