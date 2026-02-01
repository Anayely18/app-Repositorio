import { AlertCircle, CheckCircle2, Clock, FileText, ImageIcon, XCircle, ZoomIn } from "lucide-react";

export function DocumentCard({ doc, onOpenImage }) {
    const getStatusColor = (status) => {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            en_revision: 'bg-blue-100 text-blue-800 border-blue-200',
            validado: 'bg-green-100 text-green-800 border-green-200',
            aprobado: 'bg-green-100 text-green-800 border-green-200',
            observado: 'bg-red-100 text-red-800 border-red-200',
            rechazado: 'bg-red-100 text-red-800 border-red-200',
            requiere_correccion: 'bg-orange-100 text-orange-800 border-orange-200',
            publicado: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'aprobado':
            case 'validado':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'observado':
            case 'rechazado':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'en_revision':
                return <Clock className="w-5 h-5 text-blue-600" />;
            case 'requiere_correccion':
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            case 'publicado':
                return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pendiente: 'Pendiente de revisión',
            en_revision: 'En revisión',
            aprobado: 'Aprobado',
            validado: 'Validado',
            observado: 'Observado',
            rechazado: 'Rechazado',
            requiere_correccion: 'Requiere correcciones',
            publicado: 'Publicado'
        };
        return labels[status] || status;
    };

    const shouldShowObservations = doc.status === 'observado' ||
        doc.status === 'rechazado' ||
        doc.status === 'requiere_correccion';

    return (
        <div className="border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <h3 className="font-medium text-slate-900">{doc.document_type}</h3>
                </div>
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 flex items-center gap-2 ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    {getStatusLabel(doc.status) == "Rechazado" ? "Observado" : getStatusLabel(doc.status)}
                </span>
            </div>

            {shouldShowObservations && doc.observation && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-orange-900 mb-2">Observación del administrador:</p>
                            <p className="text-sm text-orange-800 leading-relaxed whitespace-pre-wrap break-words">
                                {doc.observation}
                            </p>
                        </div>
                    </div>
                    {/*
                    {doc.images && doc.images.length > 0 && (
                        <div className="border-t-2 border-orange-200 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <ImageIcon className="w-5 h-5 text-orange-700" />
                                <p className="text-sm font-bold text-orange-900">
                                    Evidencia adjunta ({doc.images.length} {doc.images.length === 1 ? 'imagen' : 'imágenes'})
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {doc.images.map((img, imgIndex) => (
                                    <div
                                        key={imgIndex}
                                        className="relative group cursor-pointer aspect-square"
                                        onClick={() => onOpenImage(doc.images, imgIndex)}
                                    >
                                        <div className="w-full h-full rounded-lg overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all shadow-sm hover:shadow-md">
                                            <img
                                                src={img}
                                                alt={`Evidencia ${imgIndex + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                            <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                <ZoomIn className="w-5 h-5 text-slate-800" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1.5 right-1.5 bg-black/70 bg-opacity-70 text-white text-xs px-2 py-0.5 rounded font-mono">
                                            {imgIndex + 1}/{doc.images.length}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-orange-700 mt-3 flex items-center gap-1.5">
                                <ZoomIn className="w-3.5 h-3.5" />
                                Haz clic en las imágenes para ampliarlas
                            </p>
                        </div>
                    )}
                    */}
                </div>
            )}

            {(doc.status === 'validado' || doc.status === 'aprobado') && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-semibold">
                            Documento aprobado sin observaciones
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
