import {
    FileText,
    User,
    Users,
    Calendar,
    Shield,
    BookOpen,
    Eye,
    Download,
    AlertCircle,
    Upload,
} from "lucide-react";

export default function RequestDetailsPage() {
    const [observation, setObservation] = useState("");
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md flex items-center px-6">
                <div className="text-white font-bold text-lg flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    UNAMBA - Repositorio Institucional
                </div>
            </div>

            <main className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Detalles de Solicitud</h1>
                            <p className="text-slate-500 text-sm">Visualización completa del informe enviado</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">26/11/2025</span>
                            </div>
                            <div className="bg-amber-100 px-3 py-2 rounded-lg">
                                <span className="text-amber-800 font-semibold text-sm">Pendiente de revisión</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Información del Proyecto" icon={BookOpen}>
                            <div className="space-y-4">
                                <InfoRow label="Título" value="Informe de investigación sobre el impacto social de las tecnologías digitales en comunidades rurales del Perú" />
                                <InfoRow label="Código de proyecto" value="PROY-2025-001" />
                                <InfoRow label="Facultad" value="Ingeniería de Sistemas e Informática" />
                                <InfoRow label="Tipo de trabajo" value="Tesis de pregrado" />
                            </div>
                        </Section>

                        <Section title="Autores" icon={User}>
                            <div className="overflow-hidden rounded-lg border border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-slate-600">
                                            <th className="py-3 px-4 font-semibold">Apellido, Nombres</th>
                                            <th className="py-3 px-4 font-semibold">Apellidos</th>
                                            <th className="py-3 px-4 font-semibold">DNI</th>
                                            <th className="py-3 px-4 font-semibold">Escuela</th>
                                            <th className="py-3 px-4 font-semibold">Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50">
                                            <td className="py-3 px-4">Carlos</td>
                                            <td className="py-3 px-4">Pérez</td>
                                            <td className="py-3 px-4">45678912</td>
                                            <td className="py-3 px-4">Ingeniería de Sistemas</td>
                                            <td className="py-3 px-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Autor</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="Asesores" icon={Users}>
                            <div className="overflow-hidden rounded-lg border border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-slate-600">
                                            <th className="py-3 px-4 font-semibold">Apellido, Nombre</th>
                                            <th className="py-3 px-4 font-semibold">DNI</th>
                                            <th className="py-3 px-4 font-semibold">ORCID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50">
                                            <td className="py-3 px-4">Dr. Mario Quispe</td>
                                            <td className="py-3 px-4">12345678</td>
                                            <td className="py-3 px-4 font-mono text-xs">0000-0002-2222-5555</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="Jurado Evaluador" icon={Users}>
                            <div className="space-y-3">
                                <JuradoItem rol="Presidente" nombre="Luis Robles" badge="Principal" />
                                <JuradoItem rol="Primer miembro" nombre="Alberto Ayala" badge="Miembro" />
                                <JuradoItem rol="Segundo miembro" nombre="Gabriela Huamán" badge="Miembro" />
                            </div>
                        </Section>
                    </div>

                    <div className="space-y-6">
                        <Section title="Documentos Adjuntos" icon={FileText}>
                            <div className="space-y-3">
                                {[
                                    { name: "Hoja de autorización", type: "PDF", size: "2.4 MB" },
                                    { name: "Constancia de empastado", type: "PDF", size: "1.8 MB" },
                                    { name: "Tesis completa", type: "PDF", size: "15.2 MB" },
                                    { name: "Reporte de originalidad", type: "PDF", size: "0.8 MB" },
                                ].map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{doc.name}</div>
                                                <div className="text-xs text-slate-500">{doc.type} • {doc.size}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Historial de Estado" icon={AlertCircle}>
                            <div className="space-y-4">
                                <TimelineItem status="Completado" title="Solicitud enviada" date="25/11/2025 14:30" color="green" />
                                <TimelineItem status="En revisión" title="En evaluación documentaria" date="26/11/2025 09:15" color="blue" />
                                <TimelineItem status="Pendiente" title="Aprobación final" date="Por definir" color="gray" />
                            </div>
                        </Section>
                    </div>
                </div>

                <Section title="Observaciones del Administrador" icon={AlertCircle}>
                    <div className="space-y-4">
                        <textarea
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                            rows={4}
                            placeholder="Escribe aquí las observaciones, comentarios o requisitos adicionales necesarios para la aprobación..."
                        />

                        <div className="border border-slate-200 rounded-lg p-4">
                            <label className="flex items-center gap-2 text-sm text-slate-700 font-medium mb-3">
                                <Upload size={18} className="text-blue-600" />
                                Adjuntar capturas de pantalla (opcional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />

                            {images.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex gap-3 flex-wrap">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="w-20 h-20 border-2 border-slate-200 rounded-lg overflow-hidden">
                                                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt={`Captura ${idx + 1}`} />
                                                </div>
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{images.length} archivo(s) adjunto(s)</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <Shield className="w-5 h-5" />
                                Aprobar solicitud
                            </button>
                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <AlertCircle className="w-5 h-5" />
                                Rechazar solicitud
                            </button>
                        </div>
                    </div>
                </Section>
            </main>
        </div>
    );
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            </div>
            <div className="text-slate-700">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
            <span className="font-semibold text-slate-600 min-w-[140px] text-sm">{label}:</span>
            <span className="text-slate-800 flex-1 text-sm">{value}</span>
        </div>
    );
}

function TimelineItem({ status, title, date, color }) {
    const colorClasses = {
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
        gray: "bg-slate-100 text-slate-800",
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${colorClasses[color]} border-2 border-white shadow`}></div>
                <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
            </div>
            <div className="flex-1 pb-4">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-slate-900">{title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[color]}`}>{status}</span>
                </div>
                <p className="text-xs text-slate-500">{date}</p>
            </div>
        </div>
    );
}

function JuradoItem({ rol, nombre, badge }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
                <span className="font-semibold text-slate-700">{rol}:</span>
                <span className="ml-2">{nombre}</span>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded">{badge}</span>
        </div>
    );
}
