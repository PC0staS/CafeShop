export const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string
) => {
    event.preventDefault();
    const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    // Debug: previsualizar respuesta sin consumir el stream principal
    try {
        const preview = await res.clone().text();
        if (preview) console.debug("login raw:", preview);
    } catch {}

    if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            const text = await res.text();
            return `Respuesta no JSON del backend: ${text.slice(0, 120)}`;
        }
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!data.ok) return data.error || "Error desconocido";
        if (typeof window !== "undefined") {
            window.location.assign("/admin");
        }
        return;
    } else {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const { error } = await res.json();
            return error;
        }
        const text = await res.text();
        return text || "Error al iniciar sesión";
    }
};