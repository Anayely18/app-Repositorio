import { useState } from "react";
import { authService } from "../services/authService";
import { toastService } from "../services/toastService";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Formato de correo electrónico no válido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const data = await authService.login(formData);

            if (data.success) {
                authService.saveSession(data.data?.token, data.data?.user);

                await toastService.success(
                    data.message || "Inicio de sesión exitoso"
                );

                setTimeout(() => {
                    window.location.href = "/home";
                }, 500);
            }
        } catch (error) {
            console.error("Error en login:", error);

            if (error.status === 401) {
                setErrors({
                    email: "Credenciales no válidas",
                    password: "Credenciales no válidas"
                });
            }

            toastService.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    };
};