// src/shared/ui/layout/ListThesisWorks.tsx
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "@/utils/api";

interface Student {
  id_solicitud: string;
  fecha_subida: string;
  nombre_archivo: string;          // primer autor (nombres + apellidos)
  apellidos: string;
  dni: string;
  escuela_profesional: string;
  observaciones: string | null;
  autores_busqueda?: string;       // todos los autores/coautores
}

interface Teacher {
  id_solicitud: string;
  fecha_subida: string;
  nombres: string;                 // primer autor
  apellidos: string;
  dni: string;
  escuela_profesional: string;
  observaciones: string | null;
  autores_busqueda?: string;       // todos los autores/coautores
}

type TabType = "students" | "teachers";

export default function ListThesisWorks() {
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Cargar datos según pestaña activa
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    } else {
      fetchTeachers();
    }
    setCurrentPage(1);
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/applications/students`);
      const result = await response.json();

      if (result.success) {
        setStudentsData(result.data);
      } else {
        setError("Error al cargar los datos de estudiantes");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/applications/teachers`);
      const result = await response.json();

      if (result.success) {
        setTeachersData(result.data);
      } else {
        setError("Error al cargar los datos de docentes");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentData = activeTab === "students" ? studentsData : teachersData;

  const filteredData = currentData.filter((item: Student | Teacher) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    if (activeTab === "students") {
      const s = item as Student;
      const autores = (s.autores_busqueda || "").toLowerCase();
      const nombrePrincipal = (s.nombre_archivo || "").toLowerCase();
      return (
        s.dni.toLowerCase().includes(term) ||
        nombrePrincipal.includes(term) ||
        autores.includes(term)
      );
    } else {
      const t = item as Teacher;
      const autores = (t.autores_busqueda || "").toLowerCase();
      const nombrePrincipal = `${t.nombres || ""} ${t.apellidos || ""}`.toLowerCase();
      return (
        t.dni.toLowerCase().includes(term) ||
        nombrePrincipal.includes(term) ||
        autores.includes(term)
      );
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getObservationStyle = (observation: string | null): string => {
    if (!observation) return "bg-gray-100 text-gray-800";
    if (observation.includes("Aprobado")) return "bg-green-100 text-green-800";
    if (observation.includes("completos")) return "bg-blue-100 text-blue-800";
    if (observation.includes("Falta")) return "bg-red-100 text-red-800";
    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="overflow-y-auto min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-lg font-bold text-slate-800 mb-2">
            Sistema de Gestión de Trabajos de Tesis
          </h1>
          <p className="text-xs text-slate-600">
            Gestión y seguimiento de trabajos académicos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => handleTabChange("students")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${
              activeTab === "students"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => handleTabChange("teachers")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm text-xs ${
              activeTab === "teachers"
                ? "bg-emerald-600 text-white shadow-lg scale-105"
                : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            Docentes
          </button>
        </div>

        {/* Filtros / Buscador */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700">
              {activeTab === "students"
                ? "Trabajos estudiantiles"
                : "Trabajos docentes"}
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
                placeholder="Buscar por DNI o autor"
              />
              <Search size={18} className="absolute top-2.5 right-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={activeTab === "students" ? fetchStudents : fetchTeachers}
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
                        {activeTab === "students" ? "Nombre (1er autor)" : "Nombre (1er autor)"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Apellidos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        DNI
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Escuela Profesional
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Observación
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No se encontraron resultados
                        </td>
                      </tr>
                    ) : activeTab === "students" ? (
                      (currentItems as Student[]).map((item) => (
                        <tr
                          key={item.id_solicitud}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                            {formatDate(item.fecha_subida)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {item.nombre_archivo}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {item.apellidos}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                            {item.dni}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {item.escuela_profesional}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getObservationStyle(
                                item.observaciones
                              )}`}
                            >
                              {item.observaciones || "Sin observación"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="inline-flex items-center gap-2 px-2 py-2 rounded-lg transition-all transform hover:scale-105 shadow-sm bg-blue-600 hover:bg-blue-700">
                              <Eye size={16} className="text-white" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      (currentItems as Teacher[]).map((item) => (
                        <tr
                          key={item.id_solicitud}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                            {formatDate(item.fecha_subida)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {item.nombres}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {item.apellidos}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                            {item.dni}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {item.escuela_profesional}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getObservationStyle(
                                item.observaciones
                              )}`}
                            >
                              {item.observaciones || "Sin observación"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="inline-flex items-center gap-2 px-2 py-2 rounded-lg transition-all transform hover:scale-105 shadow-sm bg-emerald-600 hover:bg-emerald-700">
                              <Eye size={16} className="text-white" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    Mostrando{" "}
                    {filteredData.length === 0
                      ? 0
                      : indexOfFirstItem + 1}{" "}
                    al {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                    {filteredData.length} resultados
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
                            ? activeTab === "students"
                              ? "bg-blue-600 text-white"
                              : "bg-emerald-600 text-white"
                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
