import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { Logo } from "../../components/ui/Logo"
import { useState } from "react"
import { Link } from "react-router-dom";

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);

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
                            <span className="text-center text-xs">Bienvenido al sistema del repositorio institucional de la UNAMBA. </span>
                            <form action="" className="w-full mt-8">
                                <div className="flex flex-col items-start gap-y-4 w-full">
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><Mail size={14} className="text-secondary"/> <span>Correo</span></label>
                                        <input type="text" className="border w-full py-2 px-4 rounded outline-none border-secondary text-xs" />
                                    </div>
                                    <div className="flex flex-col gap-y-1 w-full">
                                        <label htmlFor="" className="text-xs flex items-center gap-2 font-medium"><LockKeyhole size={14} className="text-secondary"/> <span>Contraseña</span></label>
                                        <div className="relative">
                                            <input type={showPassword ? 'text' : 'password'} className="border w-full py-2 pl-4 pr-8 rounded outline-none border-secondary text-xs" />
                                            {
                                                showPassword ? <EyeOff className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={handleShowPassword} /> : <Eye className="absolute top-2 right-2 cursor-pointer text-secondary" size={16} onClick={handleShowPassword} />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end w-full">
                                        <a href="" className="text-xs text-secondary hover:underline transition-all">¿Olvidaste tu contraseña?</a>
                                    </div>
                                    <button className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm">Iniciar sesión</button>
                                </div>
                            </form>
                            <span className="block text-end text-xs">¿Aun no tienes una cuenta? <Link to="/register" className="text-secondary underline">click aquí</Link></span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center h-full bg-secondary">
                    <img src="assets/img/login.svg" alt="" className="h-90 object-contain m-auto w-auto" />
                </div>
            </main>
        </div>
    )
}