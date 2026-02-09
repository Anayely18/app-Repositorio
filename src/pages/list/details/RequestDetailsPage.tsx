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

import { API_URL_DOCUMENTS } from "@/utils/api";
import { authFetch } from "@/utils/authFetch";
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
                const response = await authFetch(`/applications/details/${applicationId}`);

                if (!response.ok) {
                    throw new Error('Error al cargar los detalles');
                }
                const result = await response.json();
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

    const clean = (v: any) => String(v ?? "").trim().replace(/\s+/g, " ");

    const toTitleCase = (s: string) => {
        const small = new Set(["de", "del", "la", "las", "los", "y", "e"]);
        return clean(s)
            .split(" ")
            .map((w, i) => {
                const lw = w.toLowerCase();
                if (i > 0 && small.has(lw)) return lw;
                // soporta "Wibrow-Pérez"
                return lw
                    .split("-")
                    .map(p => (p ? p[0].toUpperCase() + p.slice(1) : p))
                    .join("-");
            })
            .join(" ");
    };

    const toMetadataName = (p: any) => {
        const last = toTitleCase(p?.last_name ?? p?.surname ?? p?.apellidos ?? p?.lastName ?? "");
        const first = toTitleCase(p?.first_name ?? p?.name ?? p?.nombres ?? p?.firstName ?? "");

        if (!last && !first) {

            const full = toTitleCase(p?.full_name ?? p?.fullName ?? "");
            return full || "—";
        }

        if (!last) return first;
        if (!first) return last;
        return `${last}, ${first}`;
    };


    const titleCaseName = (value: string) => {
        const s = clean(value).toLowerCase();
        if (!s) return "";

        return s
            .split(" ")
            .filter(Boolean)
            .map((w) =>
                w
                    .split("-")
                    .map((p) =>
                        p
                            .split("'")
                            .map((q) => (q ? q[0].toUpperCase() + q.slice(1) : ""))
                            .join("'")
                    )
                    .join("-")
            )
            .join(" ");
    };

    const toMetadataFromSingleField = (fullName: string) => {
        const s = clean(fullName);
        if (!s) return "—";

        if (s.includes(",")) {
            const [lastRaw, firstRaw] = s.split(",", 2);
            const last = titleCaseName(lastRaw);
            const first = titleCaseName(firstRaw);
            return `${last}, ${first}`.replace(/\s+,/g, ",").replace(/,\s+/g, ", ");
        }

        const parts = s.split(" ").filter(Boolean);
        if (parts.length === 1) return titleCaseName(parts[0]);
        if (parts.length === 2) return `${titleCaseName(parts[1])}, ${titleCaseName(parts[0])}`;

        const last = parts.slice(-2).join(" ");
        const first = parts.slice(0, -2).join(" ");
        return `${titleCaseName(last)}, ${titleCaseName(first)}`;
    };

    const normalizeTitleForRepo = (title: any) => {
        const s = clean(title);
        if (!s) return "Sin título";

        const makeSentenceCase = (t: string) => {
            const trimmed = t.trim();
            if (!trimmed) return trimmed;
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        };

        const letters = s.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, "");
        const looksAllCaps = letters && letters === letters.toUpperCase();

        const base = looksAllCaps ? s.toLowerCase() : s;

        const parts = base.split(":");
        const fixed = parts.map((p, i) => makeSentenceCase(p));
        return fixed.join(": ");
    };

    const cleanObservationText = (text: any) => {
        const s = String(text ?? "").trim();
        if (!s) return "";

        return s
            .replace(
                /^\s*[\w]+(?:_[\w]+)+\s*-\s*(?:observado|rechazado|requiere_correccion)\s*:\s*/i,
                ""
            )
            .trim();
    };

    const pickDocObservation = (doc: any) => {

        console.log("🔍 pickDocObservation - doc completo:", doc);
        console.log("🔍 _history:", doc?._history);
        if (doc?._history?.comentario) {
            return cleanObservationText(doc._history.comentario);
        }

        if (doc?._history?.comment) {
            return cleanObservationText(doc._history.comment);
        }

        const raw =
            doc?._history?.rejection_reason ??
            doc?._history?.razon_rechazo ??
            doc?._history?.observation ??
            doc?._history?.observations ??
            doc?.rejection_reason ??
            doc?.razon_rechazo ??
            doc?.observation ??
            doc?.observations ??
            "";
        const cleaned = cleanObservationText(raw);
        console.log("🔍 Observación extraída:", cleaned);
        return cleaned;
    };


    const fetchHistory = async (applicationId: string) => {
        const response = await authFetch(`/applications/${applicationId}/history-with-paths`);

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

    const parseBackendDate = (dateString: any) => {
        if (!dateString) return null;

        let s = String(dateString).trim();

        if (s.includes(" ")) s = s.replace(" ", "T");

        s = s.replace(/(\.\d{3})\d+/, "$1");

        const hasTZ = /Z$|[+-]\d{2}:\d{2}$/.test(s);
        if (!hasTZ) s += "Z";

        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const formatDate = (dateString: any) => {
        const d = parseBackendDate(dateString);
        if (!d) return "Sin fecha";

        return d.toLocaleString("es-PE", {
            timeZone: "America/Lima",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };


    const normalizeStatus = (status: any) => {
        if (typeof status === "string") return status.toLowerCase();
        return "";
    };

    const getStatusColor = (status: any) => {
        const normalizedStatus = normalizeStatus(status);

        const colorMap: Record<string, string> = {
            pendiente: "bg-amber-100 text-amber-800",
            aprobado: "bg-green-100 text-green-800",
            observado: "bg-red-100 text-red-800",
            en_revision: "bg-blue-100 text-amber-800",
            requiere_correccion: "bg-orange-100 text-orange-800",
            publicado: "bg-purple-100 text-purple-900"
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
            requiere_correccion: "requiere corrección",
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
        console.log("📊 Estado antes de guardar:", {
            documentReviews,
            documentObservations,
            documentImages
        });
        try {

            const documentsWithDecisions = Object.keys(documentReviews).filter(
                docId => documentReviews[docId] && documentReviews[docId] !== 'pendiente'
            );

            if (documentsWithDecisions.length === 0) {
                toast.error('Debes aprobar o rechazar al menos un documento');
                return;
            }

            const observedDocs = documentsWithDecisions.filter(
                docId => documentReviews[docId] === 'observado'
            );

            const observedWithoutComments = observedDocs.filter(
                docId => !documentObservations[docId]?.trim()
            );

            if (observedWithoutComments.length > 0) {
                const docNames = observedWithoutComments.map(docId => {
                    const doc = applicationData.documents.find(d => d.document_id === docId);
                    return getDocumentTypeLabel(doc?.document_type);
                }).join(', ');

                toast.error(`Los siguientes documentos observados necesitan comentarios: ${docNames}`);
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

            for (const doc of applicationData.documents) {
                const documentId = doc.document_id;
                const decision = documentReviews[documentId];

                if (!decision || decision === 'pendiente') continue;

                const observationText = documentObservations[documentId] || '';
                console.log(`📝 Guardando doc ${documentId}:`, {
                    decision,
                    observation: observationText,
                    hasObservation: !!observationText.trim()
                });

                try {
                    const formData = new FormData();
                    const mappedStatus = mapStatusToDatabase(decision);

                    formData.append('status', mappedStatus);
                    formData.append('observation', documentObservations[documentId] || '');

                    const imgs = documentImages[documentId] || [];
                    imgs.forEach((image) => {
                        formData.append('images', image);
                    });

                    console.log(`📤 Enviando a /documents/${documentId}/review:`, {
                        status: mappedStatus,
                        observation: observationText,
                        imagesCount: imgs.length
                    });

                    const response = await authFetch(`/applications/documents/${documentId}/review`, {
                        method: "PATCH",
                        body: formData,
                    });

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
                } else if (publishedDocs > 0) {
                    finalStatus = 'publicado';
                    statusMessage = `${publishedDocs} documento(s) aprobado(s), ${totalDocs - publishedDocs} pendiente(s)`;
                }

                console.log('📊 Estado final calculado:', { finalStatus, statusMessage });

                try {
                    const reviewResponse = await authFetch(`/applications/${applicationId}/review`, {
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

            const reviewResponse = await authFetch(`/applications/${applicationId}/review`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'aprobado',
                    observations: observation
                })
            });

            const result = await reviewResponse.json();

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

            const reviewResponse = await authFetch(`/applications/${applicationId}/review`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'observado',
                    observations: observation
                })
            });

            const result = await reviewResponse.json();

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

        setSelectedObservedEvent(item);
        setShowDocumentModal(true);
    };

    const norm = (v: any) => String(v ?? "").toLowerCase();

    const toTime = (v: any) => {
        const s = String(v ?? "");
        const safe = s.includes(" ") ? s.replace(" ", "T") : s;
        const d = new Date(safe);
        return Number.isNaN(d.getTime()) ? null : d.getTime();
    };

    const WINDOW_MS = 10 * 60 * 1000;

    const getObservedDocumentsForEvent = (event: any) => {
        if (!event || !applicationData) return [];

        console.log("🔍 getObservedDocumentsForEvent - event:", event);
        console.log("🔍 applicationData.history:", applicationData.history);

        const eventTime = toTime(event.change_date);
        if (eventTime === null) return [];

        // ✅ CAMBIO: Usar ventana de tiempo en lugar de igualdad exacta
        const WINDOW_MS = 10 * 60 * 1000; // 10 minutos

        // ✅ Filtrar registros del historial que son del mismo timestamp y están observados
        const relatedObservedHistory = (applicationData.history ?? []).filter((item: any) => {
            const itemTime = toTime(item.change_date);

            if (!item.document_id || itemTime === null) return false;
            
            // ✅ CAMBIO: Comparar con ventana de tiempo
            const timeDiff = Math.abs(itemTime - eventTime);
            if (timeDiff > WINDOW_MS) return false;
            
            return norm(item.new_status) === "observado";
        });

        console.log("🔍 Registros observados relacionados:", relatedObservedHistory);

        const byDoc = new Map<string, any>();
        for (const h of relatedObservedHistory) {
            // ✅ Guardar el más cercano en tiempo si hay múltiples
            const existing = byDoc.get(h.document_id);
            if (!existing) {
                byDoc.set(h.document_id, h);
            } else {
                const existingTime = toTime(existing.change_date);
                const newTime = toTime(h.change_date);
                if (Math.abs(newTime - eventTime) < Math.abs(existingTime - eventTime)) {
                    byDoc.set(h.document_id, h);
                }
            }
        }

        // ✅ Mapear con la información del documento y el archivo histórico
        const result = Array.from(byDoc.values())
            .map((h: any) => {
                const doc = (applicationData.documents ?? []).find(
                    (d: any) => d.document_id === h.document_id
                );

                if (!doc) {
                    console.warn(`⚠️ Documento ${h.document_id} no encontrado en documents[]`);
                    return null;
                }

                console.log(`✅ Documento encontrado:`, {
                    document_id: doc.document_id,
                    document_type: doc.document_type,
                    history_record: h
                });

                return {
                    ...doc,
                    _history: h,
                    _observationText: h.comment || h.comentario || h.observation,
                    // ✅ IMPORTANTE: Usar el archivo histórico del historial, no el actual
                    _historicalPath: h.file_path_historic || h.file_path_historico,
                    _historicalName: h.file_name_historic || h.file_name_historico,
                    // ✅ Buscar imágenes asociadas a este registro de historial
                    _historicalImages: h.images || []
                };
            })
            .filter(Boolean);

        console.log("✅ Documentos observados finales:", result);
        console.log("📊 Total documentos encontrados:", result.length);
        
        return result;
    };


    const normalizeKey = (v: any) =>
        String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");

    const CAREER_TO_FACULTY: Record<string, string> = {
        "ingeniería informática y sistemas": "Facultad de Ingeniería",
        "ingeniería civil": "Facultad de Ingeniería",
        "ingeniería de minas": "Facultad de Ingeniería",
        "ingeniería agroindustrial": "Facultad de Ingeniería",
        "ingeniería agroecológica y desarrollo rural": "Facultad de Ingeniería",

        "administración": "Facultad de Administración",

        "ciencia política y gobernabilidad": "Facultad de Educación y Ciencias Sociales",
        "educación inicial intercultural y bilingüe 1ra y 2da infancia": "Facultad de Educación y Ciencias Sociales",
        "medicina veterinaria y zootécnia": "Facultad de Medicina Veterinaria y Zootecnia",
    };

    const getFacultyFromCareer = (career: any) =>
        CAREER_TO_FACULTY[normalizeKey(career)] || "";

    const GeneralHistorySection = ({ history = [], onObservedClick }: any) => {
        const [showAll, setShowAll] = useState(false);

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
                case "requiere_correccion":
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




        const generalHistory = (history || []).filter(
            (item) => !item.document_type || item.document_type === null || item.document_type === ""
        );

        const sortedHistory = [...generalHistory].sort(
            (a, b) => new Date(b.change_date).getTime() - new Date(a.change_date).getTime()
        );

        const visibleHistory = showAll ? sortedHistory : sortedHistory.slice(0, 3);
        const hasMore = sortedHistory.length > 3;

        if (!generalHistory || generalHistory.length === 0) {
            return (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:min-h-[520px]">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Historial</h2>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col h-[700px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900">Historial</h2>
                        <p className="text-sm text-slate-600">
                            {sortedHistory.length} {sortedHistory.length === 1 ? "cambio registrado" : "cambios registrados"}
                        </p>
                    </div>
                </div>


                <div className="flex-1 min-h-0">
                    <div className={`h-full pr-2 space-y-4 ${showAll ? "overflow-y-auto" : ""}`}>
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
                                        />
                                        {index < visibleHistory.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
                                    </div>

                                    <div className="flex-1 pb-6">
                                        <div
                                            className={`bg-slate-50 rounded-lg p-4 border-2 border-slate-200 ${isObserved ? "cursor-pointer hover:border-red-300 hover:bg-red-50" : ""
                                                }`}
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
                </div>


                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-lg transition-colors text-sm font-semibold text-slate-700 mt-4"
                    >
                        <Calendar className="w-4 h-4" />
                        {showAll ? (
                            <>Mostrar menos <ChevronUp className="w-4 h-4" /></>
                        ) : (
                            <>Ver {sortedHistory.length - 3} cambios más <ChevronDown className="w-4 h-4" /></>
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
        rejectedDocs.forEach((doc, idx) => {
            console.log(`📄 Doc ${idx}:`, {
                document_id: doc.document_id,
                document_type: doc.document_type,
                _historicalImages: doc._historicalImages,
                _history: doc._history,
                historyImages: doc._history?.images
            });
        });
        console.log("📋 DocumentDetailsModal - rejectedDocs:", rejectedDocs);

        const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const stripObservationPrefix = (text: string, doc: any) => {
            if (!text) return text;

            let t = String(text).trim();

            if (doc?.document_type) {
                const re = new RegExp(`^\\s*${escapeRegExp(doc.document_type)}\\s*-\\s*`, "i");
                t = t.replace(re, "");
            }

            t = t.replace(/^\s*-\s*(observado|rechazado|pendiente)\s*:\s*/i, "");
            t = t.replace(/^\s*(observado|rechazado|pendiente)\s*:\s*/i, "");

            return t.trim();
        };

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
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {rejectedDocs.length > 0 ? (
                            <div className="space-y-6">
                                {rejectedDocs.map((doc: any) => {
                                    console.log("📄 Renderizando doc:", {
                                        document_id: doc.document_id,
                                        _history: doc._history,
                                        _observationText: doc._observationText,
                                        _historicalPath: doc._historicalPath,
                                        _historicalName: doc._historicalName,
                                        _historicalImages: doc._historicalImages || []
                                    });

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
                                                            {/* ✅ Mostrar el nombre del archivo histórico */}
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                {doc._historicalName || doc.file_name}
                                                            </p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <span className="text-xs text-slate-500">
                                                                    📦 {doc.size_kb} KB
                                                                </span>
                                                                <span className="text-xs text-slate-500">
                                                                    📅 {formatDate(doc._history?.change_date || doc.upload_date)}
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
                                                                Observaciones:
                                                            </h4>

                                                            <div className="text-xs text-slate-500 mb-1">
                                                                {formatDate(doc._history?.change_date || doc.upload_date)}
                                                            </div>

                                                            <div className="text-sm text-slate-700 whitespace-pre-wrap">
                                                                {(() => {
                                                                    const rawObs =
                                                                        doc._observationText ||
                                                                        pickDocObservation(doc) ||
                                                                        doc._history?.comment ||
                                                                        doc._history?.comentario ||
                                                                        doc.rejection_reason ||
                                                                        "Sin observación registrada";

                                                                    return stripObservationPrefix(rawObs, doc);
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ✅ Mostrar imágenes históricas asociadas a este registro */}
                                            {doc._historicalImages && doc._historicalImages.length > 0 && (
                                                <div className="px-5 pb-4">
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-slate-600" />
                                                        Capturas de pantalla ({doc._historicalImages.length})
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {doc._historicalImages.map((image, imgIndex) => (
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

                                            {/* ✅ Botones para ver/descargar el archivo HISTÓRICO */}
                                            <div className="px-5 pb-4 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const url = getDocumentUrl(doc._historicalPath || doc.file_path);
                                                        window.open(url, '_blank');
                                                    }}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ver Documento Observado
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const url = getDocumentUrl(doc._historicalPath || doc.file_path);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = doc._historicalName || doc.file_name;
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
                                    <FileText className="w-8 h-8 text-slate-500" />
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
                                <InfoRow label="Título" value={normalizeTitleForRepo(applicationData.project_name)} />
                                <InfoRow label="Escuela Profesional" value={applicationData.professional_school || "No especificada"} />
                                <InfoRow
                                    label="Facultad"
                                    value={getFacultyFromCareer(applicationData.professional_school) || "No especificada"}
                                />

                                <InfoRow label="Tipo de trabajo" value={applicationData.application_type === 'estudiante' ? 'Tesis de pregrado' : 'Informe de investigacion'} />
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
                                                <th className="py-3 px-4 font-semibold">Nombre Completo</th>
                                                <th className="py-3 px-4 font-semibold">DNI</th>
                                                <th className="py-3 px-4 font-semibold">Escuela</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200">
                                            {applicationData.authors.map((author, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="py-3 px-4 ">{toMetadataName(author)}</td>
                                                    <td className="py-3 px-4">{author.dni || "N/A"}</td>
                                                    <td className="py-3 px-4">{author.professional_school || "N/A"}</td>
                                                    <td className="py-3 px-4">

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
                                                    <th className="py-3 px-4 font-semibold">Nombre Completo</th>
                                                    <th className="py-3 px-4 font-semibold">Tipo Coautor</th>
                                                    <th className="py-3 px-4 font-semibold">Ubicacion Coautor</th>
                                                    <th className="py-3 px-4 font-semibold">ORCID</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {applicationData.coauthors.map((coauthor, index) => (
                                                    <tr key={coauthor.coauthor_id || index} className="hover:bg-slate-50">
                                                        <td className="py-3 px-4">{toMetadataName(coauthor)}</td>
                                                        <td className="py-3 px-4">{coauthor.role_type || "N/A"}</td>
                                                        <td className="py-3 px-4">{coauthor.location_type || "N/A"}</td>
                                                        <td className="py-3 px-4">{coauthor.orcid_url || "N/A"}</td>
                                                        <td className="py-3 px-4"></td>
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
                        {applicationData.application_type === 'estudiante' && (
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
                                                        <td className="py-3 px-4">{toMetadataName(advisor)}</td>
                                                        <td className="py-3 px-4">{advisor.dni || "N/A"}</td>
                                                        <td className="py-3 px-4">{advisor.orcid || "N/A"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm py-4">No hay asesores registrados</p>
                                )}
                            </Section>
                        )}
                        {applicationData.application_type === 'estudiante' && (
                            <Section title="Jurado Evaluador" icon={Users}>
                                {applicationData.jury && applicationData.jury.length > 0 ? (
                                    <div className="space-y-3">
                                        {[...applicationData.jury]
                                            .sort((a, b) => a.jury_role === 'presidente' ? -1 : b.jury_role === 'presidente' ? 1 : 0)
                                            .map((juryMember, index) => (
                                                <JuryItem
                                                    key={juryMember.jury_id ?? index}
                                                    rol={getJuryRoleLabel(juryMember.jury_role)}
                                                    nombre={toMetadataFromSingleField(juryMember.full_name) || "No asignado"}
                                                    badge={juryMember.jury_role === "presidente" ? "Principal" : "Miembro"}
                                                />

                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm py-4">No hay jurado asignado</p>
                                )}
                            </Section>
                        )}
                    </div>

                    <div className="space-y-6 min-w-0">
                        <GeneralHistorySection
                            history={applicationData?.history ?? []}
                            onObservedClick={(item) => {
                                console.log("🧾 ITEM HISTORIAL (onObservedClick):", item);
                                openObservedDocsModalIfObserved(item);
                            }}
                        />

                        <div className="mt-6 min-w-0">
                            <PublicationSection
                                applicationId={applicationData.application_id}
                                initialLink={applicationData.published_thesis_link ?? ""}
                                onSave={async (link) => {
                                    const response = await authFetch(`/applications/${applicationData.application_id}/publication-link`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ publicationLink: link })
                                    }
                                    );
                                    const json = await response.json();
                                    console.log("✅ publication-link response:", json);

                                    if (!response.ok) {
                                        throw new Error('Error al guardar');
                                    }


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
                                                            const url = getDocumentUrl(doc._historicalPath || doc.file_path);
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
                                                            const url = getDocumentUrl(doc._historicalPath || doc.file_path);
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
                    <div className="lg:col-span-2 mt-6"></div>

                    <div className="space-y-4">

                    </div>

                </div>

                <DocumentDetailsModal />
            </main>
        </div>
    );
}

