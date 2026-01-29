import { useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, FileText, User, Trash2, MapPinned, Hash } from "lucide-react";
import { FormInput } from "./FormInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/utils/api";

interface CoautorData {
  tipoUbicacion?: "externo" | "interno";
  tipoRol?: "estudiante" | "docente";
  nombre?: string;
  apellido?: string;
  orcid?: string;

  // ⚠️ existe en el tipo, pero NO se persiste
  dni?: string;
  codigo?: string;
  showValidation?: boolean;

}

interface CoautorFormProps {
  number: number;
  onRemove: () => void;
  canRemove: boolean;
  data: CoautorData;
  onChange: (data: CoautorData) => void;
  realTimeErrors?: { nombre?: string; apellido?: string; dni?: string; orcid?: string; codigo?: string };
  onRealTimeErrorChange?: (field: "nombre" | "apellido" | "dni" | "orcid" | "codigo", value: string) => void;

  /** ✅ nuevo: el padre lo pone true al intentar enviar */
  showValidation?: boolean;
}

type FieldKey =
  | "tipoUbicacion"
  | "tipoRol"
  | "codigo"
  | "dni"
  | "nombre"
  | "apellido"
  | "orcid";

export function CoautorForm({
  number,
  onRemove,
  canRemove,
  data = {},
  onChange,
  realTimeErrors,
  onRealTimeErrorChange,
  showValidation,
}: CoautorFormProps) {
  // ✅ Solo UI/lookup (NO se guarda en "data")
  const [codigoLookup, setCodigoLookup] = useState<string>("");
  const [dniLookup, setDniLookup] = useState<string>("");

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMsg, setLookupMsg] = useState("");
  const lookupTimerMsgRef = useRef<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const lastKeyRef = useRef<string>(""); // evita repetir la misma búsqueda

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    tipoUbicacion: false,
    tipoRol: false,
    codigo: false,
    dni: false,
    nombre: false,
    apellido: false,
    orcid: false,
  });

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

  const isInternalStudent = data.tipoUbicacion === "interno" && data.tipoRol === "estudiante";
  const isInternalTeacher = data.tipoUbicacion === "interno" && data.tipoRol === "docente";

  const mustManualFill =
    !data.tipoUbicacion ||
    !data.tipoRol ||
    data.tipoUbicacion === "externo" ||
    (data.tipoUbicacion === "interno" && (data.tipoRol !== "estudiante" && data.tipoRol !== "docente"));

  const isValidOrcid = (v: string) => {
    const s = String(v ?? "").trim();
    if (!s) return true; // ✅ opcional
    const re = /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/i;
    return re.test(s);
  };


  // ✅ Cuando cambia rol/ubicación: limpia búsquedas y errores
  useEffect(() => {
    setLookupMsg("");
    setIsLookingUp(false);
    lastKeyRef.current = "";

    setCodigoLookup("");
    setDniLookup("");

    if (abortRef.current) abortRef.current.abort();
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, [data.tipoRol, data.tipoUbicacion]);

  // =========================
  // VALIDACIONES (dinámicas)
  // =========================
  // =========================
  // VALIDACIONES (dinámicas)
  // =========================
  const computedErrors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    const tu = data.tipoUbicacion;
    const tr = data.tipoRol;

    const nombre = String(data.nombre ?? "").trim();
    const apellido = String(data.apellido ?? "").trim();

    const codigo = onlyDigits(codigoLookup ?? "", 6);
    const dni = onlyDigits(dniLookup ?? "", 8);

    if (!tu) e.tipoUbicacion = "Selecciona la ubicación del coautor.";
    if (!tr) e.tipoRol = "Selecciona el rol del coautor.";

    // ✅ REQUERIDO si es interno
    if (isInternalStudent) {
      if (!codigo) e.codigo = "El código es obligatorio.";
      else if (!/^\d{6}$/.test(codigo)) e.codigo = "El código debe tener 6 dígitos.";

    }

    if (isInternalTeacher) {
      if (!dni) e.dni = "El DNI es obligatorio.";
      else if (!/^\d{8}$/.test(dni)) e.dni = "El DNI debe tener 8 dígitos.";

    }

    // nombre/apellido siempre necesarios
    if (!nombre) e.nombre = "Los nombres son obligatorios.";
    else if (nombre.length < 2) e.nombre = "Escribe al menos 2 caracteres.";

    if (!apellido) e.apellido = "Los apellidos son obligatorios.";
    else if (apellido.length < 2) e.apellido = "Escribe al menos 2 caracteres.";

    // ✅ ORCID opcional: solo valida si escribe
    const orcid = String(data.orcid ?? "").trim();
    if (orcid && !isValidOrcid(orcid)) {
      e.orcid = "ORCID no válido (ej: https://orcid.org/0000-0000-0000-0000).";
    }

    return e;
  }, [
    data.tipoUbicacion,
    data.tipoRol,
    data.nombre,
    data.apellido,
    data.orcid,
    codigoLookup,
    dniLookup,
    isLookingUp,
    isInternalStudent,
    isInternalTeacher,
  ]);


  const fieldError = (k: FieldKey) => {
    // prioridad: realtime > computed
    const rt =
      k === "codigo"
        ? realTimeErrors?.codigo
        : k === "dni"
          ? realTimeErrors?.dni
          : k === "nombre"
            ? realTimeErrors?.nombre
            : k === "apellido"
              ? realTimeErrors?.apellido
              : k === "orcid"
                ? realTimeErrors?.orcid
                : undefined;

    if (rt) return rt;

    if (!showErr(k)) return "";
    return computedErrors[k] ?? "";
  };

  const lookupFlashTimerRef = useRef<number | null>(null);

  const flashLookup = (msg: string) => {
    setLookupMsg(msg);
    if (lookupTimerMsgRef.current) window.clearTimeout(lookupTimerMsgRef.current);
    lookupTimerMsgRef.current = window.setTimeout(() => setLookupMsg(""), 20000);
  };

  useEffect(() => {
    return () => {
      if (lookupTimerMsgRef.current) window.clearTimeout(lookupTimerMsgRef.current);
    };
  }, []);

  // =========================
  // 1) LOOKUP ESTUDIANTE por CÓDIGO (6 dígitos) SOLO si es interno
  // =========================
  useEffect(() => {
    if (!isInternalStudent) return;

    const codigo = onlyDigits(codigoLookup ?? "", 6);

    if (codigo.length !== 6) {
      setLookupMsg("");
      lastKeyRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const key = `student:${codigo}`;
    if (key === lastKeyRef.current) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        setLookupMsg("");
        setIsLookingUp(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const LOOKUP_URL = `${API_URL}/lookup/students/${codigo}`;

        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Error consultando código, ingrese manualmente su nombre y apellido");
        }

        const { nombres, apellidos, full } = pickNames(json);

        let finalNombres = String(nombres ?? "").trim();
        let finalApellidos = String(apellidos ?? "").trim();

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
          throw new Error("El servicio no devolvió nombre/apellido");
        }

        lastKeyRef.current = key;

        onRealTimeErrorChange?.("codigo", "");
        setLookupMsg("");
        onChange({
          ...data,
          nombre: finalNombres || data.nombre || "",
          apellido: finalApellidos || data.apellido || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;

        flashLookup("Código no encontrado. Completa los datos manualmente.");
        onChange({ ...data, nombre: "", apellido: "", orcid: "" });

        lastKeyRef.current = key; // evita repetir
      } finally {
        setIsLookingUp(false);
      }
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [codigoLookup, isInternalStudent]); // importante

  // =========================
  // 2) LOOKUP DOCENTE por DNI (8 dígitos) SOLO si es interno
  // =========================
  useEffect(() => {
    if (!isInternalTeacher) return;

    const dni = onlyDigits(dniLookup ?? "", 8);

    if (dni.length !== 8) {
      setLookupMsg("");
      lastKeyRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const key = `teacher:${dni}`;
    if (key === lastKeyRef.current) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        setLookupMsg("");
        setIsLookingUp(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const LOOKUP_URL = `${API_URL}/personas/dni/${dni}`;

        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        const json = await res.json().catch(() => ({}));

        const { nombres, apellidos, full } = pickNames(json);

        let finalNombres = String(nombres ?? "").trim();
        let finalApellidos = String(apellidos ?? "").trim();

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
          throw new Error("El servicio no devolvió nombre/apellido");
        }

        lastKeyRef.current = key;

        onRealTimeErrorChange?.("dni", "");
        setLookupMsg("");
        onChange({
          ...data,
          nombre: finalNombres || data.nombre || "",
          apellido: finalApellidos || data.apellido || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;

        flashLookup("DNI no encontrado. Completa los datos manualmente.");
        onChange({ ...data, nombre: "", apellido: "", orcid: "" });

        lastKeyRef.current = key;
      } finally {
        setIsLookingUp(false);
      }
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [dniLookup, isInternalTeacher]); // importante

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 flex flex-col gap-y-6 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Co-autor {number}
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

      {/* UBICACIÓN */}
      <div>
        <RadioGroup
          value={data.tipoUbicacion || ""}
          onValueChange={(value) => {
            onChange({ ...data, tipoUbicacion: value as "externo" | "interno" });
            touch("tipoUbicacion");
          }}
        >
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Seleccione si el coautor es externo o interno</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2 gap-2 mt-2">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${data.tipoUbicacion === "externo"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <RadioGroupItem
                value="externo"
                id={`ubicacion-externo-${number}`}
                className="h-4 w-4 border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={`ubicacion-externo-${number}`} className="font-normal capitalize cursor-pointer">
                Externo
              </Label>
            </div>

            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${data.tipoUbicacion === "interno"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <RadioGroupItem
                value="interno"
                id={`ubicacion-interno-${number}`}
                className="h-4 w-4 border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={`ubicacion-interno-${number}`} className="font-normal capitalize cursor-pointer">
                Interno
              </Label>
            </div>
          </div>

        </RadioGroup>

        {fieldError("tipoUbicacion") && (
          <p className="text-xs text-red-600 mt-1">{fieldError("tipoUbicacion")}</p>
        )}
      </div>

      {/* ROL */}
      <div>
        <RadioGroup
          value={data.tipoRol || ""}
          onValueChange={(value) => {
            onChange({ ...data, tipoRol: value as "estudiante" | "docente" });
            touch("tipoRol");
          }}
        >
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Seleccione si el coautor es estudiante o docente</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2 gap-2 mt-2">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${data.tipoRol === "estudiante"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <RadioGroupItem
                value="estudiante"
                id={`rol-estudiante-${number}`}
                className="h-4 w-4 border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={`rol-estudiante-${number}`} className="font-normal capitalize cursor-pointer">
                Estudiante
              </Label>
            </div>

            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${data.tipoRol === "docente"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <RadioGroupItem
                value="docente"
                id={`rol-docente-${number}`}
                className="h-4 w-4 border-gray-300 text-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={`rol-docente-${number}`} className="font-normal capitalize cursor-pointer">
                Docente
              </Label>
            </div>
          </div>

        </RadioGroup>

        {fieldError("tipoRol") && (
          <p className="text-xs text-red-600 mt-1">{fieldError("tipoRol")}</p>
        )}
      </div>

      {/* ✅ Aviso si es externo o si falta selección */}
      {mustManualFill && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 text-xs text-amber-800">
          Para coautor <b>externo</b> o si no se eligió correctamente el rol/ubicación, completa <b>nombre y apellido</b> manualmente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Campo dinámico: Código si estudiante interno / DNI si docente interno */}
        {isInternalStudent && (
          <div className="space-y-1">
            <FormInput
              icon={Hash}
              label="Código"
              sublabel="Ingrese 6 dígitos para autocompletar"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={codigoLookup}
              onChange={(e) => {
                const v = onlyDigits(e.target.value, 6);

                if (abortRef.current) abortRef.current.abort();
                if (timerRef.current) window.clearTimeout(timerRef.current);

                lastKeyRef.current = "";
                setLookupMsg("");
                onRealTimeErrorChange?.("codigo", "");

                setCodigoLookup(v);

                // ✅ limpiar siempre
                onChange({ ...data, nombre: "", apellido: "", orcid: "" });
              }}

              onBlur={() => touch("codigo")}
              inputType="number"
              error={fieldError("codigo")}

            />
            {!isLookingUp && lookupMsg && (
              <p className="text-xs text-amber-700 mt-1">{lookupMsg}</p>
            )}
          </div>
        )}

        {isInternalTeacher && (
          <div className="space-y-1">
            <FormInput
              icon={CreditCard}
              label="DNI"
              sublabel="Ingrese 8 dígitos para autocompletar"
              type="text"
              placeholder="12345678"
              maxLength={8}
              value={dniLookup}
              onChange={(e) => {
                const v = onlyDigits(e.target.value, 8);

                if (abortRef.current) abortRef.current.abort();
                if (timerRef.current) window.clearTimeout(timerRef.current);

                lastKeyRef.current = "";
                setLookupMsg("");
                onRealTimeErrorChange?.("dni", "");

                setDniLookup(v);

                // ✅ limpiar siempre
                onChange({ ...data, nombre: "", apellido: "", orcid: "" });
              }}

              onBlur={() => touch("dni")}
              inputType="number"
              error={fieldError("dni")}
            />
            {!isLookingUp && lookupMsg && (
              <p className="text-xs text-amber-700 mt-1">{lookupMsg}</p>
            )}
          </div>
        )}

        <FormInput
          icon={User}
          label="Nombres"
          sublabel="Solo se aceptan letras"
          type="text"
          placeholder="Ej.: Gustavo"
          value={data.nombre || ""}
          onChange={(e) => {
            const value = e.target.value;
            const hasNumbers = /\d/.test(value);
            onRealTimeErrorChange?.("nombre", hasNumbers ? "Solo se aceptan letras" : "");
            onChange({ ...data, nombre: value });
          }}
          onBlur={() => touch("nombre")}
          inputType="text"
          error={fieldError("nombre")}
        />

        <FormInput
          icon={User}
          label="Apellidos"
          sublabel="Solo se aceptan letras"
          type="text"
          placeholder="Ej.: Robles Rojas"
          value={data.apellido || ""}
          onChange={(e) => {
            const value = e.target.value;
            const hasNumbers = /\d/.test(value);
            onRealTimeErrorChange?.("apellido", hasNumbers ? "Solo se aceptan letras" : "");
            onChange({ ...data, apellido: value });
          }}
          onBlur={() => touch("apellido")}
          inputType="text"
          error={fieldError("apellido")}
        />

        <FormInput
          icon={FileText}
          label="Url de ORCID"
          type="text"
          placeholder="https://orcid.org/0000-0000-0000-0000"
          value={data.orcid || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value.trim() && !isValidOrcid(value)) onRealTimeErrorChange?.("orcid", "ORCID no válido");
            else onRealTimeErrorChange?.("orcid", "");
            onChange({ ...data, orcid: value });
          }}
          onBlur={() => touch("orcid")}
          inputType="alphanumeric"
          error={fieldError("orcid")}
        />
      </div>
    </div>
  );
}
