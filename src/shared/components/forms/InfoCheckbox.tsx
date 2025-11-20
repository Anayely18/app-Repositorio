import { CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState, type ReactNode } from "react"

type InfoCheckboxProps = {
  icon: LucideIcon
  iconColor: string
  text: ReactNode
  checkboxLabel: string
  checkboxLabel2?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function InfoCheckbox({
  icon: Icon,
  iconColor,
  text,
  checkboxLabel,
  checkboxLabel2,
  checked,
  onChange,
}: InfoCheckboxProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          iconColor === "amber" ? "bg-amber-50"
          : iconColor === "blue" ? "bg-blue-50"
          : iconColor === "red" ? "bg-red-50"
          : "bg-green-50"
        }`}>
          <Icon className={`w-5 h-5 ${
            iconColor === "amber" ? "text-amber-600"
            : iconColor === "blue" ? "text-blue-600"
            : iconColor === "red" ? "text-red-600"
            : "text-green-600"
          }`} />
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {text}
          </p>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={onChange}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                />
                {checked && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 absolute -top-1 -right-1 animate-in zoom-in duration-200" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {checkboxLabel}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
