import { IRegisterErrors, IRegisterForm } from "@/common/interfaces/register.interface";
import { Contact, CreditCard, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
    formData: IRegisterForm;
    errors: IRegisterErrors;
    isLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>; 
}

export default function RegisterForm({
    formData,
    errors,
    isLoading,
    onInputChange,
    onSubmit
}: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-y-4 rounded w-full items-center overflow-y-auto">
            <div className="space-y-6 max-w-md">
                <h2 className="text-center text-secondary font-medium text-2xl">
                    Formulario de registro
                </h2>
                <span className="text-center text-xs">
                    Bienvenido registre sus credenciales para acceder al sistema del repositorio institucional de la UNAMBA.
                </span>
                <form onSubmit={onSubmit} className="w-full mt-8">
                    <div className="flex flex-col items-start gap-y-4 w-full">
                        <div className="grid grid-cols-2 gap-4 w-full">
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
                                    onChange={onInputChange}
                                    className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.name ? "border-red-500" : "border-secondary"}`}
                                    disabled={isLoading}
                                />
                                {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
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
                                    onChange={onInputChange}
                                    className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.surname ? "border-red-500" : "border-secondary"}`}
                                    disabled={isLoading}
                                />
                                {errors.surname && <span className="text-xs text-red-500 mt-1">{errors.surname}</span>}
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
                                onChange={onInputChange}
                                maxLength={8}
                                className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.dni ? "border-red-500" : "border-secondary"}`}
                                disabled={isLoading}
                            />
                            {errors.dni && <span className="text-xs text-red-500 mt-1">{errors.dni}</span>}
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
                                onChange={onInputChange}
                                className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.email ? "border-red-500" : "border-secondary"}`}
                                disabled={isLoading}
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
                        </div>
                        <div className="flex flex-col gap-y-1 w-full">
                            <label htmlFor="password" className="text-xs flex items-center gap-2 font-medium">
                                <LockKeyhole className="text-secondary" size={14} />
                                <span>Contraseña</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onInputChange}
                                    className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${errors.password ? "border-red-500" : "border-secondary"}`}
                                    disabled={isLoading}
                                />
                                {showPassword ? (
                                    <EyeOff className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={() => setShowPassword(false)} />
                                ) : (
                                    <Eye className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={() => setShowPassword(true)} />
                                )}
                            </div>
                            {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
                        </div>
                        <div className="flex flex-col gap-y-1 w-full">
                            <label htmlFor="confirmPassword" className="text-xs flex items-center gap-2 font-medium">
                                <LockKeyhole className="text-secondary" size={14} />
                                <span>Confirmar contraseña</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={onInputChange}
                                    className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${errors.confirmPassword ? "border-red-500" : "border-secondary"}`}
                                    disabled={isLoading}
                                />
                                {showConfirmPassword ? (
                                    <EyeOff className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={() => setShowConfirmPassword(false)} />
                                ) : (
                                    <Eye className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={() => setShowConfirmPassword(true)} />
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-xs text-red-500 mt-1">{errors.confirmPassword}</span>
                            )}
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
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/admi-sigori2025" className="text-secondary underline">
                        click aquí
                    </Link>
                </span>
            </div>
        </div>
    );
}
