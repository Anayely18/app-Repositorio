import { useEffect, useMemo, useRef, useState } from "react";
import { FormInput } from "./FormInput";
import { User, CreditCard, Phone, Building2, Trash2, Mail, Hash } from "lucide-react";
import { FormSelect } from "./FormSelect";
import { API_URL } from "@/utils/api";

interface StudentData {
  nombres?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  escuela?: string;
  email?: string;

  // ✅ Solo para autocompletar (no se persiste)
  codigo?: string;
}

interface AddStudentFormProps {
  number: number;
  canRemove: boolean;
  onRemove: () => void;
  data: StudentData;
  onChange: (data: StudentData) => void;

  // opcional: el padre lo pone true al intentar enviar
  showValidation?: boolean;
}

type FieldKey = "codigo" | "dni" | "nombres" | "apellidos" | "telefono" | "escuela" | "email";

export function AddStudentForm({
  number,
  canRemove,
  onRemove,
  data = {},
  onChange,
  showValidation = false,
}: AddStudentFormProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string>("");

  const lastCodeRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    codigo: false,
    dni: false,
    nombres: false,
    apellidos: false,
    telefono: false,
    escuela: false,
    email: false,
  });

  const touch = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k: FieldKey) => showValidation || touched[k];

  const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);

  const pickNames = (payload: any) => {
    const p = payload?.data ?? payload;
    const nombres =
      p?.nombres ?? p?.nombre ?? p?.name ?? p?.first_name ?? p?.firstName ?? "";
    const apellidos =
      p?.apellidos ?? p?.apellido ?? p?.surname ?? p?.last_name ?? p?.lastName ?? "";
    const full = p?.full_name ?? p?.fullName ?? "";
    return { nombres, apellidos, full };
  };

  // ✅ Validaciones (sin tocar UI)
  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    const codigo = (data.codigo ?? "").trim();
    const dni = (data.dni ?? "").trim();
    const nombres = (data.nombres ?? "").trim();
    const apellidos = (data.apellidos ?? "").trim();
    const telefono = (data.telefono ?? "").trim();
    const escuela = (data.escuela ?? "").trim();
    const email = (data.email ?? "").trim();

    // Código 6 dígitos + lookupError
    if (!codigo) e.codigo = "El código es obligatorio.";
    else if (!/^\d{6}$/.test(codigo)) e.codigo = "El código debe tener 6 dígitos.";
    else if (!isLookingUp && lookupError) e.codigo = lookupError;

    // DNI 8 dígitos
    if (!dni) e.dni = "El DNI es obligatorio.";
    else if (!/^\d{8}$/.test(dni)) e.dni = "El DNI debe tener 8 dígitos.";

    // Nombres / Apellidos
    if (!nombres) e.nombres = "Los nombres son obligatorios.";
    else if (nombres.length < 2) e.nombres = "Escribe al menos 2 caracteres.";

    if (!apellidos) e.apellidos = "Los apellidos son obligatorios.";
    else if (apellidos.length < 2) e.apellidos = "Escribe al menos 2 caracteres.";

    // Teléfono 9 dígitos (Perú)
    if (!telefono) e.telefono = "El teléfono es obligatorio.";
    else if (!/^\d{9}$/.test(telefono)) e.telefono = "Debe tener 9 dígitos.";

    // Escuela
    if (!escuela) e.escuela = "Selecciona una escuela profesional.";

    // Email
    if (!email) e.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo no válido.";

    return e;
  }, [
    data.codigo,
    data.dni,
    data.nombres,
    data.apellidos,
    data.telefono,
    data.escuela,
    data.email,
    lookupError,
    isLookingUp,
  ]);

  const isInvalid = (k: FieldKey) => !!errors[k] && showErr(k);

  useEffect(() => {
    const codigo = onlyDigits(data.codigo ?? "", 6);

    // si no está completo, no consultes
    if (codigo.length !== 6) {
      setLookupError("");
      lastCodeRef.current = "";
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // evita repetir el mismo código
    if (codigo === lastCodeRef.current) return;

    // debounce
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        setLookupError("");
        setIsLookingUp(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const LOOKUP_URL = `${API_URL}/lookup/students/${codigo}`;

        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "No se encontró el código");
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

        lastCodeRef.current = codigo;

        // ✅ Autocompleta (no persiste nada)
        onChange({
          ...data,
          codigo,
          nombres: finalNombres || data.nombres || "",
          apellidos: finalApellidos || data.apellidos || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setLookupError(err?.message || "Error consultando código");
      } finally {
        setIsLookingUp(false);
      }
    }, 450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [data.codigo]);

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Autor {number}
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
        {/* ✅ Código (6 dígitos) con autocompletado */}
        <div className="space-y-1">
          <FormInput
            icon={Hash}
            label="Código"
            sublabel="Ingrese su código (6 dígitos)"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={data.codigo || ""}
            inputType="number"
            onChange={(e) => {
              const codigo = onlyDigits(e.target.value, 6);
              setLookupError("");
              onChange({ ...data, codigo });
            }}
            onBlur={() => touch("codigo")}
            invalid={isInvalid("codigo")}
          />

          {isLookingUp && (
            <p className="text-xs text-slate-500">Buscando datos del código...</p>
          )}

          {!isLookingUp && isInvalid("codigo") && (
            <p className="text-xs text-red-600">{errors.codigo}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={CreditCard}
            label="Número de DNI"
            sublabel="Ingrese el numero documento de identidad"
            type="text"
            placeholder="12345678"
            maxLength={8}
            value={data.dni || ""}
            inputType="number"
            onChange={(e) => onChange({ ...data, dni: onlyDigits(e.target.value, 8) })}
            onBlur={() => touch("dni")}
            invalid={isInvalid("dni")}
          />
          {isInvalid("dni") && <p className="text-xs text-red-600">{errors.dni}</p>}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="Nombres"
            sublabel="(En mayúsculas y minúsculas según corresponda)"
            type="text"
            placeholder="Ingresa tus nombres"
            value={data.nombres || ""}
            inputType="text"
            onChange={(e) => onChange({ ...data, nombres: e.target.value })}
            onBlur={() => touch("nombres")}
            invalid={isInvalid("nombres")}
          />
          {isInvalid("nombres") && <p className="text-xs text-red-600">{errors.nombres}</p>}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={User}
            label="Apellidos"
            sublabel="(En mayúsculas y minúsculas según corresponda)"
            type="text"
            placeholder="Ingresa tus apellidos"
            value={data.apellidos || ""}
            inputType="text"
            onChange={(e) => onChange({ ...data, apellidos: e.target.value })}
            onBlur={() => touch("apellidos")}
            invalid={isInvalid("apellidos")}
          />
          {isInvalid("apellidos") && (
            <p className="text-xs text-red-600">{errors.apellidos}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={Phone}
            label="Número de contacto"
            sublabel="Número de teléfono celular"
            type="tel"
            placeholder="987654321"
            value={data.telefono || ""}
            inputType="number"
            maxLength={9}
            onChange={(e) => onChange({ ...data, telefono: onlyDigits(e.target.value, 9) })}
            onBlur={() => touch("telefono")}
            invalid={isInvalid("telefono")}
          />
          {isInvalid("telefono") && (
            <p className="text-xs text-red-600">{errors.telefono}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormSelect
            icon={Building2}
            label="Escuela Profesional"
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
            value={data.escuela || ""}
            onChange={(value) => onChange({ ...data, escuela: value })}
          />
          {isInvalid("escuela") && (
            <p className="text-xs text-red-600">{errors.escuela}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            icon={Mail}
            label="Correo Electrónico"
            type="email"
            placeholder="tu.correo@unamba.edu.pe"
            value={data.email || ""}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            onBlur={() => touch("email")}
            invalid={isInvalid("email")}
          />
          {isInvalid("email") && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
}
