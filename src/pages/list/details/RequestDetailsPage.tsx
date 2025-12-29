import { useState, useEffect } from "react";
import { toast, Toaster } from 'sonner';
import { Image as ImageIcon, X } from "lucide-react";

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
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { API_URL, API_URL_DOCUMENTS } from "@/utils/api";
import { Link } from "react-router-dom";
import Section from "@/shared/components/Section";
import InfoRow from "@/shared/components/InfoRow";
import JuryItem from "@/shared/components/JuradoItem";
import TimelineItem from "@/shared/components/TimelineItem";
import PublicationSection from "@/shared/components/PublicationSection";

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
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedObservedEvent, setSelectedObservedEvent] = useState<any>(null);


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


    const fetchHistory = async (applicationId: string) => {
        const response = await fetch(`${API_URL}/applications/${applicationId}/history-with-paths`);
        const data = await response.json();
        return data;
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

    const normalizeStatus = (status: any) => {
        if (typeof status === "string") return status.toLowerCase();
        return ""; // o "pendiente" como default
    };

    const getStatusColor = (status: any) => {
        const normalizedStatus = normalizeStatus(status);

        const colorMap: Record<string, string> = {
            pendiente: "bg-amber-100 text-amber-800",
            aprobado: "bg-green-100 text-green-800",
            observado: "bg-red-100 text-red-800",
            en_revision: "bg-blue-100 text-amber-800",
            publicado: "bg-blue-100 text-blue-800"
        };

        return colorMap[normalizedStatus] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: any) => {
        const normalizedStatus = normalizeStatus(status);

        const statusMap: Record<string, string> = {
            pendiente: "Pendiente de revisión",
            aprobado: "Aprobado",
            observado: "Observado",
            en_revision: "En revisión",
            publicado: "Publicado"
        };

        return statusMap[normalizedStatus] || String(status ?? "Estado desconocido");
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
    console.log(applicationData)
    console.log("STATUS APP:", applicationData?.status, typeof applicationData?.status);

    const handleObservationChange = (e) => {
        if (selectedDocument) {
            setDocumentObservations(prev => ({
                ...prev,
                [selectedDocument]: e.target.value
            }));
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

            const totalDocs = applicationData.documents.length;
            const reviewedDocs = documentsWithDecisions.length;

            if (!window.confirm(
                `¿Guardar revisión de ${reviewedDocs} de ${totalDocs} documentos?\n\n` +
                `${Object.values(documentReviews).filter(d => d === 'aprobado').length} aprobados\n` +
                `${Object.values(documentReviews).filter(d => d === 'observado').length} observados`
            )) {
                return;
            }

            toast.info('Guardando revisión de documentos...');
            let successCount = 0;
            let errorCount = 0;

            // 1️⃣ Guardar revisiones individuales de documentos
            for (const doc of applicationData.documents) {
                const documentId = doc.document_id;
                const decision = documentReviews[documentId];

                if (!decision || decision === 'pendiente') continue;

                try {
                    const formData = new FormData();
                    const mappedStatus = mapStatusToDatabase(decision);

                    formData.append('status', mappedStatus);
                    formData.append('observation', documentObservations[documentId] || '');

                    const imgs = documentImages[documentId] || [];
                    imgs.forEach((image) => {
                        formData.append('images', image);
                    });

                    const response = await fetch(
                        `${API_URL}/applications/documents/${documentId}/review`,
                        { method: 'PATCH', body: formData }
                    );

                    const result = await response.json();

                    if (result.success) {
                        successCount++;
                        console.log(`✅ Documento ${documentId} actualizado`);
                    } else {
                        errorCount++;
                        console.error(`❌ Error en documento ${documentId}:`, result.message);
                    }

                } catch (err) {
                    errorCount++;
                    console.error(`❌ Error guardando documento ${documentId}:`, err);
                }
            }

            // 2️⃣ Actualizar estado GENERAL de la solicitud (solo si todo lo anterior salió OK)
            if (errorCount === 0 && successCount > 0) {
                const applicationId = getApplicationId();

                const approvedDocs = Object.values(documentReviews).filter(d => d === 'aprobado').length;
                const observedDocs = Object.values(documentReviews).filter(d => d === 'observado').length;
                const publishedDocs = Object.values(documentReviews).filter(d => d === 'publicado').length;


                let finalStatus = 'pendiente';
                let statusMessage = '';

                if (approvedDocs === totalDocs) {
                    finalStatus = 'aprobado';
                    statusMessage = `Todos los documentos (${totalDocs}) han sido aprobados`;
                } else if (observedDocs > 0) {
                    finalStatus = 'observado';
                    statusMessage = `${observedDocs} documento(s) observado(s) de ${totalDocs}`;
                } else if (approvedDocs > 0) {
                    finalStatus = 'en_revision';
                    statusMessage = `${approvedDocs} documento(s) aprobado(s), ${totalDocs - approvedDocs} pendiente(s)`;
                } else if (approvedDocs > 0) {
                    finalStatus = 'en_revision';
                    statusMessage = `${publishedDocs} documento(s) aprobado(s), ${totalDocs - publishedDocs} pendiente(s)`;
                }

                console.log('📊 Estado final calculado:', { finalStatus, statusMessage });

                try {
                    const reviewResponse = await fetch(`${API_URL}/applications/${applicationId}/review`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: finalStatus,
                            observations: statusMessage
                        })
                    });

                    const reviewResult = await reviewResponse.json();

                    if (reviewResult.success) {
                        console.log('✅ Estado general actualizado a:', finalStatus);
                        toast.success(`Estado general actualizado: ${finalStatus.toUpperCase()}`);

                        setTimeout(() => window.location.reload(), 1500);
                    } else {
                        console.warn('⚠️ No se pudo actualizar el estado general');
                        toast.warning('Documentos guardados, pero no se pudo actualizar el estado general');
                    }
                } catch (err) {
                    console.error('❌ Error actualizando estado general:', err);
                    toast.error('Error al actualizar el estado general de la solicitud');
                }

            } else if (errorCount > 0) {
                toast.warning(`⚠️ ${successCount} documentos guardados, ${errorCount} con errores`);
            }

        } catch (err) {
            console.error('❌ Error general:', err);
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
            status => status === 'observado'
        ).length;
        const published = Object.values(documentReviews).filter(
            status => status === 'publicado'
        ).length;

        const pending = total - reviewed;

        return { total, reviewed, approved, rejected, pending, published };
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
                    status: 'observado',
                    observations: observation
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Solicitud observada');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(result.message || 'Error al observar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al observar la solicitud');
        }
    };

    const mapStatusToDatabase = (frontendStatus) => {
        const statusMap = {
            'aprobado': 'aprobado',
            'observado': 'observado',
            'pendiente': 'pendiente',
            'publicado': 'publicado',


        };
        return statusMap[frontendStatus] || 'pendiente';
    };

    const getDocumentUrl = (filePath) => {
        if (!filePath) return '';
        if (filePath.startsWith('http')) return filePath;
        return `${API_URL_DOCUMENTS}/${filePath}`;
    };

    const openObservedDocsModalIfObserved = (item: any) => {
        const st = String(item?.new_status ?? "").toLowerCase();
        if (st !== "observado") return;

        setSelectedObservedEvent(item);   // ✅ guardo el observado exacto clickeado
        setShowDocumentModal(true);
    };

    const norm = (v: any) => String(v ?? "").toLowerCase();

    const toTime = (v: any) => {
        const s = String(v ?? "");
        const safe = s.includes(" ") ? s.replace(" ", "T") : s;
        const d = new Date(safe);
        return Number.isNaN(d.getTime()) ? null : d.getTime();
    };

    const getObservedDocumentsForEvent = (event: any) => {
        if (!event || !applicationData) return [];

        const eventTime = toTime(event.change_date);
        if (eventTime === null) return [];

        // 1) Historial SOLO de documentos (document_id) del mismo momento
        // 2) y SOLO los que quedaron OBSERVADO
        const relatedObservedHistory = (applicationData.history ?? []).filter((item: any) => {
            const itemTime = toTime(item.change_date);
            if (!item.document_id || itemTime === null) return false;
            if (itemTime !== eventTime) return false;
            return norm(item.new_status) === "observado";
        });

        // evitar duplicados por document_id (por si hay más de 1 registro)
        const byDoc = new Map<string, any>();
        for (const h of relatedObservedHistory) {
            if (!byDoc.has(h.document_id)) byDoc.set(h.document_id, h);
        }

        return Array.from(byDoc.values())
            .map((h: any) => {
                const doc = (applicationData.documents ?? []).find(
                    (d: any) => d.document_id === h.document_id
                );
                return doc ? { ...doc, _history: h } : null;
            })
            .filter(Boolean);
    };


    // Sección de Historial General (solo cambios de estado de la solicitud completa)
    const GeneralHistorySection = ({ history = [], onObservedClick }: any) => {
        const [showAll, setShowAll] = useState(false);

        const formatDate = (dateString) => {
            if (!dateString) return "Sin fecha";
            const safe = String(dateString).includes(" ")
                ? String(dateString).replace(" ", "T")
                : dateString;

            const d = new Date(safe);
            if (Number.isNaN(d.getTime())) return "Fecha inválida";

            return d.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        const normalizeStatus = (status: any) => {
            if (typeof status === "string") return status.toLowerCase();
            if (status === null || status === undefined) return "";
            return String(status).toLowerCase(); // convierte boolean/número a texto
        };

        const getStatusColor = (status) => {
            const normalizedStatus = normalizeStatus(status);
            const colors = {
                pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
                en_revision: "bg-blue-100 text-blue-800 border-blue-200",
                aprobado: "bg-green-100 text-green-800 border-green-200",
                observado: "bg-red-100 text-red-800 border-red-200",
                requiere_correccion: "bg-orange-100 text-orange-800 border-orange-200",
                publicado: "bg-purple-100 text-purple-800 border-purple-200",
            };
            return colors[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";
        };

        const getStatusIcon = (status: any) => {
            const normalizedStatus = normalizeStatus(status);

            switch (normalizedStatus) {
                case "aprobado":
                case "validado":
                    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
                case "observado":
                case "rechazado":
                    return <XCircle className="w-4 h-4 text-red-600" />;
                case "publicado":
                    return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
                default:
                    return <Clock className="w-4 h-4 text-blue-600" />;
            }
        };


        const getStatusLabel = (status) => {
            const labels = {
                pendiente: "Pendiente",
                en_revision: "En revisión",
                aprobado: "Aprobado",
                observado: "Observado",
                requiere_correccion: "Requiere correcciones",
                publicado: "Publicado",
            };
            return labels[status?.toLowerCase()] || status;
        };

        // 🎯 FILTRAR SOLO CAMBIOS DE ESTADO GENERAL (sin document_type)
        const generalHistory = (history || []).filter(
            (item) => !item.document_type || item.document_type === null || item.document_type === ""
        );

        // Ordenar por fecha (más reciente primero)
        const sortedHistory = [...generalHistory].sort(
            (a, b) => new Date(b.change_date).getTime() - new Date(a.change_date).getTime()
        );

        const visibleHistory = showAll ? sortedHistory : sortedHistory.slice(0, 3);
        const hasMore = sortedHistory.length > 3;

        if (!generalHistory || generalHistory.length === 0) {
            return (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Historial de Estado</h2>
                            <p className="text-sm text-slate-600">Cambios de estado general de la solicitud</p>
                        </div>
                    </div>
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No hay historial de cambios</p>
                        <p className="text-slate-400 text-sm mt-2">Los cambios de estado aparecerán aquí</p>
                    </div>
                </div>
            );
        }


        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900">Historial de Estados</h2>
                        <p className="text-sm text-slate-600">
                            {sortedHistory.length} {sortedHistory.length === 1 ? "cambio registrado" : "cambios registrados"}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {visibleHistory.map((item, index) => {
                        const isObserved = normalizeStatus(item.new_status) === "observado";

                        return (
                            <div key={item.history_id ?? `${item.change_date}-${index}`} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-4 h-4 rounded-full border-4 shadow-sm ${item.new_status === "aprobado"
                                            ? "bg-green-600 border-green-100"
                                            : item.new_status === "observado"
                                                ? "bg-red-600 border-red-100"
                                                : item.new_status === "publicado"
                                                    ? "bg-purple-600 border-purple-100"
                                                    : "bg-blue-600 border-blue-100"
                                            }`}
                                    ></div>
                                    {index < visibleHistory.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1"></div>}
                                </div>

                                <div className="flex-1 pb-6">
                                    <div
                                        className={`bg-slate-50 rounded-lg p-4 border-2 border-slate-200
                                                ${isObserved ? "cursor-pointer hover:border-red-300 hover:bg-red-50" : ""}
                                                `}
                                        onClick={() => {
                                            if (isObserved) onObservedClick?.(item);
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(item.new_status)}
                                                <p className="text-sm font-semibold text-slate-900">{getStatusLabel(item.new_status)}</p>
                                            </div>
                                        </div>

                                        {item.previous_status && item.previous_status !== item.new_status && (
                                            <div className="flex items-center gap-2 mb-3 text-xs">
                                                <span className={`px-2 py-1 rounded ${getStatusColor(item.previous_status)}`}>
                                                    {getStatusLabel(item.previous_status)}
                                                </span>
                                                <span className="text-slate-400">→</span>
                                                <span className={`px-2 py-1 rounded ${getStatusColor(item.new_status)}`}>
                                                    {getStatusLabel(item.new_status)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                <span className="font-mono">{formatDate(item.change_date)}</span>
                                            </div>

                                            {item.admin_name && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                    <User className="w-3 h-3" />
                                                    <span className="font-medium">{item.admin_name}</span>
                                                </div>
                                            )}
                                        </div>

                                        {isObserved && (
                                            <div className="mt-3 text-xs font-semibold text-red-700">
                                                Ver documentos observados →
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-lg transition-colors text-sm font-semibold text-slate-700 mt-4"
                    >
                        <Calendar className="w-4 h-4" />
                        {showAll ? (
                            <>
                                Mostrar menos <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Ver {sortedHistory.length - 5} cambios más <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}

            </div>
        );
    };


    const ReviewSummaryPanel = () => {
        const summary = getReviewSummary();


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

    const DocumentDetailsModal = () => {
        if (!showDocumentModal) return null;

        const rejectedDocs = getObservedDocumentsForEvent(selectedObservedEvent);


        return (
            <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                    <div className="bg-secondary px-6 py-4 flex items-center justify-between rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 " />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Documentos con Observaciones</h2>
                                <p className="text-red-100 text-sm">
                                    {rejectedDocs.length} {rejectedDocs.length === 1 ? 'documento' : 'documentos'} con observaciones
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDocumentModal(false)}
                            className="text-white hover:text-secondary hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {rejectedDocs.length > 0 ? (
                            <div className="space-y-6">
                                {rejectedDocs.map((doc) => {
                                    console.log("📌 DOC:", doc.document_id, doc.document_type);
                                    console.log("📌 rejection_history:", doc.rejection_history);
                                    return (
                                        <div key={doc.document_id} className="border border-red-200 rounded-xl overflow-hidden bg-red-50">
                                            <div className="bg-white border-b border-red-200 px-5 py-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                                            <FileText className="w-6 h-6 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 text-lg">
                                                                {getDocumentTypeLabel(doc.document_type)}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 mt-1">{doc.file_name}</p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <span className="text-xs text-slate-500">
                                                                    📦 {doc.size_kb} KB
                                                                </span>
                                                                <span className="text-xs text-slate-500">
                                                                    📅 {formatDate(doc.upload_date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${doc._history?.new_status === 'observado'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-orange-100 text-orange-800'
                                                            }`}
                                                    >
                                                        {getStatusLabel(doc._history?.new_status || doc.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="px-5 py-4">
                                                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-red-900 text-sm mb-3">
                                                                Observaciones (historial):
                                                            </h4>

                                                            <div className="bg-white rounded-lg p-3 border border-red-200">
                                                                <div className="text-xs text-slate-500 mb-1">
                                                                    {formatDate(doc._history?.change_date)}
                                                                </div>
                                                                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                                                                    {doc._history?.comment ||
                                                                        doc._history?.observations ||
                                                                        doc.rejection_reason ||
                                                                        "Sin observación"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {doc.images && doc.images.length > 0 && (
                                                <div className="px-5 pb-4">
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Capturas de pantalla ({doc.images.length})
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {doc.images.map((image, imgIndex) => (
                                                            <div key={imgIndex} className="group relative">
                                                                <div className="aspect-square rounded-lg overflow-hidden bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                                                    <img
                                                                        src={`${API_URL_DOCUMENTS}/${image.image_path}`}
                                                                        alt={image.file_name}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                        onClick={() => window.open(`${API_URL_DOCUMENTS}/${image.image_path}`, '_blank')}
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-slate-600 mt-1 truncate" title={image.file_name}>
                                                                    {image.file_name}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="px-5 pb-4 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const url = getDocumentUrl(doc.file_path);
                                                        window.open(url, '_blank');
                                                    }}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ver Documento
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const url = getDocumentUrl(doc.file_path);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = doc.file_name;
                                                        link.target = '_blank';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Descargar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-7 5h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    Sin documentos para esta observación
                                </h3>
                                <p className="text-slate-600">No se encontraron documentos asociados al evento seleccionado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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
                                {applicationData.application_type === 'docente' && (
                                    <InfoRow label="Tipo de financiamiento" value={applicationData.funding_type || "No especificado"} />
                                )}
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
                                                    <td className="py-3 px-4">
                                                        {advisor.full_name ||
                                                            [advisor.nombre, advisor.apellido].filter(Boolean).join(" ") ||
                                                            "N/A"}
                                                    </td>

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
                        <GeneralHistorySection
                            history={applicationData.history ?? []}
                            onObservedClick={openObservedDocsModalIfObserved}
                        />

                        <div className="lg:col-span-2 mt-6">
                            <PublicationSection
                                applicationId={applicationData.application_id}
                                initialLink={applicationData.published_thesis_link ?? ""}
                                onSave={async (link) => {
                                    const response = await fetch(
                                        `${API_URL}/applications/${applicationData.application_id}/publication-link`
                                        ,
                                        {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ publicationLink: link })
                                        }
                                    );

                                    if (!response.ok) {
                                        throw new Error('Error al guardar');
                                    }

                                    // Actualizar estado local
                                    setApplicationData({
                                        ...applicationData,
                                        publication_link: link
                                    });
                                }}
                            />
                        </div>

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
                                                ${decision === "observado" ? "border-red-300 bg-red-50" : ""}
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
                                                            handleReviewDecision(doc.document_id, "observado");
                                                        }}
                                                        title="Rechazar"
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors text-sm font-bold
                                            ${decision === "observado"
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
                                <div className=" from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                    <h3 className="text-300 font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-blue-600" />
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
                                                {Object.values(documentReviews).filter(d => d === 'observado').length}
                                            </div>
                                            <div className="text-xs text-red-600 mt-1">✕ Observados</div>
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
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveAllDocuments();
                                            }}
                                            disabled={
                                                Object.keys(documentReviews).filter(
                                                    key => documentReviews[key] && documentReviews[key] !== "pendiente"
                                                ).length === 0
                                            }
                                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                                                ${Object.keys(documentReviews).filter(
                                                key => documentReviews[key] && documentReviews[key] !== "pendiente"
                                            ).length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                                                }`}
                                        >
                                            <Upload className="w-5 h-5" />
                                            Guardar Todas las Revisiones (
                                            {Object.keys(documentReviews).filter(
                                                key => documentReviews[key] && documentReviews[key] !== "pendiente"
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
                                                Se guardarán <strong>{Object.keys(documentReviews).filter(
                                                    key => documentReviews[key] && documentReviews[key] !== 'pendiente'
                                                ).length}</strong> documentos con sus observaciones e imágenes adjuntas
                                            </div>
                                        )}
                                </div>

                            </div>
                        )}
                    </Section>
                    <div className="lg:col-span-2 mt-6">

                    </div>

                    {/*applicationData.documents && applicationData.documents.some(doc => doc.images && doc.images.length > 0) && (
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Imágenes Adjuntas a los Documentos
                            </h3>

                            <div className="space-y-6">
                                {applicationData.documents.map((doc) => (
                                    doc.images && doc.images.length > 0 && (
                                        <div key={doc.document_id} className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-700 mb-3">
                                                📄 {doc.file_name}
                                            </h4>

                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {doc.images.map((image) => (
                                                    <div key={image.image_id} className="group relative">
                                                        <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                            <img
                                                                src={`${API_URL_DOCUMENTS}/${image.image_path}`}
                                                                alt={image.file_name}
                                                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                                                onClick={() => window.open(image.image_path, '_blank')}
                                                            />
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-xs text-gray-600 truncate" title={image.file_name}>
                                                                {image.file_name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(image.created_at).toLocaleDateString('es-PE')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )*/}

                    <div className="lg:col-span-2 mt-6"></div>

                    <div className="space-y-4">

                    </div>

                </div>

                <DocumentDetailsModal />
            </main>
        </div>
    );
}

