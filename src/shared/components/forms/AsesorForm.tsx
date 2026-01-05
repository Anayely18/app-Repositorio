import { useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, FileText, User, Trash2 } from "lucide-react";
import { FormInput } from "./FormInput";
import { API_URL } from "@/utils/api";

interface AdvisorData {
  nombre?: string;
  apellido?: string;
  dni?: string;
  orcid?: string;
  invalid?: boolean;
}

interface AsesorFormProps {
  number: number;
  onRemove: () => void;
  canRemove: boolean;
  data: AdvisorData;
  onChange: (data: AdvisorData) => void;

  // opcional: el padre lo pone true al intentar enviar
  showValidation?: boolean;
}

type FieldKey = "dni" | "nombre" | "apellido" | "orcid";

export function AsesorForm({
  number,
  onRemove,
  canRemove,
  data = {},
  onChange,
  showValidation = false,
}: AsesorFormProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string>("");

  const lastDniRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    dni: false,
    nombre: false,
    apellido: false,
    orcid: false,
  });

  const touch = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k: FieldKey) => showValidation || touched[k];

  const cleanDigits = (v: string) => v.replace(/\D/g, "").slice(0, 8);

  const pickName = (payload: any) => {
    const p = payload?.data ?? payload;
    const nombre =
      p?.nombres ?? p?.nombre ?? p?.name ?? p?.first_name ?? p?.firstName ?? "";
    const apellido =
      p?.apellidos ?? p?.apellido ?? p?.surname ?? p?.last_name ?? p?.lastName ?? "";
    const full = p?.full_name ?? p?.fullName ?? "";
    return { nombre, apellido, full };
  };

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    const dni = (data.dni ?? "").trim();
    const nombre = (data.nombre ?? "").trim();
    const apellido = (data.apellido ?? "").trim();
    const orcid = (data.orcid ?? "").trim();

    // DNI: requerido + 8 dígitos + error de lookup (si ya está completo)
    if (!dni) e.dni = "El DNI es obligatorio.";
    else if (!/^\d{8}$/.test(dni)) e.dni = "El DNI debe tener 8 dígitos.";
    else if (!isLookingUp && lookupError) e.dni = lookupError;

    // Nombre / Apellido: requeridos
    if (!nombre) e.nombre = "Los nombres son obligatorios.";
    else if (nombre.length < 2) e.nombre = "Escribe al menos 2 caracteres.";

    if (!apellido) e.apellido = "Los apellidos son obligatorios.";
    else if (apellido.length < 2) e.apellido = "Escribe al menos 2 caracteres.";

    // ORCID: opcional (acepta ID o URL)
    if (orcid) {
      const re = /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/i;
      if (!re.test(orcid)) e.orcid = "ORCID no válido. Ej: 0000-0000-0000-0000";
    }

    return e;
  }, [data.dni, data.nombre, data.apellido, data.orcid, lookupError, isLookingUp]);

  const isInvalid = (k: FieldKey) => !!errors[k] && showErr(k);

  useEffect(() => {
    const dni = cleanDigits(data.dni ?? "");

    // si no está completo, no busques
    if (dni.length !== 8) {
      setLookupError("");
      lastDniRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // evita volver a consultar el mismo dni
    if (dni === lastDniRef.current) return;

    // debounce
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        setLookupError("");
        setIsLookingUp(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const LOOKUP_URL = `${API_URL}/personas/dni/${dni}`;

        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "No se encontró el DNI");
        }

        const { nombre, apellido, full } = pickName(json);

        let finalNombre = String(nombre ?? "").trim();
        let finalApellido = String(apellido ?? "").trim();

        if ((!finalNombre || !finalApellido) && full) {
          const parts = String(full).trim().split(/\s+/);
          if (parts.length >= 2) {
            finalApellido = parts.slice(-2).join(" ");
            finalNombre = parts.slice(0, -2).join(" ");
          } else {
            finalNombre = full;
          }
        }

        if (!finalNombre && !finalApellido) {
          throw new Error("El servicio no devolvió nombres/apellidos");
        }

        lastDniRef.current = dni;

        onChange({
          ...data,
          dni,
          nombre: finalNombre || data.nombre || "",
          apellido: finalApellido || data.apellido || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setLookupError(err?.message || "Error consultando DNI");
      } finally {
        setIsLookingUp(false);
      }
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [data.dni]); // solo cuando cambia el dni

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Asesores {number}
        </h4>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DNI + estado */}
        <div className="space-y-1">
          <FormInput
            icon={CreditCard}
            label="Número de DNI"
            sublabel="Documento de identificación"
            type="text"
            placeholder="78345758"
            maxLength={8}
            value={data.dni || ""}
            onChange={(e) => {
              const dni = cleanDigits(e.target.value);
              setLookupError("");
              onChange({ ...data, dni });
            }}
              onBlur={() => touch("dni")}
              invalid={isInvalid("dni")}
          />

          {isLookingUp && <p className="text-xs text-slate-500">Buscando datos del DNI...</p>}

          {!isLookingUp && isInvalid("dni") && (
            <p className="text-xs text-red-600">{errors.dni}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="nombres"
            sublabel="(En mayúsculas y minúsculas según corresponda)"
            type="text"
            placeholder="Ejem: Gustavo"
            value={data.nombre || ""}
            onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            onBlur={() => touch("nombre")}
            invalid={isInvalid("nombre")}
          />
          {isInvalid("nombre") && <p className="text-xs text-red-600">{errors.nombre}</p>}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="apellidos"
            sublabel="(En mayúsculas y minúsculas según corresponda)"
            type="text"
            placeholder="Robles Rojas"
            value={data.apellido || ""}
            onChange={(e) => onChange({ ...data, apellido: e.target.value })}
            onBlur={() => touch("apellido")}
            invalid={isInvalid("apellido")}
          />
          {isInvalid("apellido") && (
            <p className="text-xs text-red-600">{errors.apellido}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={FileText}
            label="Url de ORCID"
            sublabel="Ingrese correctamente"
            type="text"
            placeholder="0000-0000-0000-0000"
            value={data.orcid || ""}
            onChange={(e) => onChange({ ...data, orcid: e.target.value })}
            onBlur={() => touch("orcid")}
            invalid={isInvalid("orcid")}
          />
          {isInvalid("orcid") && <p className="text-xs text-red-600">{errors.orcid}</p>}
        </div>
      </div>
    </div>
  );
}
