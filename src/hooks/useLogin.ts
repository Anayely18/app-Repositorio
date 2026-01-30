import { ILoginErrors, ILoginForm, ILoginResponse } from "@/common/interfaces/login.interface";
import { authService } from "@/services/authService";
import { toastService } from "@/services/toastService";
import React, { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ILoginForm>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<ILoginErrors>({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof ILoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: ILoginErrors = { email: "", password: "" };

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
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res: ILoginResponse = await authService.login(formData);

      if (res.success) {
        // ✅ robusto: soporta token/user o token/administrator
        const payload: any = (res as any).data ?? res;
        const token =
          payload?.token ??
          payload?.data?.token ??
          payload?.user?.token ??
          payload?.administrator?.token;

        const user =
          payload?.user ??
          payload?.administrator ??
          payload?.data?.user ??
          payload?.data?.administrator;

        if (!token) {
          throw { status: 0, message: "El servidor no devolvió token." };
        }

        authService.saveSession(token, user);

        await toastService.success(res.message || "Inicio de sesión exitoso");

        // ✅ redirige sin recargar historial
        window.location.replace("/repo/dashboard");
      }
    } catch (error: any) {
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
