import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function GeneralHistorySection({
  history = [],
  onObservedClick,
}: {
  history: any[];
  onObservedClick?: (item: any) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const safeDate = (v: any) => {
    if (!v) return null;
    const s = String(v);
    const iso = s.includes(" ") ? s.replace(" ", "T") : s;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const parseBackendDate = (dateString: any) => {
    if (!dateString) return null;

    let s = String(dateString).trim();

    // "2026-01-13 15:02:33.000000" -> "2026-01-13T15:02:33.000000"
    if (s.includes(" ")) s = s.replace(" ", "T");

    // recorta microsegundos a milisegundos (Date solo soporta 3)
    s = s.replace(/(\.\d{3})\d+/, "$1");

    // si no trae zona (Z o +hh:mm), asumimos que viene en UTC (típico en servers)
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


  const normalizeStatus = (status: any) => String(status ?? "").toLowerCase();

  const getStatusColor = (status: any) => {
    const s = normalizeStatus(status);
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      en_revision: "bg-blue-100 text-blue-800 border-blue-200",
      aprobado: "bg-green-100 text-green-800 border-green-200",
      observado: "bg-red-100 text-red-800 border-red-200",
      requiere_correccion: "bg-orange-100 text-orange-800 border-orange-200",
      publicado: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[s] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: any) => {
    const s = normalizeStatus(status);
    if (s === "aprobado" || s === "validado") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (s === "observado" || s === "rechazado") return <XCircle className="w-4 h-4 text-red-600" />;
    if (s === "publicado") return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const getStatusLabel = (status: any) => {
    const s = normalizeStatus(status);
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      en_revision: "En revisión",
      aprobado: "Aprobado",
      observado: "Observado",
      requiere_correccion: "Requiere correcciones",
      publicado: "Publicado",
      rechazado: "Observado",
    };
    return labels[s] || String(status ?? "Estado");
  };

  // ✅ soporta ambos formatos:
  // RequestDetails: new_status, change_date, admin_name, history_id, document_type
  // TramiteDetails: status, date, etc.
  const getNewStatus = (item: any) => item?.new_status ?? item?.status;
  const getPrevStatus = (item: any) => item?.previous_status ?? item?.prev_status;
  const getChangeDate = (item: any) => item?.change_date ?? item?.date ?? item?.created_at;

  const getDocType = (item: any) => item?.document_type ?? item?.documentType;

  const generalHistory = (history || []).filter((item) => {
    const dt = getDocType(item);
    return !dt; // solo cambios generales
  });

  const sortedHistory = [...generalHistory].sort((a, b) => {
    const da = safeDate(getChangeDate(a))?.getTime() ?? 0;
    const db = safeDate(getChangeDate(b))?.getTime() ?? 0;
    return db - da;
  });

  const visibleHistory = showAll ? sortedHistory : sortedHistory.slice(0, 3);
  const hasMore = sortedHistory.length > 3;

  if (sortedHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lgorder border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historial</h2>
            <p className="text-sm text-slate-600">Cambios de estado del trámite</p>
          </div>
        </div>

        <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
          <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay historial de cambios</p>
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
          <h2 className="text-lg font-bold text-slate-900">Historial de Estados</h2>
          <p className="text-sm text-slate-600">
            {sortedHistory.length} {sortedHistory.length === 1 ? "cambio registrado" : "cambios registrados"}
          </p>
        </div>
      </div>

      {/* ✅ Zona scrolleable */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto pr-2 space-y-4">
          {visibleHistory.map((item, index) => {
            const ns = getNewStatus(item);
            const ps = getPrevStatus(item);
            const cd = getChangeDate(item);
            const isObserved = normalizeStatus(ns) === "observado";
            const key = item?.history_id ?? item?.id ?? `${cd}-${index}`;

            return (
              <div key={key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-4 shadow-sm ${normalizeStatus(ns) === "aprobado"
                      ? "bg-green-600 border-green-100"
                      : normalizeStatus(ns) === "observado"
                        ? "bg-red-600 border-red-100"
                        : normalizeStatus(ns) === "publicado"
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
                        {getStatusIcon(ns)}
                        <p className="text-sm font-semibold text-slate-900">{getStatusLabel(ns)}</p>
                      </div>
                    </div>

                    {ps && normalizeStatus(ps) !== normalizeStatus(ns) && (
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className={`px-2 py-1 rounded ${getStatusColor(ps)}`}>{getStatusLabel(ps)}</span>
                        <span className="text-slate-400">→</span>
                        <span className={`px-2 py-1 rounded ${getStatusColor(ns)}`}>{getStatusLabel(ns)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="font-mono whitespace-nowrap">
                          {formatDate(cd)}
                        </span>
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

      {/* Footer fijo */}
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
              Ver {sortedHistory.length - 3} cambios más <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );

}