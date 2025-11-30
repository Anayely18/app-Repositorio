import { useState, useEffect } from "react";
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
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import { Link, useNavigate } from "react-router-dom";
import Section from "@/shared/components/Section";
import InfoRow from "@/shared/components/InfoRow";
import JuryItem from "@/shared/components/JuradoItem";
import TimelineItem from "@/shared/components/TimelineItem";

export default function RequestDetailsPage() {
    const [observation, setObservation] = useState("");
    const [images, setImages] = useState([]);
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getApplicationId = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                setLoading(true);
                const applicationId = getApplicationId();
                const response = await fetch(`${API_URL}/applications/details/${applicationId}`);

                if (!response.ok) {
                    throw new Error('Error al cargar los detalles');
                }

                const result = await response.json();
                setApplicationData(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            pendiente: "Pendiente de revisión",
            aprobado: "Aprobado",
            rechazado: "Rechazado",
            en_revision: "En revisión"
        };
        return statusMap[status] || "Estado desconocido";
    };

    const getStatusColor = (status) => {
        const colorMap = {
            pendiente: "bg-amber-100 text-amber-800",
            aprobado: "bg-green-100 text-green-800",
            rechazado: "bg-red-100 text-red-800",
            en_revision: "bg-blue-100 text-blue-800"
        };
        return colorMap[status] || "bg-gray-100 text-gray-800";
    };

    const getDocumentTypeLabel = (type) => {
        const typeMap = {
            tesis_pdf: "Tesis completa",
            hoja_autorizacion: "Hoja de autorización",
            constancia_empastado: "Constancia de empastado",
            constancia_originalidad: "Reporte de originalidad"
        };
        return typeMap[type] || type;
    };

    const getJuryRoleLabel = (role) => {
        const roleMap = {
            presidente: "Presidente",
            primer_miembro: "Primer miembro",
            segundo_miembro: "Segundo miembro"
        };
        return roleMap[role] || role;
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-lg text-slate-600">Cargando detalles...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                    <h2 className="text-lg font-semibold text-red-900 mb-1">Error al cargar</h2>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!applicationData) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">No se encontraron datos</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 relative">
            <Link to="/dashboard" className="flex absolute top-0 left-6 text-xs items-center text-secondary gap-x-1"><ArrowLeft size={14} />Volver</Link>
            <main className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Detalles de Solicitud</h1>
                            <p className="text-slate-500 text-sm">Visualización completa del informe enviado</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">{formatDate(applicationData.application_date)}</span>
                            </div>
                            <div className={`px-3 py-2 rounded-lg ${getStatusColor(applicationData.status)}`}>
                                <span className="font-semibold text-sm">{getStatusLabel(applicationData.status)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Información del Proyecto" icon={BookOpen}>
                            <div className="space-y-4">
                                <InfoRow label="Título" value={applicationData.project_name || "Sin título"} />
                                <InfoRow label="Código de proyecto" value={applicationData.application_id?.split('-')[0]?.toUpperCase() || "N/A"} />
                                <InfoRow label="Facultad" value={applicationData.professional_school || "No especificada"} />
                                <InfoRow label="Tipo de trabajo" value={applicationData.application_type === 'estudiante' ? 'Tesis de pregrado' : 'Tesis de posgrado'} />
                                <InfoRow label="Tipo de financiamiento" value={applicationData.funding_type || "No especificado"} />
                            </div>
                        </Section>

                        <Section title="Autores" icon={User}>
                            {applicationData.authors && applicationData.authors.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr className="text-left text-slate-600">
                                                <th className="py-3 px-4 font-semibold">Nombres</th>
                                                <th className="py-3 px-4 font-semibold">Apellidos</th>
                                                <th className="py-3 px-4 font-semibold">DNI</th>
                                                <th className="py-3 px-4 font-semibold">Escuela</th>
                                                <th className="py-3 px-4 font-semibold">Rol</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {applicationData.authors.map((author, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="py-3 px-4">{author.first_name || "N/A"}</td>
                                                    <td className="py-3 px-4">{author.last_name || "N/A"}</td>
                                                    <td className="py-3 px-4">{author.dni || "N/A"}</td>
                                                    <td className="py-3 px-4">{author.professional_school || "N/A"}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                            {author.author_order === 'principal' ? 'Autor Principal' : 'Coautor'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm py-4">No hay autores registrados</p>
                            )}
                        </Section>

                        <Section title="Asesores" icon={Users}>
                            {applicationData.advisors && applicationData.advisors.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr className="text-left text-slate-600">
                                                <th className="py-3 px-4 font-semibold">Nombre Completo</th>
                                                <th className="py-3 px-4 font-semibold">DNI</th>
                                                <th className="py-3 px-4 font-semibold">ORCID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {applicationData.advisors.map((advisor, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="py-3 px-4">{advisor.full_name || "N/A"}</td>
                                                    <td className="py-3 px-4">{advisor.dni || "N/A"}</td>
                                                    <td className="py-3 px-4 font-mono text-xs">{advisor.orcid || "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm py-4">No hay asesores registrados</p>
                            )}
                        </Section>

                        <Section title="Jurado Evaluador" icon={Users}>
                            {applicationData.jury && applicationData.jury.length > 0 ? (
                                <div className="space-y-3">
                                    {applicationData.jury.map((juryMember, index) => (
                                        <JuryItem
                                            key={index}
                                            rol={getJuryRoleLabel(juryMember.jury_role)}
                                            nombre={juryMember.full_name || "No asignado"}
                                            badge={juryMember.jury_role === 'presidente' ? 'Principal' : 'Miembro'}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm py-4">No hay jurado asignado</p>
                            )}
                        </Section>
                    </div>

                    <div className="space-y-6">
                        <Section title="Documentos Adjuntos" icon={FileText}>
                            {applicationData.documents && applicationData.documents.length > 0 ? (
                                <div className="space-y-3">
                                    {applicationData.documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{getDocumentTypeLabel(doc.document_type)}</div>
                                                    <div className="text-xs text-slate-500">PDF • {doc.size_kb || "?"} KB</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => window.open(`http://localhost:3000/${doc.file_path}`, '_blank')}
                                                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Ver documento"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => window.open(`http://localhost:3000/${doc.file_path}`, '_blank')}
                                                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded"
                                                    title="Descargar documento"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm py-4">No hay documentos adjuntos</p>
                            )}
                        </Section>

                        <Section title="Historial de Estado" icon={AlertCircle}>
                            {applicationData.history && applicationData.history.length > 0 ? (
                                <div className="space-y-4">
                                    {applicationData.history.map((item, index) => (
                                        <TimelineItem
                                            key={index}
                                            status={item.status}
                                            title={item.title}
                                            date={formatDate(item.date)}
                                            color={item.color}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <TimelineItem status="Completado" title="Solicitud enviada" date={formatDate(applicationData.created_at)} color="green" />
                                    <TimelineItem status="En revisión" title="En evaluación documentaria" date={formatDate(applicationData.updated_at)} color="blue" />
                                    <TimelineItem status="Pendiente" title="Aprobación final" date="Por definir" color="gray" />
                                </div>
                            )}
                        </Section>
                    </div>
                </div>

                <div className="mt-6">
                    <Section title="Observaciones del Administrador" icon={AlertCircle}>
                        <div className="space-y-4">
                            {applicationData.observations && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-900"><strong>Observación actual:</strong> {applicationData.observations}</p>
                                </div>
                            )}

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
                </div>
            </main>
        </div>
    );
}
