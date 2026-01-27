import { useEffect, useMemo, useRef, useState } from "react";
import { FormInput } from "./FormInput";
import { User, CreditCard, FileText, Building2, Trash2 } from "lucide-react";
import { FormSelect } from "./FormSelect";
import { API_URL } from "@/utils/api";

interface TeacherData {
  nombres?: string;
  apellidos?: string;

  // ✅ DNI solo para lookup (no necesariamente se envía al backend)
  dni?: string;

  orcid?: string;
  escuela?: string;
}

interface AddTeacherFormProps {
  number: number;
  canRemove: boolean;
  onRemove: () => void;
  data: TeacherData;
  onChange: (data: TeacherData) => void;

  // ✅ si ya lo usas, lo respetamos
  realTimeErrors?: { nombres?: string; apellidos?: string; dni?: string; orcid?: string; escuela?: string };
  onRealTimeErrorChange?: (field: "nombres" | "apellidos" | "dni" | "orcid" | "escuela", value: string) => void;

  // ✅ nuevo: el padre lo pone true al intentar enviar
  showValidation?: boolean;
}

type FieldKey = "dni" | "nombres" | "apellidos" | "orcid" | "escuela";

export function AddTeacherForm({
  number,
  canRemove,
  onRemove,
  data = {},
  onChange,
  realTimeErrors,
  onRealTimeErrorChange,
  showValidation = false,
}: AddTeacherFormProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [flashLookupWarning, setFlashLookupWarning] = useState("");
  const flashLookupTimerRef = useRef<number | null>(null)
  const lastDniRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    dni: false,
    nombres: false,
    apellidos: false,
    orcid: false,
    escuela: false,
  });

  const flashWarning = (msg: string) => {
    setFlashLookupWarning(msg);
    if (flashLookupTimerRef.current) window.clearTimeout(flashLookupTimerRef.current);
    flashLookupTimerRef.current = window.setTimeout(() => setFlashLookupWarning(""), 20000);
  };
  const touch = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k: FieldKey) => showValidation || touched[k];

  const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);

  const pickNames = (payload: any) => {
    const p = payload?.data ?? payload;
    const nombres = p?.nombres ?? p?.nombre ?? p?.name ?? p?.first_name ?? p?.firstName ?? "";
    const apellidos = p?.apellidos ?? p?.apellido ?? p?.surname ?? p?.last_name ?? p?.lastName ?? "";
    const full = p?.full_name ?? p?.fullName ?? "";
    return { nombres, apellidos, full };
  };

  const isValidOrcid = (v: string) => {
    const s = String(v ?? "").trim();
    if (!s) return false; // en tu UI está required
    const re = /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/i;
    return re.test(s);
  };

  // ✅ errores “formales” (además de realTimeErrors)
  const computedErrors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    const dni = String(data.dni ?? "").trim();
    const nombres = String(data.nombres ?? "").trim();
    const apellidos = String(data.apellidos ?? "").trim();
    const orcid = String(data.orcid ?? "").trim();
    const escuela = String(data.escuela ?? "").trim();

    // DNI opcional: solo valida formato si lo escribieron
    // ✅ DNI requerido + 8 dígitos
    if (!dni) e.dni = "El DNI es obligatorio.";
    else if (!/^\d{8}$/.test(dni)) e.dni = "El DNI debe tener 8 dígitos.";


    if (!nombres) e.nombres = "Los nombres son obligatorios.";
    else if (nombres.length < 2) e.nombres = "Escribe al menos 2 caracteres.";

    if (!apellidos) e.apellidos = "Los apellidos son obligatorios.";
    else if (apellidos.length < 2) e.apellidos = "Escribe al menos 2 caracteres.";

    if (!orcid) e.orcid = "El ORCID es obligatorio.";
    else if (!isValidOrcid(orcid)) e.orcid = "ORCID no válido (ej: 0000-0000-0000-0000).";

    if (!escuela) e.escuela = "Selecciona una escuela profesional.";

    return e;
  }, [data.dni, data.nombres, data.apellidos, data.orcid, data.escuela, isLookingUp]);


  // ✅ error final por campo (prioridad: realtime > computed)
  const fieldError = (k: FieldKey) => {
    const rt = realTimeErrors?.[k];
    if (rt) return rt;
    if (!showErr(k)) return "";
    return computedErrors[k] ?? "";
  };

  const isInvalid = (k: FieldKey) => !!fieldError(k);
  useEffect(() => {
    return () => {
      if (flashLookupTimerRef.current) window.clearTimeout(flashLookupTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const dni = onlyDigits(data.dni ?? "", 8);

    // si no está completo, no consultes
    if (dni.length !== 8) {
      setFlashLookupWarning("");
      lastDniRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // evita repetir el mismo DNI
    if (dni === lastDniRef.current) return;

    // debounce
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        setFlashLookupWarning("");
        setIsLookingUp(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const LOOKUP_URL = `${API_URL}/personas/dni/${dni}`;

        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "DNI no encontrado, agregue los datos manualmente");
        }

        const { nombres, apellidos, full } = pickNames(json);

        let finalNombres = String(nombres ?? "").trim();
        let finalApellidos = String(apellidos ?? "").trim();

        // fallback si solo viene "full_name"
        if ((!finalNombres || !finalApellidos) && full) {
          const parts = String(full).trim().split(/\s+/);
          if (parts.length >= 2) {
            finalApellidos = parts.slice(-2).join(" ");
            finalNombres = parts.slice(0, -2).join(" ");
          } else {
            finalNombres = full;
          }
        }

        if (!finalNombres && !finalApellidos) {
          throw new Error("El servicio no devolvió nombres/apellidos");
        }

        lastDniRef.current = dni;

        // limpia errores realtime si usas esa estrategia
        onRealTimeErrorChange?.("dni", "");
        onRealTimeErrorChange?.("nombres", "");
        onRealTimeErrorChange?.("apellidos", "");
        setFlashLookupWarning("");
        onChange({
          ...data,
          dni,
          nombres: finalNombres || data.nombres || "",
          apellidos: finalApellidos || data.apellidos || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;

        flashWarning("DNI no encontrado. Completa nombres y apellidos manualmente.");

        onChange({
          ...data,
          dni,
          nombres: "",
          apellidos: "",
          orcid: "",
          escuela: "",
        });
        // ✅ opcional: evita reconsultar el mismo DNI inexistente
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
    <div className="border-2 border-gray-200 rounded-xl p-6 flex flex-col gap-y-6 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Docente {number}
        </h4>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
            Quitar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ DNI (lookup) */}
        <div className="space-y-1">
          <FormInput
            icon={CreditCard}
            label="Número de DNI"
            sublabel="Escriba 8 dígitos para autocompletar"
            type="text"
            placeholder="12345678"
            maxLength={8}
            value={data.dni || ""}
            onChange={(e) => {
              const raw = e.target.value;
              const dni = onlyDigits(raw, 8);
              const hasLetters = /[a-zA-Z]/.test(raw);

              // ✅ cortar búsqueda anterior y timers
              if (abortRef.current) abortRef.current.abort();
              if (timerRef.current) window.clearTimeout(timerRef.current);

              // ✅ permitir buscar el nuevo DNI
              lastDniRef.current = "";

              // ✅ borrar warning viejo
              setFlashLookupWarning("");

              // ✅ error realtime por letras
              onRealTimeErrorChange?.("dni", hasLetters ? "Solo se aceptan números" : "");

              // ✅ limpiar todo SIEMPRE al cambiar DNI (aunque exista)
              onChange({
                ...data,
                dni,
                nombres: "",
                apellidos: "",
                orcid: "",
                escuela: "",
              });
            }}

            onBlur={() => touch("dni")}
            inputType="number"

          />

          {isLookingUp && <p className="text-xs text-slate-500">Buscando datos del DNI...</p>}

          {!isLookingUp && flashLookupWarning && (
            <p className="text-xs text-red-600">{flashLookupWarning}</p>
          )}

          {!isLookingUp && fieldError("dni") && (
            <p className="text-xs text-red-600">{fieldError("dni")}</p>
          )}

        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="Nombres"
            sublabel="Solo se aceptan letras"
            type="text"
            required
            placeholder="Se autocompleta con DNI"
            value={data.nombres || ""}
            onChange={(e) => {
              const value = e.target.value;
              const hasNumbers = /\d/.test(value);
              onRealTimeErrorChange?.("nombres", hasNumbers ? "Solo se aceptan letras" : "");
              onChange({ ...data, nombres: value });
            }}


          />
          {fieldError("nombres") && <p className="text-xs text-red-600">{fieldError("nombres")}</p>}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="Apellidos"
            sublabel="Solo se aceptan letras"
            type="text"
            required
            placeholder="Se autocompleta con DNI"
            value={data.apellidos || ""}
            onChange={(e) => {
              const value = e.target.value;
              const hasNumbers = /\d/.test(value);
              onRealTimeErrorChange?.("apellidos", hasNumbers ? "Solo se aceptan letras" : "");
              onChange({ ...data, apellidos: value });
            }}
            onBlur={() => touch("apellidos")}
            inputType="text"

          />
          {fieldError("apellidos") && <p className="text-xs text-red-600">{fieldError("apellidos")}</p>}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={FileText}
            label="URL de ORCID"
            sublabel="Ej: https://orcid.org/0000-0000-0000-0000"
            type="text"
            placeholder="https://orcid.org/0000-0000-0000-0000"
            value={data.orcid || ""}
            required
            onChange={(e) => {
              const value = e.target.value;
              // realtime suave: solo marca error si hay texto y es inválido
              if (value.trim() && !isValidOrcid(value)) onRealTimeErrorChange?.("orcid", "ORCID no válido");
              else onRealTimeErrorChange?.("orcid", "");
              onChange({ ...data, orcid: value });
            }}
          />
          {fieldError("orcid") && <p className="text-xs text-red-600">{fieldError("orcid")}</p>}
        </div>
        <div className="space-y-1">
          <FormSelect
            icon={Building2}
            label="Escuela Profesional"
            value={data.escuela || ""}
            onChange={(value) => {
              onChange({ ...data, escuela: value });
              touch("escuela");
              onRealTimeErrorChange?.("escuela", "");
            }}
            options={[
              "Ingeniería informática y sistemas",
              "Ingeniería Civil",
              "Ingeniería de Minas",
              "Ingeniería Agroindustrial",
              "Ingeniería Agroecológica y Desarrollo Rural",
              "Administración",
              "Ciencia Política y Gobernabilidad",
              "Educación inicial intercultural y bilingüe 1ra y 2da infancia",
              "Medicina Veterinaria y zootécnia",
            ]}
          />
          {fieldError("escuela") && <p className="text-xs text-red-600">{fieldError("escuela")}</p>
          }
        </div>
      </div>
    </div>
  );
}
