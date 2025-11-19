import { FormInput } from "./FormInput";
import { User, CreditCard, FileText, Building2, Trash2 } from "lucide-react"
import { FormSelect } from "./FormSelect";
export function AddTeacherForm({ number, canRemove, onRemove }){
  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-5 bg-gray-50/60 space-y-4">
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
        />
        <FormInput
          icon={User}
          label="Apellidos"
          type="text"
          placeholder="Ingresa tus apellidos"
        />
        <FormInput
          icon={CreditCard}
          label="Número de DNI"
          type="text"
          placeholder="12345678"
          maxLength={8}
        />
        <FormInput
          icon={FileText}
          label="URL de ORCID"
          type="text"
          placeholder="0000-0000-0000-0000"
        />
        <FormSelect
            icon={Building2}
            label="Escuela Profesional"
            options={[
              "Ingeniería de Sistemas",
              "Ingeniería Civil",
              "Ingeniería Ambiental",
              "Administración",
              "Contabilidad",
              "Derecho",
              "Educación",
            ]}
          />
        
      </div>
    </div>
  );
}
