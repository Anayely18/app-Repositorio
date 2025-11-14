import { API_URL } from "../utils/api.js";

export const authService = {
    async login(credentials) {
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

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al iniciar sesión",
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

    async register(userData) {
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

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error al registrar usuario",
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

    saveSession(token, user) {
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

    getToken() {
        return localStorage.getItem("token");
    },

    getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
};