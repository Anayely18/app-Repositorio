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
  const [flashCodeError, setFlashCodeError] = useState<string>("");
  const flashTimerRef = useRef<number | null>(null);

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

  const flashError = (msg: string) => {
    setFlashCodeError( "DNI no encontrado, completa tus datos manualmente.");
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setFlashCodeError("");
    }, 10000);
  };


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


    // Nombre / Apellido: requeridos
    if (!nombre) e.nombre = "Los nombres son obligatorios.";
    else if (nombre.length < 2) e.nombre = "Escribe al menos 2 caracteres.";

    if (!apellido) e.apellido = "Los apellidos son obligatorios.";
    else if (apellido.length < 2) e.apellido = "Escribe al menos 2 caracteres.";

    //orcid: requerido + formato básico
    const re = /^https?:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/i;
    if (!orcid) e.orcid = "El ORCID es obligatorio.";
    else if (!re.test(orcid)) e.orcid = "ORCID no válido. Ej: https://orcid.org/0000-0000-0000-0000";

    return e;
  }, [data.dni, data.nombre, data.apellido, data.orcid, isLookingUp]);

  const isInvalid = (k: FieldKey) => !!errors[k] && showErr(k);
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const dni = cleanDigits(data.dni ?? "");

    // si no está completo, no busques
    if (dni.length !== 8) {
      setFlashCodeError("");
      lastDniRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    if (dni === lastDniRef.current) return;

    
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {

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

        const msg =
          "DNI no encontrado,complete nombres y apellidos manualmente.";

        flashError(msg);

        onChange({
          ...data,
          dni,           
          nombre: "",
          apellido: "",
          orcid: "",
        });

        lastDniRef.current = dni;
      } finally {
        setIsLookingUp(false);
      }
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [data.dni]); 

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

              if (abortRef.current) abortRef.current.abort();
              if (timerRef.current) window.clearTimeout(timerRef.current);

              lastDniRef.current = "";

              setFlashCodeError("");

              onChange({
                ...data,
                dni,
                nombre: "",
                apellido: "",
                orcid: "",
              });
            }}

            onBlur={() => touch("dni")}
          />
          <p
            className={`text-xs min-h-[16px] ${flashCodeError ? "text-amber-700" : "text-red-600"
              }`}
          >
            {!isLookingUp ? (flashCodeError || (isInvalid("dni") ? errors.dni : "")) : ""}
          </p>
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
            required
            placeholder="0000-0000-0000-0000"
            value={data.orcid || ""}
            onChange={(e) => onChange({ ...data, orcid: e.target.value })}
            onBlur={() => touch("orcid")}
          />
          <p className="text-xs text-red-600 min-h-[16px]">{isInvalid("orcid") ? errors.orcid : ""}</p>
        </div>
      </div>
    </div>
  );
}
