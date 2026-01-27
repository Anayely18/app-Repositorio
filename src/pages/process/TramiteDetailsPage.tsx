import { ResubmitModal } from "@/shared/components/ResubmitModal";
import { GeneralHistorySection } from "@/shared/components/GeneralHistorySection";
import { ObservedDocsModal } from "@/shared/components/ObservedDocsModal";
import { ImageModal } from '@/shared/components/ImageModal';
import { ApplicantInfo } from '@/shared/components/ApplicantInfo';
import { DocumentCard } from '@/shared/components/DocumentCard';
import { ConstanciaStatus } from '@/shared/components/ConstanciaStatus';
import { Timeline } from '@/shared/components/Timeline';
import { useEffect, useState } from 'react';
import Logo from "@/shared/ui/Logo"
import { API_URL } from "@/utils/api";
import { Link } from "react-router-dom";
import {
    Search,
    FileText,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Download,
    Loader2,
    ArrowLeft,
    User,
    RefreshCw,
    Mail,
    Phone,
    ImageIcon,
    ZoomIn,
    X,
    GraduationCap,
    Users,
    ChevronLeft,
    ChevronRight,
    FileX,
    History,
    ChevronUp,
    ChevronDown
} from 'lucide-react';


export function TramiteDetailsPage({ tramiteData, activeTab, onReset }) {
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showObservedDocsModal, setShowObservedDocsModal] = useState(false);
    const [selectedObservedEvent, setSelectedObservedEvent] = useState(null);
    const [showResubmitModal, setShowResubmitModal] = useState(false);


    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    const [data, setData] = useState(tramiteData || {});
    useEffect(() => {
        setData(tramiteData);
    }, [tramiteData]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando información del trámite...</p>
                </div>
            </div>
        );
    }

    const norm = (v: any) => String(v ?? "").toLowerCase().trim();

    const getDocStatus = (d: any) =>
        norm(d?.status ?? d?.document_status ?? d?.current_status);

    const hasObservedDocs = (data?.documents ?? []).some((d: any) => {
        const st = getDocStatus(d);
        return (
            st === "observado" ||
            st === "rechazado" ||
            st === "requiere_correccion" ||
            Boolean(d?.rejection_reason || d?.observation || d?.observations)
        );
    });

    const rawStatus = norm(data?.status);
    const uiStatus = hasObservedDocs ? "observado" : rawStatus;


    const isPublicado = uiStatus === "publicado";

    console.log("documents[0]:", data?.documents?.[0]);

    const openImageModal = (images, startIndex) => {
        setAllImages(images);
        setCurrentImageIndex(startIndex);
        setSelectedImage(images[startIndex]);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
        setAllImages([]);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        const newIndex = (currentImageIndex + 1) % allImages.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
    };

    const handleTimelineClick = (historyItem: any) => {
        const st = String(historyItem?.new_status ?? historyItem?.status ?? "").toLowerCase();

        console.log("CLICK timeline item:", historyItem);
        console.log("STATUS detectado:", st);


        if (st === "observado" || st === "rechazado") {
            setSelectedObservedEvent(historyItem);
            setShowObservedDocsModal(true);


            setShowHistoryModal(false);
            return;
        }


        setSelectedHistory(historyItem);
        setShowHistoryModal(true);
    };

    const prevImage = () => {
        const newIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
    };

    const getStatusColor = (status) => {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            en_revision: 'bg-blue-100 text-blue-800 border-blue-200',
            aprobado: 'bg-green-100 text-green-800 border-green-200',
            observado: 'bg-red-100 text-red-800 border-red-200',
            requiere_correccion: 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const isCorrectionStatus = ["observado", "requiere_correccion"].includes(
        String(data?.status ?? "").toLowerCase()
    );
    const resubmitPath =
        activeTab === "docente"
            ? "/teacher-research-report-request"
            : "/student-research-report-request";

    const getStatusIcon = (status) => {
        switch (status) {
            case 'aprobado':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'observado':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'en_revision':
                return <Clock className="w-5 h-5 text-blue-600" />;
            case 'requiere_correccion':
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const pick = (v: any) => (v ?? "").toString().trim();

    const normalizeAuthor = (a: any) => ({
        first_name: pick(a?.first_name ?? a?.firstName ?? a?.name ?? a?.nombres),
        last_name: pick(a?.last_name ?? a?.lastName ?? a?.surname ?? a?.apellidos),
        dni: pick(a?.dni ?? a?.documentNumber ?? a?.document_number),
    });



    const resubmitAuthors =
        Array.isArray(data?.authors) && data.authors.length > 0
            ? data.authors.map(normalizeAuthor)
            : data?.applicant
                ? [normalizeAuthor(data.applicant)]
                : [];


    const observedDocsForResubmit = (data?.documents ?? [])
        .filter((d) => {
            const st = String(d?.status ?? d?.document_status ?? "").toLowerCase();
            return st === "observado" || Boolean(d?.rejection_reason || d?.observation || d?.observations);
        })
        .map((d) => ({
            document_type: d?.document_type ?? d?.type ?? d?.key ?? d?.name ?? "documento",
            rejection_reason: d?.rejection_reason ?? d?.observation ?? d?.observations ?? d?.description ?? "",
            images: Array.isArray(d?.images) ? d.images : (Array.isArray(d?.evidence_images) ? d.evidence_images : [])
        }));

    const refreshTramite = async () => {
        const dni = data?.applicant?.dni;
        if (!dni) return;

        const url = `${API_URL}/applications/search?dni=${encodeURIComponent(dni)}&type=${encodeURIComponent(activeTab)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok || !json?.success) {
            throw new Error(json?.message || "No se pudo actualizar el trámite");
        }
        setData(json.data);
    };

    const handleResubmitClose = () => setShowResubmitModal(false);

    const handleResubmitSuccess = async () => {
        setShowResubmitModal(false);

        try {
            await refreshTramite();
        } catch (e) {
            console.error("❌ Error refrescando trámite:", e);
        }
    };


    const getStatusLabel = (status) => {
        const labels = {
            pendiente: 'Pendiente de revisión',
            en_revision: 'En revisión',
            aprobado: 'Aprobado',
            observado: 'observado',
            requiere_correccion: 'Requiere correcciones',
            publicado: 'Publicado'
        };
        return labels[status] || status;
    };

    const authorsForUI =
        tramiteData?.authors ??
        tramiteData?.applicant?.authors ??
        data?.authors ??
        data?.applicant?.authors ??
        [];

    const authorNames =
        Array.isArray(authorsForUI) && authorsForUI.length > 0
            ? authorsForUI
                .map((a: any) =>
                    `${pick(a?.first_name ?? a?.firstName ?? a?.name ?? a?.nombres)} ${pick(
                        a?.last_name ?? a?.lastName ?? a?.surname ?? a?.apellidos
                    )}`.trim()
                )
                .filter(Boolean)
            : [];

    //Bloque de autores
    function initialsFromName(name: string) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "AA";
        const first = parts[0]?.[0] ?? "";
        const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : "") ?? "";
        return (first + last).toUpperCase();
    }

    function AuthorsCard({ authorNames }: { authorNames: string[] }) {
        if (!Array.isArray(authorNames) || authorNames.length === 0) return null;

        return (
            <div className="mt-6 bg-white rounded-2xl  border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-700" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">
                            {authorNames.length > 1 ? "Autores" : "Autor"}
                        </h2>
                        <p className="text-sm text-slate-600">
                            {authorNames.length} {authorNames.length === 1 ? "persona" : "personas"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {authorNames.map((name, idx) => (
                        <div
                            key={`${name}-${idx}`}
                            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors"
                            title={name}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-blue-700">
                                    {initialsFromName(name)}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                                <p className="text-xs text-slate-500 truncate">
                                    {authorNames.length > 1 ? "Autor" : "Autor principal"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    //modal de documentos observados desde el historial
    const openObservedDocsModalIfObserved = (item) => {
        const st = String(item?.new_status ?? item?.status ?? "").toLowerCase();
        if (st !== "observado") return;

        setSelectedObservedEvent(item);
        setShowObservedDocsModal(true);
    };

    //diseño del modal de detalles del historial
    const HistoryDetailsModal = () => {
        if (!showHistoryModal || !selectedHistory) return null;
        console.log(selectedHistory)
        const hasImages = selectedHistory.images && selectedHistory.images.length > 0;
        const hasObservations = selectedHistory.description;

        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Detalles del Historial</h2>
                                <p className="text-blue-100 text-sm">
                                    {new Date(selectedHistory.date).toLocaleDateString('es-PE', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHistoryModal(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-500 mb-1">Estado</p>
                                    <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(selectedHistory.status)}`}>
                                        {getStatusLabel(selectedHistory.status) == "rechazado" ? "Observado" : getStatusLabel(selectedHistory.status)}
                                    </span>
                                </div>
                                {selectedHistory.document_type && selectedHistory.document_type && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-xs text-slate-500 mb-1">Documento</p>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <p className="text-sm font-semibold text-slate-900">
                                                {selectedHistory.document_type}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {hasObservations && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-amber-900 text-sm mb-2">
                                                Descripción:
                                            </h4>
                                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedHistory.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/*
                            {hasImages ? (
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        Capturas de pantalla adjuntas ({selectedHistory.images.length})
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedHistory.images.map((image, idx) => (
                                            <div key={idx} className="group relative">
                                                <div className="aspect-square rounded-lg overflow-hidden bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                                    <img
                                                        src={image}
                                                        alt={`Captura ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                        onClick={() => window.open(image, '_blank')}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-lg">
                                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500 text-sm">No hay capturas adjuntas</p>
                                </div>
                            )}
                            */}
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 flex justify-end">
                        <button
                            onClick={() => setShowHistoryModal(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="h-16 bg-secondary flex items-center px-6">
                <Logo />
            </div>
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Realizar nueva búsqueda
                    </button>
                    <HistoryDetailsModal />

                    <ObservedDocsModal
                        open={showObservedDocsModal}
                        onClose={() => setShowObservedDocsModal(false)}
                        documents={data?.documents ?? []}
                        observedEvent={selectedObservedEvent}
                    />
                    {/*
                    <ImageModal
                        show={showImageModal}
                        images={allImages}
                        currentIndex={currentImageIndex}
                        onClose={closeImageModal}
                        onNext={nextImage}
                        onPrev={prevImage}
                    />
                    */}
                    {showResubmitModal && (
                        <ResubmitModal
                            applicationId={data?.applicationId}
                            projectTitle={data?.projectName}
                            authors={resubmitAuthors}
                            observedDocuments={observedDocsForResubmit}
                            onClose={handleResubmitClose}
                            onSuccess={handleResubmitSuccess}
                        />
                    )}

                    <main className="max-w-5xl mx-auto p-6 md:p-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'estudiante'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                    {activeTab === 'estudiante' ? (
                                        <>
                                            <GraduationCap className="w-4 h-4" />
                                            Tesis de Estudiante
                                        </>
                                    ) : (
                                        <>
                                            <Users className="w-4 h-4" />
                                            Informe de Docente
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                                <div className="flex-1">
                                    <h1 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">
                                        {data.projectName}
                                    </h1>
                                    
                                </div>
                                <div className={`px-4 py-2 rounded-lg ${getStatusColor(uiStatus)} text-sm font-bold border-2 flex items-center gap-2`}>
                                    {getStatusIcon(uiStatus)}
                                    <span className="text-base capitalize">{getStatusLabel(uiStatus)}</span>
                                </div>
                            </div>

                            <ApplicantInfo
                                applicant={data.applicant}
                                authors={tramiteData?.authors ?? tramiteData?.applicant?.authors ?? []}
                                createdAt={data.created_at || data.createdAt}
                                hidePhone={activeTab === "docente"}  
                            />

                        </div>
                        {/* BLOQUE: Autores (compacto y suave) */}
                        {authorNames.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-sm font-semibold text-slate-900">
                                            {authorNames.length > 1 ? "Autores" : "Autor"}
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            {authorNames.length} {authorNames.length === 1 ? "persona" : "personas"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {authorNames.map((name: string, idx: number) => {
                                        const initials = name
                                            .split(" ")
                                            .map((n) => n?.[0])
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase();

                                        return (
                                            <div
                                                key={`${name}-${idx}`}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/60 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
                                                    <span className="text-[11px] font-semibold text-white">
                                                        {initials || "AU"}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500">
                                                        {idx === 0
                                                            ? authorNames.length > 1
                                                                ? "Autor"
                                                                : "Autor "
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">Estado de Documentos</h2>
                                    <p className="text-sm text-slate-600">Revisa el estado de cada documento presentado</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {data.documents.map((doc, index) => (
                                    <DocumentCard
                                        key={index}
                                        doc={doc}
                                        onOpenImage={openImageModal}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='pb-8'>
                            {/*<HistorialTable timeline={tramiteData.timeline} />*/}
                            {/*<RejectionHistorySection rejectionHistory={doc.rejection_history} /> */}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">Constancia</h2>
                                        <p className="text-sm text-slate-600">Estado de tu certificado</p>
                                    </div>
                                </div>
                                <ConstanciaStatus
                                    status={uiStatus}
                                    publicationLink={data.publication_link}
                                    showResubmitButton={hasObservedDocs}
                                    onOpenResubmit={() => setShowResubmitModal(true)}
                                />

                            </div>


                            <GeneralHistorySection

                                history={data.timeline ?? []}
                                onObservedClick={openObservedDocsModalIfObserved}
                            />

                        </div>

                        {/* Información adicional */}
                        <div className="mt-6 bg-blue-50 shadow-sm border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-blue-900 mb-3 text-base">Información importante</p>
                                    <ul className="space-y-2 text-blue-800">

                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold mt-1">•</span>
                                            <span>El tiempo de procesamiento es de 5 días hábiles</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold mt-1">•</span>
                                            <span>Si tiene dudas, puede contactar a la Unidad de Investigación: </span>
                                            <span>repositorio@unamba.edu.pe</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
