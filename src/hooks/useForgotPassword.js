import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordService } from "../services/passwordService";
import { toastService } from "../services/toastService";

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); 
    
    const [formData, setFormData] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: ""
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

    const handleRequestCode = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            setErrors(prev => ({ ...prev, email: "El correo es obligatorio" }));
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: "Formato de correo electrónico no válido" }));
            return;
        }

        setIsLoading(true);

        try {
            const data = await passwordService.requestCode(formData.email);
            
            if (data.success) {
                toastService.success("Código enviado a tu correo. Revisa tu bandeja de entrada.");
                setStep(2); 
            }
        } catch (error) {
            console.error("Error al solicitar código:", error);
            
            if (error.status === 404) {
                setErrors(prev => ({ 
                    ...prev, 
                    email: "No existe una cuenta con este correo" 
                }));
            }

            toastService.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (!formData.code.trim()) {
            setErrors(prev => ({ ...prev, code: "El código es obligatorio" }));
            return;
        }
        if (formData.code.trim().length !== 6) {
            setErrors(prev => ({ ...prev, code: "El código debe tener 6 dígitos" }));
            return;
        }

        setIsLoading(true);

        try {
            const data = await passwordService.verifyCode(formData.email, formData.code);
            
            if (data.success) {
                toastService.success("Código verificado correctamente");
                setStep(3); 
            }
        } catch (error) {
            console.error("Error al verificar código:", error);
            
            if (error.status === 400) {
                setErrors(prev => ({ 
                    ...prev, 
                    code: "Código inválido o expirado" 
                }));
            }

            toastService.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = "La contraseña es obligatoria";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Debe confirmar su contraseña";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }

        setIsLoading(true);

        try {
            const data = await passwordService.resetPassword(
                formData.email, 
                formData.code, 
                formData.newPassword
            );
            
            if (data.success) {
                await toastService.success("Contraseña actualizada exitosamente");
                
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (error) {
            console.error("Error al restablecer contraseña:", error);

            if (error.status === 400) {
                toastService.error("El código ha expirado. Por favor, solicita uno nuevo.");
                setStep(1); 
                setFormData({
                    email: formData.email,
                    code: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                toastService.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors({});
        }
    };

    return {
        formData,
        errors,
        isLoading,
        step,
        handleInputChange,
        handleRequestCode,
        handleVerifyCode,
        handleResetPassword,
        handleBack
    };
};