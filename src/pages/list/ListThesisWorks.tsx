import Logo from "@/shared/ui/Logo";
import { Eye, Search } from "lucide-react";

export default function ListThesisWorks() {
    const datos = [
        {
            id: 1,
            fechaSubida: '2024-11-10',
            nombre: 'María',
            apellido: 'González',
            dni: '72345678',
            escuela: 'Ingeniería de Sistemas',
            observacion: 'Documentos completos'
        },
        {
            id: 2,
            fechaSubida: '2024-11-12',
            nombre: 'Carlos',
            apellido: 'Rodríguez',
            dni: '71234567',
            escuela: 'Administración',
            observacion: 'Falta certificado'
        },
        {
            id: 3,
            fechaSubida: '2024-11-13',
            nombre: 'Ana',
            apellido: 'Martínez',
            dni: '73456789',
            escuela: 'Derecho',
            observacion: 'En revisión'
        },
        {
            id: 4,
            fechaSubida: '2024-11-14',
            nombre: 'Luis',
            apellido: 'Pérez',
            dni: '70987654',
            escuela: 'Medicina',
            observacion: 'Aprobado'
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="h-16 bg-secondary flex m-auto items-center justify-around">
                <Logo />
            </div>
            <div className="max-w-7xl mx-auto flex flex-col gap-y-8 pt-8">
                <div className="flex items-center justify-center gap-x-8">
                    <button className="bg-secondary text-white py-2 px-4 rounded hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-all">Estudiantes</button>
                    <button className="bg-secondary text-white py-2 px-4 rounded hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-all">Docentes</button>
                </div>
                <div className="relative flex justify-between items-center">
                    <span className="font-semibold text-secondary">Trabajos recientes</span>
                    <input type="text" className="outline-none border py-2 pl-2 pr-8 text-xs rounded border-secondary" placeholder="Buscar por dni" />
                    <Search size={16} className="absolute top-2 right-2" />
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl  overflow-hidden border border-secondary">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-secondary/30">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">Fecha de Subida</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">Nombre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">Apellido</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">DNI</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">Escuela Profesional</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary border-r border-secondary/30 last:border-r-0">Observación</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-secondary">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((estudiante) => (
                                    <tr
                                        key={estudiante.id}
                                        className="border-b border-secondary/30 hover:bg-secondary/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600 border-r border-secondary/30">{estudiante.fechaSubida}</td>
                                        <td className="px-6 py-4 text-sm text-black font-medium border-r border-black/30">{estudiante.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-black font-medium border-r border-secondary/30">{estudiante.apellido}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 border-r border-secondary/30">{estudiante.dni}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 border-r border-secondary/30">{estudiante.escuela}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 border-r border-secondary/30">{estudiante.observacion}</td>
                                        <td className="px-6 py-4 text-center">

                                            <button
                                                className="inline-flex items-center gap-2 p-2 bg-secondary rounded-lg transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                                            >
                                                <Eye size={16} className="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}