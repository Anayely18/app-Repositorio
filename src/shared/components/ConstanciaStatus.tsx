import { AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";

interface ConstanciaStatusProps {
  status: string;
  publicationLink?: string;
  onOpenResubmit?: () => void;
  showResubmitButton?: boolean;
}

export function ConstanciaStatus({
  status,
  publicationLink,
  onOpenResubmit,
  showResubmitButton,
}: ConstanciaStatusProps) {
  const s = String(status ?? "").toLowerCase();

  // 1) Pendiente / En revisión
  if (s === "pendiente" || s === "en_revision" || s === "pendiente_de_revision") {
    const isReviewing = s === "en_revision";
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center shrink-0">
            {isReviewing ? (
              <RefreshCw className="w-6 h-6 text-white" />
            ) : (
              <Clock className="w-6 h-6 text-white" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold text-yellow-900 mb-2">
              {isReviewing ? "En revisión" : "Pendiente de revisión"}
            </h3>
            <p className="text-yellow-800 text-sm">
              Tu trámite está en cola para ser revisado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2) Observado / Requiere corrección
  if (s === "requiere_correccion" || s === "observado" || s === "rechazado") {
    return (
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-900 mb-2">Acción requerida</h3>
            <p className="text-orange-800 mb-2 text-sm">
              Tu trámite requiere correcciones antes de poder generar la constancia.
            </p>
            <p className="text-sm text-orange-700 leading-relaxed">
              Revisa las observaciones y reenvía los archivos corregidos.
            </p>

            {showResubmitButton && onOpenResubmit && (
              <button
                type="button"
                onClick={onOpenResubmit}
                className="mt-2 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-orange-500 hover:bg-orange-700 text-white transition-colors shadow-sm"
              >
                Levantar documentos observados
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3) Aprobado (pero aún no publicado)
  if (s === "aprobado") {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-900 mb-2">Aprobado</h3>
            <p className="text-green-800 text-sm">
              Tus documentos fueron aprobados. La constancia se generará/publicará según el flujo del sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4) Publicado (solo aquí)
  if (s === "publicado") {
    return (
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">¡Publicado!</h3>
            <p className="text-purple-800 mb-2 text-sm">Tu trámite ya ha sido publicado en el repositorio.</p>

            {publicationLink ? (
              <a
                href={publicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800 hover:underline wrap-break-word"
              >
                {publicationLink}
              </a>
            ) : (
              <p className="text-sm text-slate-600 italic mt-2">Enlace no disponible.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 5) Fallback seguro
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
      <p className="text-slate-700 text-sm">
        Estado de constancia: <b>{status || "desconocido"}</b>
      </p>
    </div>
  );
}
