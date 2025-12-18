import { ApiError, ApiResponse } from "@/common/interfaces/passwordService.interface";
import { API_URL } from "@/utils/api";

export const passwordService = {
    async requestCode(email: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email.trim() })
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al solicitar código",
                    data
                } as ApiError;
            }

            return data;
        } catch (error) {
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

    async verifyCode(email: string, code: string) {
        try {
            console.log("Verificando código:", { email, code });
            const response = await fetch(`${API_URL}/auth/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    code: code.trim() 
                })
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al verificar código",
                    data
                } as ApiError;
            }

            return data;
        } catch (error) {
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

    async resetPassword(email: string, code: string, newPassword: string) {
        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    code: code.trim(),
                    newPassword 
                })
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al restablecer contraseña",
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
    }
};