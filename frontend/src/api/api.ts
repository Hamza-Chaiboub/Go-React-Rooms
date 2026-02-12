function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

export async function ensureCsrf(apiUrl: string) {
    //  if cookie exists --> skip
    if (getCookie("grr_csrf")) return;
    await fetch(`${apiUrl}/auth/csrf`, { credentials: "include" });
}

export async function apiFetch(apiUrl: string, path: string, opts: RequestInit = {}) {
    const method = (opts.method || "GET").toUpperCase();

    //  ensure csrf for POST/PUT/PATCH/DELETE
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        await ensureCsrf(apiUrl);
        const token = getCookie("grr_csrf");
        opts.headers = {
            ...(opts.headers || {}),
            "X-CSRF-Token": token || "",
            "Content-Type": "application/json",
        };
    }

    return await fetch(`${apiUrl}${path}`, {
        ...opts,
        credentials: "include"
    });
}