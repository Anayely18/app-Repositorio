import { AlertCircle, Building2, CheckCircle2, CreditCard, FileText, Mail, Phone, User, UserRound, Users } from "lucide-react"
import Logo from "../../shared/ui/Logo"

export default function StudentResearchReportRequest() {
    return (
        <div className="min-h-svh w-full">
            <div className="h-16 bg-secondary">
                <Logo />
            </div>
            <main className="max-w-4xl mx-auto p-6 md:p-8">
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Solicitud para Publicar Informe de Investigación
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">Estudiantes</p>
                    </div>
                    <form className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="tu.correo@unamba.edu.pe"
                                className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                            No es función de la unidad de repositorio revisar en todo su extremo el informe de investigación, esa es responsabilidad de usted, equipo de trabajo, revisores o la Dirección de Institutos de Investigación. Sin embargo, a pesar de estos filtros a la fecha existen trabajos rechazados. Esta oficina verifica aleatoriamente el formato o esquema, caso no esté bien será rechazado y si reincide se aplica el reglamento.
                                        </p>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="group-hover:text-blue-600 transition-colors">Sí, estoy de acuerdo</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-blue-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                            He leído y ajustado el informe de investigación al formato oficial del reglamento de Investigación de la UNAMBA.
                                        </p>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="group-hover:text-blue-600 transition-colors">Sí, he ajustado</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                            He leído los errores más comunes que se presentan a la hora de presentar los informes de investigación cuyo link está aquí:{" "}
                                            <a href="#" className="text-blue-600 hover:underline font-medium">
                                                ERRORES RECURRENTES EN DIAGRAMACION.pdf
                                            </a>
                                        </p>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="group-hover:text-blue-600 transition-colors">Sí, he leído</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                            Estoy informado que el trámite es virtual, existe una página de seguimiento para ver mi trámite, que el procedimiento para otorgar la constancia es de 5 días hábiles.
                                        </p>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="group-hover:text-blue-600 transition-colors">Sí, estoy informado</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        Nombres
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tus nombres"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tus apellidos"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                        Número de DNI
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="12345678"
                                        maxLength={8}
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        Número de contacto
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="987654321"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Building2 className="w-4 h-4 text-gray-500" />
                                        Escuela Profesional
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Ingeniería de Sistemas"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Sobre los asesores
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        Nombres
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tus nombres"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tus apellidos"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                        Número de DNI
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="12345678"
                                        maxLength={8}
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        Número de contacto
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="987654321"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Building2 className="w-4 h-4 text-gray-500" />
                                        Escuela Profesional
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Ingeniería de Sistemas"
                                        className="w-full outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 py-2 px-3 rounded-md text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Enviar Solicitud
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}