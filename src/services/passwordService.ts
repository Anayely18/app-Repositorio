import { API_URL } from "../utils/api.js";

export const passwordService = {
    async requestCode(email) {
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al solicitar código",
                    data
                };
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
            };
        }
    },

    async verifyCode(email, code) {
        try {
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

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al verificar código",
                    data
                };
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
            };
        }
    },

    async resetPassword(email, code, newPassword) {
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

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al restablecer contraseña",
                    data
                };
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
            };
        }
    }
};