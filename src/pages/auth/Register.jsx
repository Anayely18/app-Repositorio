import { Contact, CreditCard, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Logo } from "../../components/ui/Logo"
import { Link } from "react-router-dom";

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
                            <form action="" className="w-full mt-8">
                                <div className="flex flex-col items-start gap-y-4 w-full">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-y-1 w-full">
                                            <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><User className="text-secondary" size={14} /> <span>Nombres</span></label>
                                            <input type="text" className="border w-full py-2 px-4 rounded outline-none border-secondary text-xs" />
                                        </div>
                                        <div className="flex flex-col gap-y-1 w-full">
                                            <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><Contact className="text-secondary" size={14} /> <span>Apellidos</span></label>
                                            <input type="text" className="border w-full py-2 px-4 rounded outline-none border-secondary text-xs" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><CreditCard className="text-secondary" size={14} /> <span>DNI</span></label>
                                        <input type="text" className="border w-full py-2 px-4 rounded outline-none border-secondary text-xs" />
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><Mail className="text-secondary" size={14} /> <span>Correo</span></label>
                                        <input type="text" className="border w-full py-2 px-4 rounded outline-none border-secondary text-xs" />
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><LockKeyhole className="text-secondary" size={14} /> <span>Contraseña</span></label>
                                        <div className="relative">
                                            <input type={showPassword ? 'text' : 'password'} className="border w-full py-2 pl-4 pr-8 rounded outline-none border-secondary text-xs" />
                                            {
                                                showPassword ? <EyeOff className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={handleShowPassword} /> : <Eye className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={handleShowPassword} />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><LockKeyhole className="text-secondary" size={14} /> <span>Repetir contraseña</span></label>
                                        <div className="relative">
                                            <input type={showConfirmPassword ? 'text' : 'password'} className="border w-full py-2 pl-4 pr-8 rounded outline-none border-secondary text-xs" />
                                            {
                                                showConfirmPassword ? <EyeOff className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={handleShowConfirmPassword} /> : <Eye className="absolute top-2 right-2 cursor-pointer  text-secondary" size={16} onClick={handleShowConfirmPassword} />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end w-full">
                                        <a href="" className="text-xs text-secondary hover:underline transition-all">Olvidaste tu contraseña</a>
                                    </div>
                                    <button className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm">Registrarse</button>
                                </div>
                            </form>
                            <span className="block text-end text-xs">¿Ya tienes una cuenta? <Link to="/" className="text-secondary underline">click aquí</Link></span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}