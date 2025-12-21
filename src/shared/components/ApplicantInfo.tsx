import { Calendar, Mail, Phone, User } from "lucide-react";

export function ApplicantInfo({ applicant, createdAt }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="text-sm font-medium text-blue-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 mb-1">Solicitante</p>
                    <p className="font-semibold text-xs text-gray-900">
                        {applicant.name} {applicant.surname}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 mb-1">Correo electrónico</p>
                    <p className="font-semibold text-xs text-gray-900 wrap-break-word">
                        {applicant.email}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 mb-1">Teléfono</p>
                    <p className="font-semibold text-xs text-gray-900">
                        {applicant.phone}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 mb-1">Fecha de solicitud</p>
                    <p className="font-semibold text-xs text-gray-900">
                        {formatDate(createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}
