import { authFetch } from "@/utils/api";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Application {
    id: string;
    createdAt: string;
    name: string;
    surname: string;
    professionalSchool: string;
    projectName: string | null;
    status: string;
    observations: string;
}

type TabType = "students" | "teachers";

export default function ListThesisWorks() {
    const [activeTab, setActiveTab] = useState<TabType>("students");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [schoolFilter, setSchoolFilter] = useState<string>("");
    const [data, setData] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState<number>(0);
    const itemsPerPage = 10;
    const searchTimeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();

    const professionalSchools = [
        "Ingeniería informática y sistemas",
        "Ingeniería Civil",
        "Ingeniería de Minas",
        "Ingeniería Agroindustrial",
        "Ingeniería Agroecológica y Desarrollo Rural",
        "Administración",
        "Ciencia Política y Gobernabilidad",
        "Educación inicial intercultural y bilingüe 1ra y 2da infancia",
        "Medicina Veterinaria y zootécnia",
    ];

    const statusOptions = [
        { value: "pendiente", label: "Pendiente" },
        { value: "aprobado", label: "aprobado" },
        { value: "observado", label: "observado" },
        { value: "publicado", label: "publicado" },
    ];

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage, debouncedSearch, statusFilter, schoolFilter]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const condition = activeTab === "students" ? "estudiante" : "docente";
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                condition: condition,
            });

            if (debouncedSearch.trim()) {
                params.append("search", debouncedSearch.trim());
            }

            if (statusFilter) {
                params.append("status", statusFilter);
            }

            if (schoolFilter) {
                params.append("professionalSchool", schoolFilter);
            }

            const response = await authFetch(`/applications/list?${params.toString()}`, { method: "GET" });
            if (!response.ok) {
                setError("Error al cargar los datos");
                return;
            }
            const result = await response.json();

            if (result.success) {
                setData(result.data || []);
                console.log(result.data)
                setTotalItems(result.total || 0);
            } else {
                setError("Error al cargar los datos");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const handlePageChange = (pageNumber: number): void => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        setSearchTerm("");
        setDebouncedSearch("");
        setStatusFilter("");
        setSchoolFilter("");
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string): void => {
        setSearchTerm(value);
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "—";

        return date.toLocaleString("es-PE", {
            timeZone: "America/Lima",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };



    const cleanText = (v: any) => String(v ?? "").trim().replace(/\s+/g, " ");

    const toTitleCase = (value: any) => {
        const s = cleanText(value).toLowerCase();
        if (!s) return "—";

        return s
            .split(" ")
            .filter(Boolean)
            .map((word) =>
                word
                    .split("-")
                    .map((part) =>
                        part
                            .split("'")
                            .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ""))
                            .join("'")
                    )
                    .join("-")
            )
            .join(" ");
    };


    const handleViewDetails = (id: string) => {
        console.log("Ver detalles de:", id);
        navigate(`/dashboard/details/${id}`);
    };

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

    const normalizeStatus = (status?: string | null) =>
        (status || "").toLowerCase().trim();

    const getStatusLabel = (status?: string | null) => {
        const s = normalizeStatus(status);
        return statusOptions.find((x) => x.value === s)?.label || status || "—";
    };

    const getStatusStyle = (status?: string | null) => {
        const s = normalizeStatus(status);

        if (s === "pendiente") return "bg-amber-100 text-amber-800 border border-amber-200";
        if (s === "aprobado") return "bg-green-100 text-green-800 border border-green-200";
        if (s === "observado") return "bg-red-100 text-red-800 border border-red-200";
        if (s === "publicado") return "bg-purple-100 text-purple-800 border border-purple-200";

        return "bg-slate-100 text-slate-700 border border-slate-200";
    };


    return (
        <div className="overflow-y-auto min-h-screen bg-slate-50">
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
                        onClick={() => handleTabChange("students")}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${activeTab === "students"
                            ? "bg-blue-600 text-white shadow-lg scale-105"
                            : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"
                            }`}
                    >
                        Estudiantes
                    </button>
                    <button
                        onClick={() => handleTabChange("teachers")}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${activeTab === "teachers"
                            ? "bg-emerald-600 text-white shadow-lg scale-105"
                            : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
                            }`}
                    >
                        Docentes
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700">
                                {activeTab === "students"
                                    ? "Trabajos estudiantiles"
                                    : "Trabajos docentes"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full outline-none border py-2 pl-3 pr-10 text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Buscar por DNI o autor"
                                />
                                <Search size={18} className="absolute top-2.5 right-3 text-slate-400" />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full outline-none border py-2 px-3 text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                            >
                                <option value="">Todos los estados</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={schoolFilter}
                                onChange={(e) => {
                                    setSchoolFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full outline-none border py-2 px-3 text-sm rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                            >
                                <option value="">Todas las escuelas</option>
                                {professionalSchools.map((school) => (
                                    <option key={school} value={school}>
                                        {school}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(searchTerm || statusFilter || schoolFilter) && (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600">Filtros activos:</span>
                                {debouncedSearch && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                                        Búsqueda: {debouncedSearch}
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setDebouncedSearch("");
                                            }}
                                            className="hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {statusFilter && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md">
                                        Estado: {statusOptions.find(s => s.value === statusFilter)?.label}
                                        <button
                                            onClick={() => {
                                                setStatusFilter("");
                                                setCurrentPage(1);
                                            }}
                                            className="hover:text-green-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {schoolFilter && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                                        Escuela: {schoolFilter}
                                        <button
                                            onClick={() => {
                                                setSchoolFilter("");
                                                setCurrentPage(1);
                                            }}
                                            className="hover:text-purple-900"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setDebouncedSearch("");
                                        setStatusFilter("");
                                        setSchoolFilter("");
                                        setCurrentPage(1);
                                    }}
                                    className="ml-auto text-slate-600 hover:text-slate-900 underline"
                                >
                                    Limpiar todos
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchData}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Fecha subida
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Nombre (1er autor)
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Apellidos
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Escuela Profesional
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-8 text-center text-slate-500"
                                                >
                                                    No se encontraron resultados
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {toTitleCase(item.name)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {toTitleCase(item.surname)}
                                                    </td>


                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {item.professionalSchool}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                                                            {getStatusLabel(item.status)}
                                                        </span>
                                                    </td>


                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleViewDetails(item.id)}
                                                            className={`inline-flex items-center gap-2 px-2 py-2 rounded-lg transition-all transform hover:scale-105 shadow-sm ${activeTab === "students"
                                                                ? "bg-blue-600 hover:bg-blue-700"
                                                                : "bg-emerald-600 hover:bg-emerald-700"
                                                                }`}
                                                        >
                                                            <Eye size={16} className="text-white" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="text-xs text-slate-600">
                                        Mostrando{" "}
                                        {totalItems === 0 ? 0 : indexOfFirstItem + 1}{" "}
                                        al {indexOfLastItem} de{" "}
                                        {totalItems} resultados
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;
                                                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                                let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                                if (endPage - startPage + 1 < maxVisible) {
                                                    startPage = Math.max(1, endPage - maxVisible + 1);
                                                }

                                                if (startPage > 1) {
                                                    pages.push(
                                                        <button
                                                            key={1}
                                                            onClick={() => handlePageChange(1)}
                                                            className="px-3 py-2 rounded-lg font-medium transition-all text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                        >
                                                            1
                                                        </button>
                                                    );
                                                    if (startPage > 2) {
                                                        pages.push(
                                                            <span key="ellipsis1" className="px-2 text-slate-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                }

                                                for (let i = startPage; i <= endPage; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePageChange(i)}
                                                            className={`px-3 py-2 rounded-lg font-medium transition-all text-xs ${currentPage === i
                                                                ? activeTab === "students"
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-emerald-600 text-white"
                                                                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }

                                                if (endPage < totalPages) {
                                                    if (endPage < totalPages - 1) {
                                                        pages.push(
                                                            <span key="ellipsis2" className="px-2 text-slate-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    pages.push(
                                                        <button
                                                            key={totalPages}
                                                            onClick={() => handlePageChange(totalPages)}
                                                            className="px-3 py-2 rounded-lg font-medium transition-all text-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                        >
                                                            {totalPages}
                                                        </button>
                                                    );
                                                }

                                                return pages;
                                            })()}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
