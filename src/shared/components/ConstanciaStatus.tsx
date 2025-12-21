import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ConstanciaStatusProps {
    status: string;
    publicationLink?: string;
}

export function ConstanciaStatus({ status, publicationLink }: ConstanciaStatusProps) {
    if (status === 'aprobado') {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-green-900 mb-2">
                            ¡En proceso!
                        </h3>
                        <p className="text-green-800 mb-4 text-sm">
                            Su trámite está siendo generado
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'requiere_correccion' || status === 'bservado') {
        return (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-orange-900 mb-2">
                            Acción Requerida
                        </h3>
                        <p className="text-orange-800 mb-2 text-sm">
                            Su trámite requiere correcciones antes de poder generar la constancia.
                        </p>
                        <p className="text-sm text-orange-700 leading-relaxed">
                            Revise las observaciones en cada documento y envie los archivos corregidos nuevamente por el formulario.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-s text-blue-900 leading-relaxed mb-2">
                        ¡Publicado!
                    </h3>
                    <p className="text-blue-800 mb-2 text-sm">
                        Su trámite ya ha sido publicado en el repositorio.
                    </p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Ingrese al siguiente link para ver la publicación:
                    </p>

                    {publicationLink ? (
                        <a
                            href={publicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline wrap-break-word"
                        >
                            {publicationLink}
                        </a>
                    ) : (
                        <p className="text-sm text-slate-600 italic mt-2">
                            Enlace no disponible.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

}
