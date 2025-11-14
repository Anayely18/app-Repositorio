import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Logo } from "../../shared/ui/Logo";
import { useState } from "react";
import Swal from "sweetalert2";

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const handleShowPassword = () => setShowPassword(!showPassword);

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
            Swal.fire({
                icon: "error",
                title: "Errores en el formulario",
                text: "Por favor, corrija los errores antes de continuar",
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {

                if (data.data?.token) {
                    localStorage.setItem("token", data.data.token);
                }
                
                if (data.data?.user) {
                    localStorage.setItem("user", JSON.stringify(data.data.user));
                }

                await Swal.fire({
                    icon: "success",
                    title: "¡Bienvenido!",
                    text: data.message || "Inicio de sesión exitoso",
                    confirmButtonColor: "#10b981",
                    timer: 1500,
                    showConfirmButton: false
                });
                
                window.location.href = "/home";
            } else {

                let errorMessage = data.message || "Error al iniciar sesión";
                
                if (response.status === 401) {
                    setErrors({
                        email: "Credenciales no válidas",
                        password: "Credenciales no válidas"
                    });
                }

                Swal.fire({
                    icon: "error",
                    title: "Error al iniciar sesión",
                    text: errorMessage,
                    confirmButtonColor: "#ef4444"
                });
            }
        } catch (error) {
            console.error("Error en login:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor. Por favor, intente más tarde.",
                confirmButtonColor: "#ef4444"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-primary h-svh w-full overflow-hidden">
            <main className="grid grid-cols-1 md:grid-cols-2 h-svh">
                <div className="flex flex-col items-start relative">
                    <Logo />
                    <div className="h-50 w-50 absolute bg-secondary rounded-full -left-25 -bottom-25"></div>
                    <div className="md:hidden h-50 w-50 absolute bg-secondary rounded-full -right-25 -bottom-25"></div>
                    <div className="flex flex-col gap-y-4 p-8 rounded w-full items-center">
                        <div className="mt-16 space-y-6">
                            <h2 className="text-center text-secondary font-medium text-2xl">Inicie sesión</h2>
                            <span className="text-center text-xs">Bienvenido al sistema del repositorio institucional de la UNAMBA.</span>
                            <div className="w-full mt-8">
                                <div className="flex flex-col items-start gap-y-4 w-full">
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="email" className="text-xs flex items-center gap-2 font-medium">
                                            <Mail size={14} className="text-secondary"/> 
                                            <span>Correo</span>
                                        </label>
                                        <input 
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`border w-full py-2 px-4 rounded outline-none text-xs ${
                                                errors.email ? 'border-red-500' : 'border-secondary'
                                            }`}
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <span className="text-xs text-red-500 mt-1">{errors.email}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="password" className="text-xs flex items-center gap-2 font-medium">
                                            <LockKeyhole size={14} className="text-secondary"/> 
                                            <span>Contraseña</span>
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${
                                                    errors.password ? 'border-red-500' : 'border-secondary'
                                                }`}
                                                disabled={isLoading}
                                            />
                                            {showPassword ? (
                                                <EyeOff 
                                                    className="absolute top-2 right-2 cursor-pointer text-secondary" 
                                                    size={16} 
                                                    onClick={handleShowPassword} 
                                                />
                                            ) : (
                                                <Eye 
                                                    className="absolute top-2 right-2 cursor-pointer text-secondary" 
                                                    size={16} 
                                                    onClick={handleShowPassword} 
                                                />
                                            )}
                                        </div>
                                        {errors.password && (
                                            <span className="text-xs text-red-500 mt-1">{errors.password}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end w-full">
                                        <button 
                                            type="button"
                                            onClick={() => window.location.href = "/forgot-password"}
                                            className="text-xs text-secondary hover:underline transition-all"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                                    </button>
                                </div>
                            </div>
                            <span className="block text-end text-xs">
                                ¿Aun no tienes una cuenta? 
                                <button 
                                    onClick={() => window.location.href = "/register"}
                                    className="text-secondary underline ml-1 cursor-pointer"
                                >
                                    click aquí
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center h-full bg-secondary">
                    <img src="assets/img/login.svg" alt="" className="h-90 object-contain m-auto w-auto" />
                </div>
            </main>
        </div>
    );
};