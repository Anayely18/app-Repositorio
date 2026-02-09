export const API_URL = "/api";
export const API_URL_DOCUMENTS = "https://vrin.unamba.edu.pe/api";
// --- helpers seguros (sin importar authService para evitar ciclos) ---
const TOKEN_KEY = "token";
const LOGIN_ROUTE = "/rootrepo";

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

function clearStoredSession(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

function redirectToLogin(): void {
  if (window.location.pathname !== LOGIN_ROUTE) {
    window.location.href = LOGIN_ROUTE;
  }
}

function isFormData(body: any): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}


export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // si NO es FormData, puedes asegurar JSON (opcional)
  if (!isFormData(options.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearStoredSession();
    redirectToLogin();
  }

  return res;
}

/** helper cómodo para JSON */
export async function authFetchJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await authFetch(path, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data as T;
}
