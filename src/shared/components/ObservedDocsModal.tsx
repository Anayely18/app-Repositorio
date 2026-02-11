import { AlertCircle, Download, Eye, FileText, ImageIcon } from "lucide-react";
import { API_URL_DOCUMENTS } from "@/utils/api";

export function ObservedDocsModal({
    open,
    onClose,
    documents = [],
    observedEvent,
}: {
    open: boolean;
    onClose: () => void;
    documents: any[];
    observedEvent: any;
}) {
    if (!open) return null;

    const getDocumentTypeLabel = (type: string) => {
        const map: Record<string, string> = {
            tesis_pdf: "Tesis completa",
            hoja_autorizacion: "Hoja de autorización",
            constancia_empastado: "Constancia de empastado",
            constancia_originalidad: "Reporte de originalidad",
        };
        return map[type] || type || "Documento";
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


    const parseSafeDate = (value: any) => {
        if (!value) return null;
        const s = String(value);
        const safe = s.includes(" ") ? s.replace(" ", "T") : s;
        const d = new Date(safe);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const findClosestObservation = (rejectionHistory: any[], targetDate: Date, maxMinutes = 10) => {
        if (!Array.isArray(rejectionHistory) || rejectionHistory.length === 0) return null;

        const maxMs = maxMinutes * 60 * 1000;
        let best: any = null;
        let bestDiff = Infinity;

        for (const r of rejectionHistory) {
            const d = parseSafeDate(r.rejected_at);
            if (!d) continue;

            const diff = Math.abs(d.getTime() - targetDate.getTime());
            if (diff < bestDiff) {
                bestDiff = diff;
                best = r;
            }
        }
        return bestDiff <= maxMs ? best : null;
    };

    const getDocumentUrl = (filePath: string) => {
        if (!filePath) return "";
        if (filePath.startsWith("http")) return filePath;
        return `${API_URL_DOCUMENTS}/${filePath}`;
    };

    const eventDate = parseSafeDate(observedEvent?.change_date ?? observedEvent?.date);
    const rejectedDocs = (documents || [])
        .map((doc: any) => {
            if (!eventDate) return null;
            const obs = findClosestObservation(doc.rejection_history || [], eventDate, 10);
            if (!obs) return null;
            return { ...doc, _obsMoment: obs };
        })
        .filter(Boolean);


    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-secondary px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Documentos con Observaciones</h2>
                            <p className="text-red-100 text-sm">
                                {rejectedDocs.length} {rejectedDocs.length === 1 ? "documento" : "documentos"} con observaciones
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {rejectedDocs.length > 0 ? (
                        <div className="space-y-6">
                            {rejectedDocs.map((doc: any) => {
                                const docType = doc.document_type ?? doc.name ?? "";
                                const docFileName = doc.file_name ?? doc.original_name ?? doc.name ?? "Documento";
                                const docFilePath = doc.file_path ?? doc.path ?? doc.url ?? "";
                                
                                // ✅ Obtener imágenes del momento de observación O del documento
                                const images = doc._obsMoment?.images || doc.images || [];
                                
                                return (
                                    <div key={doc.document_id ?? doc.file_name} className="border border-red-200 rounded-xl overflow-hidden bg-red-50">
                                        <div className="bg-white border-b border-red-200 px-5 py-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText className="w-6 h-6 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 text-lg">
                                                            {getDocumentTypeLabel(docType)}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mt-1">{docFileName}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            {doc.size_kb != null && (
                                                                <span className="text-xs text-slate-500">📦 {doc.size_kb} KB</span>
                                                            )}
                                                            {doc.upload_date && (
                                                                <span className="text-xs text-slate-500">📅 {formatDate(doc.upload_date)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                    Observado
                                                </span>
                                            </div>
                                        </div>

                                        <div className="px-5 py-4">
                                            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-red-900 text-sm mb-3">
                                                            Observaciones
                                                        </h4>

                                                        {doc._obsMoment ? (
                                                            <div className="bg-white rounded-lg p-3 border border-red-200">
                                                                <div className="text-xs text-slate-500 mb-1">
                                                                    {formatDate(doc._obsMoment.rejected_at)}
                                                                </div>
                                                                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                                                                    {doc._obsMoment.rejection_reason || doc._obsMoment.observation || doc._obsMoment.reason || "Sin observación"}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-slate-500 text-sm">Sin observación para este cambio</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ✅ SECCIÓN DE IMÁGENES - Mejorada para manejar tanto strings como objetos */}
                                        {Array.isArray(images) && images.length > 0 && (
                                            <div className="px-5 pb-4">
                                                <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4 text-slate-600" />
                                                    Capturas de pantalla ({images.length})
                                                </h4>

                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {images.map((img: any, idx: number) => {
                                                        // ✅ Determinar si es string u objeto
                                                        const isString = typeof img === "string";
                                                        
                                                        // ✅ Construir URL correctamente
                                                        let imageUrl = '';
                                                        if (isString) {
                                                            // Si es string y ya es URL completa
                                                            if (img.startsWith('http://') || img.startsWith('https://')) {
                                                                imageUrl = img;
                                                            } else {
                                                                // Si es string pero ruta relativa
                                                                imageUrl = `${API_URL_DOCUMENTS}/${img}`;
                                                            }
                                                        } else {
                                                            // Si es objeto
                                                            const path = img?.image_path || img?.path || img?.url || '';
                                                            if (path.startsWith('http://') || path.startsWith('https://')) {
                                                                imageUrl = path;
                                                            } else {
                                                                imageUrl = `${API_URL_DOCUMENTS}/${path}`;
                                                            }
                                                        }
                                                        
                                                        // ✅ Obtener nombre de archivo
                                                        const fileName = isString 
                                                            ? imageUrl.split('/').pop() || `captura-${idx + 1}.png`
                                                            : (img?.file_name || img?.name || `captura-${idx + 1}.png`);
                                                        
                                                        console.log(`🖼️ Imagen ${idx}:`, {
                                                            tipo: isString ? 'string' : 'objeto',
                                                            original: img,
                                                            url: imageUrl,
                                                            fileName
                                                        });
                                                        
                                                        if (!imageUrl) {
                                                            console.warn('⚠️ URL vacía para imagen:', img);
                                                            return null;
                                                        }
                                                        
                                                        return (
                                                            <div key={img?.image_id ?? `${imageUrl}-${idx}`} className="group relative">
                                                                <div className="aspect-square rounded-lg overflow-hidden bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={fileName}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                        onClick={() => window.open(imageUrl, "_blank")}
                                                                        onError={(e) => {
                                                                            console.error('❌ Error cargando imagen:', imageUrl);
                                                                            console.error('❌ Datos originales:', img);
                                                                            // Mostrar placeholder en caso de error
                                                                            const target = e.currentTarget;
                                                                            target.style.display = 'none';
                                                                            const parent = target.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-red-50"><span class="text-xs text-red-600 mb-1">Error</span><span class="text-[10px] text-red-400">No se pudo cargar</span></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-slate-600 mt-1 truncate" title={fileName}>
                                                                    {fileName}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/*
                                        <div className="px-5 pb-4 flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const url = getDocumentUrl(docFilePath);
                                                    if (!url) {
                                                        console.warn('⚠️ No hay URL de documento');
                                                        return;
                                                    }
                                                    window.open(url, "_blank");
                                                }}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver Documento
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const url = getDocumentUrl(docFilePath);
                                                    if (!url) {
                                                        console.warn('⚠️ No hay URL de documento para descargar');
                                                        return;
                                                    }

                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.download = docFileName || "documento.pdf";
                                                    link.target = "_blank";
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
                                        */}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                ✓
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                No se encontraron documentos observados para ese momento
                            </h3>
                            <p className="text-slate-600">
                                Revisa que tus documentos incluyan <b>rejection_history</b>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
