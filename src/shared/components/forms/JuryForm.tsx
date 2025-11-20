import { FormInput } from "./FormInput";
import { User,Trash2 } from "lucide-react"
export function JuryForm(){
  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-5 bg-gray-50/60 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
        </h4>
        
      </div>
      <div className="grid gap-4">
        <FormInput
          icon={User}
          label="Apellidos y nombres del presidente"
          type="text"
          placeholder="Ingresa tus nombres"
        />
        <FormInput
          icon={User}
          label="Apellidos y nombres del presidente"
          type="text"
          placeholder="Ingresa tus nombres"
        />
        <FormInput
          icon={User}
          label="Apellidos y nombres del presidente"
          type="text"
          placeholder="Ingresa tus nombres"
        />
        
      </div>
    </div>
  );
}
