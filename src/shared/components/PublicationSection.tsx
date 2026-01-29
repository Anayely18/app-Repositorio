import { useEffect, useState } from "react";
import { Link as LinkIcon, Save } from "lucide-react";
import { toast } from "sonner";

interface PublicationSectionProps {
  applicationId: string;
  initialLink?: string | null; // 👈 acepta null también
  onSave?: (link: string) => void;
}

export default function PublicationSection({
  applicationId,
  initialLink,
  onSave,
}: PublicationSectionProps) {
  const safeInitialLink = (initialLink ?? ""); // 👈 convierte null/undefined a ""
  const [link, setLink] = useState<string>(safeInitialLink);
  const [isLoading, setIsLoading] = useState(false);

  // 👇 por si initialLink cambia luego (por fetch)
  useEffect(() => {
    setLink(safeInitialLink);
  }, [safeInitialLink]);

  const handleSave = async () => {
    const cleaned = (link ?? "").trim(); // 👈 blindaje extra

    if (!cleaned) {
      toast.error("Por favor ingresa un enlace válido");
      return;
    }

    try {
      new URL(cleaned);
    } catch {
      toast.error("El enlace ingresado no es válido");
      return;
    }

    setIsLoading(true);
    try {
      if (onSave) await onSave(cleaned);
      toast.success("Enlace de publicación guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar el enlace de publicación");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = (link ?? "").trim().length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <LinkIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Publicación</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="publication-link" className="text-sm font-semibold text-slate-700">
            Enlace de publicación en el repositorio
          </label>
          <input
            id="publication-link"
            type="url"
            value={link ?? ""}   
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://repositorio.unamba.edu.pe/handle/..."
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
            disabled={isLoading}
          />
          <p className="text-xs text-slate-500">Ingresa el enlace permanente del documento publicado</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || !isValid}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Guardando..." : "Guardar enlace"}
        </button>

        {!!safeInitialLink && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-3">Enlace actual:</p>
            <a
              href={safeInitialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              {safeInitialLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
