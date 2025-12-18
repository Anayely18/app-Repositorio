import { FormInput } from "./FormInput";
import { User, CreditCard, FileText, Building2, Trash2 } from "lucide-react"
import { FormSelect } from "./FormSelect";

interface TeacherData {
    nombres ?: string
    apellidos?: string
    dni?: string
    orcid?: string
    escuela?: string
}

interface AddTeacherFormProps {
    number: number
    canRemove: boolean
    onRemove: () => void
    data: TeacherData
    onChange: (data: TeacherData) => void
}

export function AddTeacherForm({ 
    number, 
    canRemove, 
    onRemove, 
    data ={}, 
    onChange 
}: AddTeacherFormProps) {
   
    return (
        <div className="border-2 border-gray-200 rounded-xl p-6 flex flex-col gap-y-6 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
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
                <FormInput
                    icon={User}
                    label="Nombres"
                    type="text"
                    placeholder="Ingresa tus nombres"
                    value={data.nombres || ""}
                    onChange={(e) => onChange({... data, nombres: e.target.value})}
                />
                <FormInput
                    icon={User}
                    label="Apellidos"
                    type="text"
                    placeholder="Ingresa tus apellidos"
                    value={data.apellidos || ""}
                    onChange={(e) => onChange({... data, apellidos: e.target.value})}
                />
                <FormInput
                    icon={CreditCard}
                    label="Número de DNI"
                    type="text"
                    placeholder="12345678"
                    maxLength={8}
                    value={data.dni || ""}
                    onChange={(e) => onChange({... data, dni: e.target.value})}
                />
                <FormInput
                    icon={FileText}
                    label="URL de ORCID"
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    value={data.orcid || ""}
                    onChange={(e) => onChange({... data, orcid: e.target.value})}
                />
                <FormSelect
                    icon={Building2}
                    label="Escuela Profesional"
                    value={data.escuela || ""}
                    onChange={(value) => onChange({... data, escuela: value})}
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
            </div>
        </div>
    );
}
