import {
  ApiError,
  ApiResponse,
  LoginCredentials,
  RegisterData,
} from "@/common/interfaces/authService.interface";
import { API_URL } from "@/utils/api";

type StorageMode = "local" | "session";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || "Error al iniciar sesión",
          data,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message:
          "No se pudo conectar con el servidor. Por favor, intente más tarde.",
        error,
      } as ApiError;
    }
  },

  async register(userData: RegisterData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name.trim(),
          surname: userData.surname.trim(),
          dni: userData.dni.trim(),
          email: userData.email.trim(),
          password: userData.password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || "Error al registrar usuario",
          data,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message:
          "No se pudo conectar con el servidor. Por favor, intente más tarde.",
        error,
      } as ApiError;
    }
  },

  // ✅ mantiene compatibilidad: saveSession(token, user)
  // ✅ extra opcional: saveSession(token, user, "session") para sessionStorage
  saveSession(token: string, user: any, mode: StorageMode = "local"): void {
    // limpia ambos para evitar tokens duplicados
    this.clearSession();

    const storage = mode === "session" ? sessionStorage : localStorage;

    if (token) storage.setItem("token", token);
    if (user) storage.setItem("user", JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },

  // ✅ para tu botón de logout
  logout(): void {
    this.clearSession();
  },

  // ✅ busca primero localStorage, si no existe prueba sessionStorage
  getToken(): string | null {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token");
  },

  getUser(): any | null {
    const user =
      localStorage.getItem("user") ?? sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
