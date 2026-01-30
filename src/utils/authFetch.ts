import { API_URL } from "@/utils/api";
import { authService } from "@/services/authService";

type AuthFetchOptions = RequestInit & {
  json?: any; // si mandas json, se serializa y agrega Content-Type
};

export async function authFetch(path: string, options: AuthFetchOptions = {}) {
  const token = authService.getToken();

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Si envían json, ponemos body y Content-Type
  let body = options.body;
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  }

  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, { ...options, headers, body });

  // Si el token caducó o es inválido
  if (res.status === 401) {
    authService.clearSession();
    window.location.replace("repo/admi-sigori2025"); // tu login está en /admin
  }

  return res;
}
