import { ApiError, ApiResponse, LoginCredentials, RegisterData } from "@/common/interfaces/authService.interface";
import { API_URL } from "@/utils/api";

export const authService = {
    async login(credentials: LoginCredentials): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: credentials.email.trim(),
                    password: credentials.password
                })
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al iniciar sesión",
                    data
                } as ApiError;
            }

            return data;
        } catch (error: any) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: "No se pudo conectar con el servidor. Por favor, intente más tarde.",
                error
            } as ApiError;
        }
    },

    async register(userData: RegisterData): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: userData.name.trim(),
                    surname: userData.surname.trim(),
                    dni: userData.dni.trim(),
                    email: userData.email.trim(),
                    password: userData.password
                })
            });
            
            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al registrar usuario",
                    data
                } as ApiError;
            }

            return data;
        } catch (error: any) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: "No se pudo conectar con el servidor. Por favor, intente más tarde.",
                error
            } as ApiError;
        }
    },

    saveSession(token: string, user): any {
        if (token) {
            localStorage.setItem("token", token);
        }
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    },

    clearSession() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    getUser(): any | null {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
};
