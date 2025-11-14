import { Contact, CreditCard, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Logo } from "../../shared/ui/Logo"

export const Register = () => {
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        dni: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        dni: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    surname: formData.surname.trim(),
                    dni: formData.dni.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: data.message || "Tu cuenta ha sido creada correctamente",
                    confirmButtonColor: "#10b981"
                });
                
                setFormData({
                    name: "",
                    surname: "",
                    dni: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                
                navigate("/");
            } else {

                let errorMessage = data.message || "Error al registrar usuario";
                
                if (response.status === 409) {
                    
                    if (data.message.includes("correo")) {
                        setErrors(prev => ({ ...prev, email: data.message }));
                    } else if (data.message.includes("dni")) {
                        setErrors(prev => ({ ...prev, dni: data.message }));
                    }
                }

                Swal.fire({
                    icon: "error",
                    title: "Error al registrar",
                    text: errorMessage,
                    confirmButtonColor: "#ef4444"
                });
            }
        } catch (error) {
            console.error("Error en registro:", error);
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
                <div className="hidden md:flex items-center h-full bg-secondary">
                    <img src="assets/img/registro.svg" alt="" className="h-90 object-contain m-auto w-auto" />
                </div>
                <div className="flex flex-col items-start relative overflow-y-auto md:overflow-y-hidden overflow-x-hidden">
                    <Logo />
                    <div className="hidden md:block h-50 w-50 absolute bg-secondary rounded-full -right-25 -bottom-25"></div>
                    <div className="flex flex-col gap-y-4 p-8 rounded w-full items-center">
                        <div className="space-y-6 max-w-md">
                            <h2 className="text-center text-secondary font-medium text-2xl">Formulario de registro</h2>
                            <span className="text-center text-xs">Bienvenido registre sus credenciales para acceder al sistema del repositorio institucional de la UNAMBA.</span>
                            <form onSubmit={handleSubmit} className="w-full mt-8">
                                <div className="flex flex-col items-start gap-y-4 w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-y-1 w-full">
                                            <label htmlFor="name" className="text-xs flex items-center gap-2 font-medium">
                                                <User className="text-secondary" size={14} /> 
                                                <span>Nombres</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`border w-full py-2 px-4 rounded outline-none text-xs ${
                                                    errors.name ? 'border-red-500' : 'border-secondary'
                                                }`}
                                                disabled={isLoading}
                                            />
                                            {errors.name && (
                                                <span className="text-xs text-red-500 mt-1">{errors.name}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-y-1 w-full">
                                            <label htmlFor="surname" className="text-xs flex items-center gap-2 font-medium">
                                                <Contact className="text-secondary" size={14} /> 
                                                <span>Apellidos</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                id="surname"
                                                name="surname"
                                                value={formData.surname}
                                                onChange={handleInputChange}
                                                className={`border w-full py-2 px-4 rounded outline-none text-xs ${
                                                    errors.surname ? 'border-red-500' : 'border-secondary'
                                                }`}
                                                disabled={isLoading}
                                            />
                                            {errors.surname && (
                                                <span className="text-xs text-red-500 mt-1">{errors.surname}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="dni" className="text-xs flex items-center gap-2 font-medium">
                                            <CreditCard className="text-secondary" size={14} /> 
                                            <span>DNI</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="dni"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleInputChange}
                                            maxLength={8}
                                            className={`border w-full py-2 px-4 rounded outline-none text-xs ${
                                                errors.dni ? 'border-red-500' : 'border-secondary'
                                            }`}
                                            disabled={isLoading}
                                        />
                                        {errors.dni && (
                                            <span className="text-xs text-red-500 mt-1">{errors.dni}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="email" className="text-xs flex items-center gap-2 font-medium">
                                            <Mail className="text-secondary" size={14} /> 
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
                                            <LockKeyhole className="text-secondary" size={14} /> 
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
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="confirmPassword" className="text-xs flex items-center gap-2 font-medium">
                                            <LockKeyhole className="text-secondary" size={14} /> 
                                            <span>Confirmar contraseña</span>
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={showConfirmPassword ? 'text' : 'password'} 
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${
                                                    errors.confirmPassword ? 'border-red-500' : 'border-secondary'
                                                }`}
                                                disabled={isLoading}
                                            />
                                            {showConfirmPassword ? (
                                                <EyeOff 
                                                    className="absolute top-2 right-2 cursor-pointer text-secondary" 
                                                    size={16} 
                                                    onClick={handleShowConfirmPassword} 
                                                />
                                            ) : (
                                                <Eye 
                                                    className="absolute top-2 right-2 cursor-pointer text-secondary" 
                                                    size={16} 
                                                    onClick={handleShowConfirmPassword} 
                                                />
                                            )}
                                        </div>
                                        {errors.confirmPassword && (
                                            <span className="text-xs text-red-500 mt-1">{errors.confirmPassword}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end w-full">
                                        <Link to="/forgot-password" className="text-xs text-secondary hover:underline transition-all">
                                            Olvidaste tu contraseña
                                        </Link>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {isLoading ? "Registrando..." : "Registrarse"}
                                    </button>
                                </div>
                            </form>
                            <span className="block text-end text-xs">
                                ¿Ya tienes una cuenta? <Link to="/login" className="text-secondary underline">click aquí</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};