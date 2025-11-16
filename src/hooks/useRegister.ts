import { IRegisterErrors, IRegisterForm, IRegisterResponse } from "@/common/interfaces/register.interface";
import { authService } from "@/services/authService";
import { toastService } from "@/services/toastService";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<IRegisterForm>({
        name: "",
        surname: "",
        dni: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<IRegisterErrors>({
        name: "",
        surname: "",
        dni: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newErrors: IRegisterErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Los nombres son obligatorios";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Los nombres deben tener al menos 2 caracteres";
        }

        if (!formData.surname.trim()) {
            newErrors.surname = "Los apellidos son obligatorios";
        } else if (formData.surname.trim().length < 2) {
            newErrors.surname = "Los apellidos deben tener al menos 2 caracteres";
        }

        const dniRegex = /^\d{8}$/;
        if (!formData.dni.trim()) {
            newErrors.dni = "El DNI es obligatorio";
        } else if (!dniRegex.test(formData.dni)) {
            newErrors.dni = "El DNI debe tener 8 dígitos numéricos";
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Debe confirmar su contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const data: IRegisterResponse = await authService.register(formData);

            if (data.success) {
                await toastService.success(
                    data.message || "Tu cuenta ha sido creada correctamente"
                );

                setFormData({
                    name: "",
                    surname: "",
                    dni: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });

                setTimeout(() => {
                    navigate("/login");
                }, 500);
            }
        } catch (error: any) {
            console.error("Error en registro:", error);

            if (error.status === 409) {
                if (error.message.includes("dni")) {
                    setErrors(prev => ({ ...prev, dni: error.message }));
                } else if (error.message.includes("correo")) {
                    setErrors(prev => ({ ...prev, email: error.message }));
                }
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