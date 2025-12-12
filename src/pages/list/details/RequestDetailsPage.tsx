import { useState, useEffect } from "react";
import { toast, Toaster } from 'sonner';
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
import { API_URL, API_URL_DOCUMENTS } from "@/utils/api";
import { Link } from "react-router-dom";
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
    const [documentObservations, setDocumentObservations] = useState({});
    const [documentImages, setDocumentImages] = useState({});
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentReviews, setDocumentReviews] = useState({});

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
                console.log('📦 Datos completos de la aplicación:', result.data);
                console.log('📄 Documentos:', result.data.documents);
                console.log('📊 Estado de aplicación:', result.data.status);
                console.log('📜 Historial:', result.data.history);
                setApplicationData(result.data);
            } catch (err) {
                console.error('❌ Error al cargar:', err);
                setError(err.message);
                toast.error('Error al cargar los detalles de la solicitud');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, []);

    const handleImageUpload = (e) => {
        if (!selectedDocument) return;

        const files = Array.from(e.target.files || []);
        setDocumentImages(prev => ({
            ...prev,
            [selectedDocument]: [...(prev[selectedDocument] || []), ...files]
        }));
    };

    const removeImage = (index) => {
        if (!selectedDocument) return;

        setDocumentImages(prev => ({
            ...prev,
            [selectedDocument]: (prev[selectedDocument] || []).filter((_, i) => i !== index)
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            pendiente: "Pendiente de revisión",
            validado: "Aprobado",
            aprobado: "Aprobado",
            rechazado: "Rechazado",
            en_revision: "En revisión"
        };
        const label = statusMap[status?.toLowerCase()] || status || "Estado desconocido";
        console.log(`🏷️ Estado "${status}" mapeado a "${label}"`);
        return label;
    };

    const getStatusColor = (status) => {
        const normalizedStatus = status?.toLowerCase();
        const colorMap = {
            pendiente: "bg-amber-100 text-amber-800",
            validado: "bg-green-100 text-green-800",
            aprobado: "bg-green-100 text-green-800",
            rechazado: "bg-red-100 text-red-800",
            en_revision: "bg-blue-100 text-blue-800"
        };
        const color = colorMap[normalizedStatus] || "bg-gray-100 text-gray-800";
        console.log(`🎨 Estado "${status}" color "${color}"`);
        return color;
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

    const handleReviewDecision = (documentId, decision) => {
        setDocumentReviews(prev => ({
            ...prev,
            [documentId]: decision
        }));
    };

    const handleDocumentClick = (document_id) => {
        setSelectedDocument(document_id);
    };

    const handleObservationChange = (e) => {
        if (selectedDocument) {
            setDocumentObservations(prev => ({
                ...prev,
                [selectedDocument]: e.target.value
            }));
        }
    };

    const handleSaveDocumentReview = async (documentId) => {

        if (!documentId) {
            toast.error('Selecciona un documento primero');
            return;
        }

        try {
            const formData = new FormData();

            const frontendStatus = documentReviews[documentId] || 'pendiente';
            const mappedStatus = mapStatusToDatabase(frontendStatus);

            console.log('📝 Guardando revisión del documento:', documentId);
            console.log('Estado frontend:', frontendStatus);
            console.log('Estado mapeado para BD:', mappedStatus);

            formData.append('status', mappedStatus);
            formData.append('observation', documentObservations[documentId] || '');

            const images = documentImages[documentId] || [];
            images.forEach((image) => {
                formData.append('images', image);
            });

            // ✅ ENDPOINT CORREGIDO
            const response = await fetch(`${API_URL}/applications/documents/${documentId}/review`, {
                method: 'PATCH',
                body: formData
            });

            const result = await response.json();
            console.log('✅ Respuesta del servidor:', result);

            if (result.success) {
                toast.success('Documento actualizado correctamente');
            } else {
                toast.error(result.message || 'Error al actualizar el documento');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error('Error al guardar la revisión');
        }
    };

    const handleSaveAllDocuments = async () => {
        try {
            // Verificar que haya al menos un documento con decisión
            const documentsWithDecisions = Object.keys(documentReviews).filter(
                docId => documentReviews[docId] && documentReviews[docId] !== 'pendiente'
            );

            if (documentsWithDecisions.length === 0) {
                toast.error('Debes aprobar o rechazar al menos un documento');
                return;
            }

            // Confirmar acción
            const totalDocs = applicationData.documents.length;
            const reviewedDocs = documentsWithDecisions.length;

            if (!window.confirm(
                `¿Guardar revisión de ${reviewedDocs} de ${totalDocs} documentos?\n\n` +
                `${Object.values(documentReviews).filter(d => d === 'aprobado').length} aprobados\n` +
                `${Object.values(documentReviews).filter(d => d === 'rechazado').length} rechazados`
            )) {
                return;
            }

            toast.info('Guardando documentos...');
            let successCount = 0;
            let errorCount = 0;

            // Iterar por cada documento y guardar
            for (const doc of applicationData.documents) {
                const documentId = doc.document_id;
                const decision = documentReviews[documentId];

                // Si no hay decisión, saltar este documento
                if (!decision || decision === 'pendiente') {
                    continue;
                }

                try {
                    const formData = new FormData();
                    const mappedStatus = mapStatusToDatabase(decision);

                    formData.append('status', mappedStatus);
                    formData.append('observation', documentObservations[documentId] || '');

                    // Agregar imágenes si las hay
                    const images = documentImages[documentId] || [];
                    images.forEach((image) => {
                        formData.append('images', image);
                    });

                    const response = await fetch(
                        `${API_URL}/applications/documents/${documentId}/review`,
                        {
                            method: 'PATCH',
                            body: formData
                        }
                    );

                    const result = await response.json();

                    if (result.success) {
                        successCount++;
                        console.log(`✅ Documento ${documentId} actualizado`);
                    } else {
                        errorCount++;
                        console.error(`❌ Error en documento ${documentId}:`, result.message);
                    }

                } catch (error) {
                    errorCount++;
                    console.error(`❌ Error guardando documento ${documentId}:`, error);
                }
            }

            // Mostrar resultado final
            if (errorCount === 0) {
                toast.success(`✅ ${successCount} documentos actualizados correctamente`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.warning(
                    `⚠️ ${successCount} documentos guardados, ${errorCount} con errores`
                );
            }

        } catch (error) {
            console.error('❌ Error general:', error);
            toast.error('Error al guardar los documentos');
        }
    };


    const getReviewSummary = () => {
        const total = applicationData.documents.length;
        const reviewed = Object.keys(documentReviews).filter(
            key => documentReviews[key] && documentReviews[key] !== 'pendiente'
        ).length;
        const approved = Object.values(documentReviews).filter(
            status => status === 'aprobado'
        ).length;
        const rejected = Object.values(documentReviews).filter(
            status => status === 'rechazado'
        ).length;
        const pending = total - reviewed;

        return { total, reviewed, approved, rejected, pending };
    };

    const handleApproveApplication = async () => {
        try {
            const applicationId = getApplicationId();

            const response = await fetch(`${API_URL}/applications/${applicationId}/review`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'aprobado',
                    observations: observation
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Solicitud aprobada correctamente');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(result.message || 'Error al aprobar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al aprobar la solicitud');
        }
    };

    const handleRejectApplication = async () => {
        try {
            const applicationId = getApplicationId();

            const response = await fetch(`${API_URL}/applications/${applicationId}/review`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'rechazado',
                    observations: observation
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Solicitud rechazada');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(result.message || 'Error al rechazar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al rechazar la solicitud');
        }
    };

    const mapStatusToDatabase = (frontendStatus) => {
        const statusMap = {
            'aprobado': 'validado',
            'rechazado': 'rechazado',
            'pendiente': 'pendiente'
        };
        return statusMap[frontendStatus] || 'pendiente';
    };

    const getDocumentUrl = (filePath) => {
        if (!filePath) return '';
        if (filePath.startsWith('http')) return filePath;
        return `${API_URL_DOCUMENTS}/${filePath}`;
    };

    const ReviewSummaryPanel = () => {
        const summary = getReviewSummary();

        return (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                    📋 Resumen de Revisión de Documentos
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-slate-700">{summary.total}</div>
                        <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-700">{summary.approved}</div>
                        <div className="text-xs text-green-600">Aprobados</div>
                    </div>
                    <div className="bg-red-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">{summary.rejected}</div>
                        <div className="text-xs text-red-600">Rechazados</div>
                    </div>
                    <div className="bg-amber-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-amber-700">{summary.pending}</div>
                        <div className="text-xs text-amber-600">Pendientes</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSaveAllDocuments}
                        disabled={summary.reviewed === 0}
                        className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all
                        ${summary.reviewed === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        💾 Guardar Todas las Revisiones ({summary.reviewed})
                    </button>

                    <button
                        onClick={() => {
                            if (window.confirm('¿Limpiar todas las decisiones?')) {
                                setDocumentReviews({});
                                setDocumentObservations({});
                                setDocumentImages({});
                                setSelectedDocument(null);
                                toast.info('Revisiones limpiadas');
                            }
                        }}
                        className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
                    >
                        🗑️ Limpiar
                    </button>
                </div>

                {summary.reviewed > 0 && (
                    <div className="mt-4 text-sm text-slate-600">
                        ℹ️ Se guardarán {summary.reviewed} documentos con sus observaciones e imágenes
                    </div>
                )}
            </div>
        );
    };


    const currentObservation = selectedDocument ? (documentObservations[selectedDocument] || "") : "";
    const currentImages = selectedDocument ? (documentImages[selectedDocument] || []) : [];

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
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-blue-50 relative">
            <Toaster position="top-right" richColors closeButton />
            <Link to="/dashboard" className="flex absolute top-0 left-6 text-xs items-center text-secondary gap-x-1">
                <ArrowLeft size={14} />Volver
            </Link>
            <main className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 mb-2">Detalles de Solicitud</h1>
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

                        {applicationData.application_type === 'docente' && (
                            <Section title="Coautores" icon={User}>
                                {applicationData.coauthors && applicationData.coauthors.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr className="text-left text-slate-600">
                                                    <th className="py-3 px-4 font-semibold">Nombres</th>
                                                    <th className="py-3 px-4 font-semibold">Apellidos</th>
                                                    <th className="py-3 px-4 font-semibold">DNI</th>
                                                    <th className="py-3 px-4 font-semibold">Correo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {applicationData.coauthors.map((coauthor, index) => (
                                                    <tr key={index} className="hover:bg-slate-50">
                                                        <td className="py-3 px-4">{coauthor.first_name || "N/A"}</td>
                                                        <td className="py-3 px-4">{coauthor.last_name || "N/A"}</td>
                                                        <td className="py-3 px-4">{coauthor.dni || "N/A"}</td>
                                                        <td className="py-3 px-4">{coauthor.email || "N/A"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm py-4">No hay coautores registrados</p>
                                )}
                            </Section>
                        )}

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
                                    {[...applicationData.jury]
                                        .sort((a, b) => a.jury_role === 'presidente' ? -1 : b.jury_role === 'presidente' ? 1 : 0)
                                        .map((juryMember, index) => (
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
                        <Section title="Historial de Estado" icon={AlertCircle}>
                            {applicationData.history && applicationData.history.length > 0 ? (
                                <div className="space-y-4">
                                    {applicationData.history.map((item, index) => (
                                        <TimelineItem
                                            key={index}
                                            status={item.status || "Sin estado"}
                                            title={item.title || item.status || "Sin título"}
                                            date={formatDate(item.date || item.created_at)}
                                            color={item.color || "blue"}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <TimelineItem
                                        status="Completado"
                                        title="Solicitud enviada"
                                        date={formatDate(applicationData.created_at)}
                                        color="green"
                                    />
                                    <TimelineItem
                                        status="En revisión"
                                        title="En evaluación documentaria"
                                        date={formatDate(applicationData.updated_at)}
                                        color="blue"
                                    />
                                    <TimelineItem
                                        status="Pendiente"
                                        title="Aprobación final"
                                        date="Por definir"
                                        color="gray"
                                    />
                                </div>
                            )}
                        </Section>
                    </div>
                </div>

                <div className="lg:col-span-2 mt-6">
                    <Section title="Documentos Adjuntos" icon={FileText}>
                        {applicationData.documents && applicationData.documents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {applicationData.documents.map((doc) => {
                                    const decision = documentReviews[doc.document_id];
                                    const isSelected = selectedDocument === doc.document_id;
                                    const hasObservations = documentObservations[doc.document_id]?.trim().length > 0;

                                    return (
                                        <div
                                            key={doc.document_id}
                                            onClick={() => handleDocumentClick(doc.document_id)}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all
                                ${isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-blue-300"}
                                ${decision === "aprobado" ? "border-green-300 bg-green-50" : ""}
                                ${decision === "rechazado" ? "border-red-300 bg-red-50" : ""}
                            `}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{getDocumentTypeLabel(doc.document_type)}</div>
                                                        <div className="text-xs text-slate-500">PDF • {doc.size_kb} KB</div>
                                                    </div>
                                                </div>
                                                {hasObservations && (
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full" title="Tiene observaciones"></div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = getDocumentUrl(doc.file_path);
                                                            window.open(url, '_blank');
                                                        }}
                                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                        title="Ver documento"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = getDocumentUrl(doc.file_path);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.download = `${getDocumentTypeLabel(doc.document_type)}.pdf`;
                                                            link.target = '_blank';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}
                                                        className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-100 rounded transition-colors"
                                                        title="Descargar documento"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReviewDecision(doc.document_id, "aprobado");
                                                        }}
                                                        title="Aprobar"
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors text-sm font-bold
                                            ${decision === "aprobado"
                                                                ? "bg-green-500 border-green-600 text-white"
                                                                : "border-slate-300 text-slate-400 hover:bg-green-50 hover:border-green-400 hover:text-green-600"}
                                        `}
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReviewDecision(doc.document_id, "rechazado");
                                                        }}
                                                        title="Rechazar"
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors text-sm font-bold
                                            ${decision === "rechazado"
                                                                ? "bg-red-500 border-red-600 text-white"
                                                                : "border-slate-300 text-slate-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600"}
                                        `}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm py-4">No hay documentos adjuntos</p>
                        )}
                    </Section>
                </div>
                <div className="my-4">
                    <Section title="Observaciones del Documento" icon={AlertCircle}>
                        {!selectedDocument ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">Selecciona un documento para agregar observaciones</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-900 font-medium">
                                        Editando: {getDocumentTypeLabel(
                                            applicationData.documents.find(d => d.document_id === selectedDocument)?.document_type
                                        )}
                                    </p>
                                </div>

                                <textarea
                                    value={currentObservation}
                                    onChange={handleObservationChange}
                                    className="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    rows={6}
                                    placeholder="Escribe aquí las observaciones, comentarios o requisitos adicionales para este documento..."
                                />

                                <div className="border border-slate-200 rounded-lg p-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium mb-3">
                                        <Upload className="text-blue-600" size={18} />
                                        Adjuntar capturas de pantalla (opcional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />

                                    {currentImages.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex gap-3 flex-wrap">
                                                {currentImages.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="w-24 h-24 border-2 border-slate-200 rounded-lg overflow-hidden">
                                                            <img
                                                                src={URL.createObjectURL(img)}
                                                                className="w-full h-full object-cover"
                                                                alt={`Captura ${idx + 1}`}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-3">
                                                {currentImages.length} archivo(s) adjunto(s)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Resumen de revisión</h4>
                                    <div className="space-y-1 text-xs text-slate-600">
                                        <p>• Observaciones: {currentObservation.trim() ? "✓ Agregadas" : "Sin observaciones"}</p>
                                        <p>• Imágenes: {currentImages.length > 0 ? `${currentImages.length} adjunta(s)` : "Sin imágenes"}</p>
                                        <p>• Estado: {documentReviews[selectedDocument] === "aprobado" ? "✓ Aprobado" : documentReviews[selectedDocument] === "rechazado" ? "✕ Rechazado" : "Pendiente de decisión"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Section>
                    <div className="lg:col-span-2 mt-6">
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Resumen de Revisión de Documentos
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <div className="text-3xl font-bold text-slate-700">
                                        {applicationData.documents.length}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">Total Documentos</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center shadow-sm">
                                    <div className="text-3xl font-bold text-green-700">
                                        {Object.values(documentReviews).filter(d => d === 'aprobado').length}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">✓ Aprobados</div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center shadow-sm">
                                    <div className="text-3xl font-bold text-red-700">
                                        {Object.values(documentReviews).filter(d => d === 'rechazado').length}
                                    </div>
                                    <div className="text-xs text-red-600 mt-1">✕ Rechazados</div>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center shadow-sm">
                                    <div className="text-3xl font-bold text-amber-700">
                                        {applicationData.documents.length - Object.keys(documentReviews).filter(
                                            key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                        ).length}
                                    </div>
                                    <div className="text-xs text-amber-600 mt-1">⏳ Pendientes</div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveAllDocuments}
                                    disabled={Object.keys(documentReviews).filter(
                                        key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                    ).length === 0}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                    ${Object.keys(documentReviews).filter(
                                        key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                    ).length === 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    <Upload className="w-5 h-5" />
                                    Guardar Todas las Revisiones (
                                    {Object.keys(documentReviews).filter(
                                        key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                    ).length})
                                </button>

                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Limpiar todas las decisiones y observaciones?')) {
                                            setDocumentReviews({});
                                            setDocumentObservations({});
                                            setDocumentImages({});
                                            setSelectedDocument(null);
                                            toast.info('Revisiones limpiadas');
                                        }
                                    }}
                                    className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    Limpiar
                                </button>
                            </div>

                            {Object.keys(documentReviews).filter(
                                key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                            ).length > 0 && (
                                    <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
                                        ℹ️ Se guardarán <strong>{Object.keys(documentReviews).filter(
                                            key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                        ).length}</strong> documentos con sus observaciones e imágenes adjuntas
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 mt-6"></div>
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

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleApproveApplication}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Shield className="w-5 h-5" />
                                    Aprobar solicitud
                                </button>
                                <button
                                    onClick={handleRejectApplication}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
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
