import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Student {
    id: number;
    uploadDate: string;
    firstName: string;
    lastName: string;
    dni: string;
    career: string;
    observation: string;
}

interface Teacher {
    id: number;
    uploadDate: string;
    firstName: string;
    lastName: string;
    dni: string;
    school: string;
    observation: string;
}

type TabType = 'students' | 'teachers';

export default function ListThesisWorks() {
    const [activeTab, setActiveTab] = useState<TabType>('students');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const itemsPerPage = 5;

    const studentsData: Student[] = [
        {
            id: 1,
            uploadDate: '2024-11-10',
            firstName: 'María',
            lastName: 'González',
            dni: '72345678',
            career: 'Systems Engineering',
            observation: 'Documentos completos'
        },
        {
            id: 2,
            uploadDate: '2024-11-12',
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            dni: '71234567',
            career: 'Business Administration',
            observation: 'Falta certificado'
        },
        {
            id: 3,
            uploadDate: '2024-11-13',
            firstName: 'Ana',
            lastName: 'Martínez',
            dni: '73456789',
            career: 'Law',
            observation: 'En revisión'
        },
        {
            id: 4,
            uploadDate: '2024-11-14',
            firstName: 'Luis',
            lastName: 'Pérez',
            dni: '70987654',
            career: 'Medicine',
            observation: 'Aprobado'
        },
        {
            id: 5,
            uploadDate: '2024-11-15',
            firstName: 'Patricia',
            lastName: 'Silva',
            dni: '72567890',
            career: 'Architecture',
            observation: 'Documentos completos'
        },
        {
            id: 6,
            uploadDate: '2024-11-16',
            firstName: 'Roberto',
            lastName: 'Díaz',
            dni: '71345678',
            career: 'Civil Engineering',
            observation: 'En proceso'
        },
        {
            id: 7,
            uploadDate: '2024-11-17',
            firstName: 'Elena',
            lastName: 'Torres',
            dni: '73234567',
            career: 'Psychology',
            observation: 'Aprobado'
        }
    ];

    const teachersData: Teacher[] = [
        {
            id: 1,
            uploadDate: '2024-11-09',
            firstName: 'Dr. Juan',
            lastName: 'Ramírez',
            dni: '40123456',
            school: 'Engineering',
            observation: 'Asesor principal'
        },
        {
            id: 2,
            uploadDate: '2024-11-11',
            firstName: 'Dra. Carmen',
            lastName: 'López',
            dni: '40234567',
            school: 'Social Sciences',
            observation: 'Co-asesor'
        },
        {
            id: 3,
            uploadDate: '2024-11-13',
            firstName: 'Mg. Ricardo',
            lastName: 'Vargas',
            dni: '40345678',
            school: 'Law',
            observation: 'Jurado evaluador'
        },
        {
            id: 4,
            uploadDate: '2024-11-14',
            firstName: 'Dr. Fernando',
            lastName: 'Sánchez',
            dni: '40456789',
            school: 'Medicine',
            observation: 'Asesor principal'
        },
        {
            id: 5,
            uploadDate: '2024-11-15',
            firstName: 'Dra. Sofía',
            lastName: 'Mendoza',
            dni: '40567890',
            school: 'Architecture',
            observation: 'Revisora'
        },
        {
            id: 6,
            uploadDate: '2024-11-16',
            firstName: 'Mg. Alberto',
            lastName: 'Castro',
            dni: '40678901',
            school: 'Engineering',
            observation: 'Asesor'
        }
    ];

    const currentData = activeTab === 'students' ? studentsData : teachersData;

    const filteredData = currentData.filter((item: Student | Teacher) =>
        item.dni.includes(searchTerm)
        
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
    };

    const getObservationStyle = (observation: string): string => {
        if (observation.includes('Aprobado')) return 'bg-green-100 text-green-800';
        if (observation.includes('completos')) return 'bg-blue-100 text-blue-800';
        if (observation.includes('Falta')) return 'bg-red-100 text-red-800';
        return 'bg-amber-100 text-amber-800';
    };

    return (
        <div className="overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <h1 className="text-lg font-bold text-slate-800 mb-2">
                        Sistema de Gestión de Trabajos de Tesis
                    </h1>
                    <p className="text-xs text-slate-600">
                        Gestión y seguimiento de trabajos académicos
                    </p>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => handleTabChange('students')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${
                            activeTab === 'students'
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
                        }`}
                    >
                        Estudiantes
                    </button>
                    <button
                        onClick={() => handleTabChange('teachers')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${
                            activeTab === 'teachers'
                                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
                        }`}
                    >
                        Docentes
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">
                            {activeTab === 'students' ? 'Trabajos estudiantiles' : 'Trabajos docentes'}
                        </span>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="outline-none border py-2 pl-3 pr-10 text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="Buscar"
                            />
                            <Search size={18} className="absolute top-2.5 right-3 text-slate-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Fecha subida
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Nombres
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Apellidos
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        DNI
                                    </th>
                                    <th className="px-6 py-4  text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        {activeTab === 'students' && 'Carrera Profesional' }
                                    </th>
                                    {activeTab === 'teachers' && (
                                        <th className="px-1 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Escuela profesional
                                        </th>
                                    )}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Observación
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {currentItems.map((item: Student | Teacher) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {item.uploadDate}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                                            {item.firstName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                                            {item.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                            {item.dni}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                                {(item as Student).career}
                                        </td>
                                        {activeTab === 'teachers' && (
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {(item as Teacher).school}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className={`inline-flex px-2 py-1  text-xs font-medium ${getObservationStyle(item.observation)}`}>
                                                {item.observation}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                className={`inline-flex items-center gap-2 px-2 py-2 rounded-lg transition-all transform hover:scale-105 shadow-sm ${
                                                    activeTab === 'students'
                                                        ? 'bg-blue-600 hover:bg-blue-700'
                                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                                }`}
                                            >
                                                <Eye size={16} className="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-600">
                                Mostrando {indexOfFirstItem + 1} al {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-2 py-2 rounded-lg font-medium transition-all text-xs ${
                                            currentPage === index + 1
                                                ? activeTab === 'students'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-emerald-600 text-white'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}