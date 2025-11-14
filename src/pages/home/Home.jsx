import { BookOpen, ClipboardCheck, FileText } from "lucide-react"
import { Logo } from "../../shared/ui/Logo"
import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div className="h-svh overflow-hidden">
            <div className="h-16 bg-secondary flex m-auto items-center justify-around">
                <Logo />
                <Link to="/login" className="py-2 px-4 rounded bg-white text-secondary text-xs">Administrador</Link>
            </div>
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-bold text-secondary mb-3">
                        Inicio de Trámite
                    </h1>
                    <p className="text-gray-600">
                        Selecciona el tipo de trámite que deseas realizar
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                    <a
                        href="#"
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-secondary"
                    >
                        <div className="p-8 flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-secondary transition-colors">
                                <BookOpen className="w-12 h-12 text-secondary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary transition-colors">
                                Tesis
                            </h3>
                            <p className="text-gray-600 text-center text-sm">
                                Registra y gestiona tu proyecto de tesis
                            </p>
                        </div>
                    </a>
                    <a
                        href="#"
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-secondary"
                    >
                        <div className="p-8 flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-secondary transition-colors">
                                <FileText className="w-12 h-12 text-secondary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary transition-colors">
                                Informe de Docentes
                            </h3>
                            <p className="text-gray-600 text-center text-sm">
                                Presenta tu informe académico
                            </p>
                        </div>
                    </a>
                </div>
                <div className="max-w-2xl mx-auto">
                    <a
                        href="#"
                        className="group bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-black"
                    >
                        <div className="p-8 flex items-center gap-6">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shrink-0 transition-colors">
                                <ClipboardCheck className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-secondary flex-1">
                                <h3 className="text-xl font-medium mb-2">
                                    Ver estado de tu trámite
                                </h3>
                                <p className="text-gray-600">
                                    Consulta el progreso de tus solicitudes
                                </p>
                            </div>
                            <svg className="w-8 h-8 text-gray-500 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                </div>
            </main>
        </div>
    )
} 