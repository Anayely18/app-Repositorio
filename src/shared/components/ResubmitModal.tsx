import { useState } from 'react';
import {
    Upload,
    X,
    AlertCircle,
    FileText,
    CreditCard,
    BookOpen,
    CheckCircle2,
    XCircle,
    Users
} from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '@/utils/api';

interface Author {
    first_name: string;
    last_name: string;
    dni: string;
}

interface ObservedDocument {
    document_type: string;
    rejection_reason: string;
    images?: string[];
}

interface ResubmitModalProps {
    applicationId: string;
    projectTitle: string;
    authors: Author[];
    observedDocuments: ObservedDocument[];
    onClose: () => void;
    onSuccess: () => void;
}

export function ResubmitModal({
    applicationId,
    projectTitle,
    authors,
    observedDocuments,
    onClose,
    onSuccess
}: ResubmitModalProps) {
    const [files, setFiles] = useState<Record<string, File>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

    const getDocumentLabel = (type: string) => {
        const labels: Record<string, string> = {
            tesis_pdf: 'Tesis completa',
            hoja_autorizacion: 'Hoja de autorización',
            constancia_empastado: 'Constancia de empastado',
            constancia_originalidad: 'Reporte de originalidad'
        };
        return labels[type] || type;
    };

    const handleFileChange = (docType: string, file: File | null) => {
        if (file) {
            // Validar tamaño (máx 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('El archivo no debe superar 10 MB');
                return;
            }

            // Validar extensión
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                toast.error('Solo se permiten archivos PDF');
                return;
            }

            setFiles(prev => ({ ...prev, [docType]: file }));
        } else {
            setFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[docType];
                return newFiles;
            });
        }
    };

    const handleSubmit = async () => {
        // Validar que todos los documentos observados tengan archivo
        const missingDocs = observedDocuments.filter(
            doc => !files[doc.document_type]
        );

        if (missingDocs.length > 0) {
            toast.error(
                `Falta adjuntar: ${missingDocs.map(d => getDocumentLabel(d.document_type)).join(', ')}`
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            for (const [docType, file] of Object.entries(files)) {
                formData.append(docType, file);
            }

            const response = await fetch(
                `${API_URL}/applications/${applicationId}/resubmit`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'Documentos reenviados exitosamente');
                onSuccess();
            } else {
                toast.error(result.message || 'Error al reenviar documentos');
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al reenviar documentos (Demo: API no disponible)');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleDocExpansion = (docType: string) => {
        setExpandedDoc(expandedDoc === docType ? null : docType);
    };

    const allFilesUploaded = observedDocuments.every(
        doc => files[doc.document_type]
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 font-sans text-sm text-slate-700">


                {/* ========== HEADER ========== */}
                <div className="bg-secondary to-indigo-600 px-8 py-6  overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Upload className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">
                                    Corregir Documentos Observados
                                </h2>
                                <p className="text-blue-100 text-sm font-medium">
                                    Se creará una nueva versión de tu solicitud
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-xl p-2.5 transition-all hover:rotate-90 duration-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* ========== CONTENT ========== */}
                <div className="p-8 overflow-y-auto max-h-[calc(95vh-240px)]">

                    {/* ========== INFORMACIÓN DEL PROYECTO ========== */}
                    <div className="bg-gradient-to-br from-slate-0 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-slate-600 mb-2">
                                    PROYECTO DE TESIS
                                </h3>
                                <p className="text-base font-bold text-gray-900 leading-relaxed">
                                    {projectTitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ========== AUTORES ========== */}
                    <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Autores ({authors.length})
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {authors.map((author, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {author.first_name} {author.last_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <CreditCard className="w-3.5 h-3.5" />
                                                DNI: {author.dni}
                                            </div>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                            Autor Principal
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========== ALERTA INFORMATIVA ========== */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    Instrucciones Importantes
                                </h4>
                                <ul className="space-y-2 text-sm text-amber-800">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                                        <span>Debes corregir <strong>TODOS</strong> los documentos marcados como observados</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                                        <span>Se creará una <strong>nueva versión</strong> de tu solicitud (v2)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                                        <span>Los documentos previamente aprobados se mantendrán automáticamente</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                                        <span>Tamaño máximo por archivo: <strong>10 MB</strong></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ========== DOCUMENTOS OBSERVADOS ========== */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                Documentos que requieren corrección ({observedDocuments.length})
                            </h3>
                            <span className="text-sm text-slate-500">
                                {Object.keys(files).length} de {observedDocuments.length} archivos adjuntados
                            </span>
                        </div>

                        {observedDocuments.map((doc, index) => {
                            const hasFile = !!files[doc.document_type];
                            const isExpanded = expandedDoc === doc.document_type;

                            return (
                                <div
                                    key={index}
                                    className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${hasFile
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-red-300 bg-red-50'
                                        }`}
                                >
                                    {/* Header del documento */}
                                    <div
                                        className="p-5 cursor-pointer hover:bg-white/50 transition-colors"
                                        onClick={() => toggleDocExpansion(doc.document_type)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${hasFile ? 'bg-green-500' : 'bg-red-500'
                                                    }`}>
                                                    {hasFile ? (
                                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-base mb-1">
                                                        {getDocumentLabel(doc.document_type)}
                                                    </h4>
                                                    {hasFile ? (
                                                        <p className="text-sm text-green-700 font-medium">
                                                            ✓ {files[doc.document_type].name}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-red-700 font-medium">
                                                            Pendiente de subir
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className={`text-slate-400 hover:text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                    }`}
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido expandible */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top duration-300">
                                            {/* Input de archivo */}
                                            <div className="bg-white rounded-xl p-4">
                                                <label
                                                    htmlFor={`file-${doc.document_type}`}
                                                    className="block text-sm font-semibold text-slate-700 mb-3"
                                                >
                                                    📎 Subir documento corregido: *
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        id={`file-${doc.document_type}`}
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) =>
                                                            handleFileChange(
                                                                doc.document_type,
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor={`file-${doc.document_type}`}
                                                        className={`flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${hasFile
                                                            ? 'border-green-400 bg-green-50 hover:bg-green-100'
                                                            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                                                            }`}
                                                    >
                                                        <Upload className={`w-5 h-5 ${hasFile ? 'text-green-600' : 'text-slate-400'}`} />
                                                        <span className={`font-medium ${hasFile ? 'text-green-700' : 'text-slate-600'}`}>
                                                            {hasFile ? 'Cambiar archivo' : 'Haz clic para seleccionar PDF'}
                                                        </span>
                                                    </label>
                                                </div>

                                                {hasFile && (
                                                    <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm text-green-700 font-medium">
                                                                {files[doc.document_type].name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleFileChange(doc.document_type, null)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}

                                                <p className="text-xs text-slate-500 mt-2">
                                                    Formato: PDF | Tamaño máximo: 10 MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ========== PROGRESO ========== */}
                    <div className="mt-6 bg-slate-50 rounded-2xl p-5 border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-slate-700">
                                Progreso de carga
                            </span>
                            <span className={`text-sm font-bold ${allFilesUploaded ? 'text-green-600' : 'text-slate-500'
                                }`}>
                                {Object.keys(files).length} / {observedDocuments.length}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${allFilesUploaded ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                style={{
                                    width: `${(Object.keys(files).length / observedDocuments.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ========== FOOTER ========== */}
                <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t-2 border-slate-200">
                    <div className="text-sm text-slate-600">
                        {allFilesUploaded ? (
                            <span className="flex items-center gap-2 text-green-600 font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Todos los archivos listos
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Faltan {observedDocuments.length - Object.keys(files).length} documento(s)
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-3 border-2 border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !allFilesUploaded}
                            className="px-8 py-3 bg-secondary text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Enviar Corrección
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}