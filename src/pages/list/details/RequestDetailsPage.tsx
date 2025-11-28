
import { API_URL } from "@/utils/api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

interface Autor {
  nombres: string;
  apellidos: string;
  dni: string;
  escuela?: string;
  // otros campos si los tienes...
}

interface Documento {
  nombre: string;
  tipo: string;
  tamano: number; // por ejemplo en KB o bytes
  link?: string;  // si devuelves URL para descargar/ver el doc
}

interface SolicitudDetalle {
  solicitud: {
    id: string;
    tipo: string;
    titulo: string;
    estado: string;
    fecha_solicitud: string;
  };
  autor_principal: {
    nombres: string;
    apellidos: string;
    dni: string;
    escuela?: string;
  };
  autores?: Autor[];
  coautores?: Autor[];
  asesores?: Autor[];   // si usas asesores
  jurado?: { nombre: string; rol: string }[]; // si usas jurado
  documentos?: Documento[];
  checkboxes?: {
    acepta_terminos: boolean;
    formato_ajustado: boolean;
    errores_leidos: boolean;
    tramite_informado: boolean;
  };
  // otros campos que tu backend devuelva...
}

export default function RequestDetailsPage() {
  const { id } = useParams();          // lee :id de la URL
  const navigate = useNavigate();

  const [data, setData] = useState<SolicitudDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/applications/details/${id}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          setError(result.message || "Error al cargar los datos");
          setData(null);
        } else {
          setData(result.data as SolicitudDetalle);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="p-6">Cargando detalles...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }
  if (!data) {
    return <div className="p-6 text-gray-500">No hay datos para mostrar.</div>;
  }

  const {
    solicitud,
    autor_principal,
    autores = [],
    coautores = [],
    asesores = [],
    jurado = [],
    documentos = [],
    checkboxes,
  } = data;

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md flex items-center px-6">
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <Shield className="w-6 h-6" />
          UNAMBA - Repositorio Institucional
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        {/* Encabezado de solicitud */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Detalles de Solicitud</h1>
              <p className="text-slate-500 text-sm">Visualización completa del informe enviado</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {new Date(solicitud.fecha_solicitud).toLocaleDateString("es-PE")}
                </span>
              </div>
              <div className="bg-amber-100 px-3 py-2 rounded-lg">
                <span className="text-amber-800 font-semibold text-sm">{solicitud.estado}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones con datos reales */}
        <Section title="Información del Proyecto" icon={BookOpen}>
          <InfoRow label="ID Solicitud" value={solicitud.id} />
          <InfoRow label="Título" value={solicitud.titulo} />
          <InfoRow label="Tipo" value={solicitud.tipo} />
        </Section>

        <Section title="Autor Principal" icon={User}>
          <InfoRow label="Nombres" value={`${autor_principal.nombres} ${autor_principal.apellidos}`} />
          <InfoRow label="DNI" value={autor_principal.dni} />
          <InfoRow label="Escuela" value={autor_principal.escuela || "-"} />
        </Section>

        {autores.length > 0 && (
          <Section title="Autores / Coautores" icon={Users}>
            {autores.map((a, idx) => (
              <div key={idx} className="py-2 border-b last:border-none">
                <InfoRow
                  label={`Autor #${idx + 1}`}
                  value={`${a.nombres} ${a.apellidos} (${a.dni}) – ${a.escuela || ""}`}
                />
              </div>
            ))}
          </Section>
        )}

        {documentos.length > 0 && (
          <Section title="Documentos Adjuntos" icon={FileText}>
            <div className="space-y-3">
              {documentos.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{doc.nombre}</div>
                      <div className="text-xs text-slate-500">
                        {doc.tipo} • {doc.tamano} KB
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {doc.link && (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    {doc.link && (
                      <a
                        href={doc.link}
                        download
                        className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* … otras secciones según tu data ... */}

      </main>
    </div>
  );
}

// Componentes auxiliares
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: (props: any) => JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
      <span className="font-semibold text-slate-600 min-w-[140px] text-sm">
        {label}:
      </span>
      <span className="text-slate-800 flex-1 text-sm">{value}</span>
    </div>
  );
}
