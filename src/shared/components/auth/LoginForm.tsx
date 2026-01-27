import { ILoginErrors, ILoginForm } from "@/common/interfaces/login.interface";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState, ChangeEvent } from "react";
interface LoginFormProps {
    formData: ILoginForm;
    errors: ILoginErrors;
    isLoading: boolean;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}
export default function LoginForm({
    formData,
    errors,
    isLoading,
    onInputChange,
    onSubmit,
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(prev => !prev);
    return (
        <div className="flex flex-col gap-y-4 p-8 rounded w-full items-center">
            <div className="mt-16 space-y-6">
                <h2 className="text-center text-secondary font-medium text-2xl">
                    Inicie sesión
                </h2>
                <span className="text-center text-xs">
                    Bienvenido al sistema del repositorio institucional de la UNAMBA.
                </span>
                <form onSubmit={onSubmit} className="w-full mt-8">
                    <div className="flex flex-col items-start gap-y-4 w-full">
                        <div className="flex flex-col gap-y-1 w-full">
                            <label htmlFor="email" className="text-xs flex items-center gap-2 font-medium">
                                <Mail size={14} className="text-secondary" />
                                <span>Correo</span>
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onInputChange}
                                disabled={isLoading}
                                className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.email ? "border-red-500" : "border-secondary"
                                    }`}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500 mt-1">{errors.email}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-y-1 w-full">
                            <label htmlFor="password" className="text-xs flex items-center gap-2 font-medium">
                                <LockKeyhole size={14} className="text-secondary" />
                                <span>Contraseña</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onInputChange}
                                    disabled={isLoading}
                                    className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${errors.password ? "border-red-500" : "border-secondary"
                                        }`}
                                />

                                {showPassword ? (
                                    <EyeOff
                                        size={16}
                                        className="absolute top-2 right-2 cursor-pointer text-secondary"
                                        onClick={handleShowPassword}
                                    />
                                ) : (
                                    <Eye
                                        size={16}
                                        className="absolute top-2 right-2 cursor-pointer text-secondary"
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
                                onClick={() => (window.location.href = "/forgot-password")}
                                className="text-xs text-secondary hover:underline transition-all"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>
                </form>
                {/*<span className="block text-end text-xs">
                    ¿Aun no tienes una cuenta?
                    <button
                        onClick={() => (window.location.href = "/register")}
                        className="text-secondary underline ml-1 cursor-pointer"
                    >
                        click aquí
                    </button>
                </span>*/}
            </div>
        </div>
    );
}
