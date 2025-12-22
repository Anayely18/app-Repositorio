import { AlertCircle, GraduationCap, Loader2, Search, Users } from "lucide-react";
import Logo from "../ui/Logo";
import { useState } from "react";

export function SearchPage({ activeTab, onTabChange, onSearch }) {
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!dni || dni.trim() === '') {
            setError('Por favor, ingresa un DNI o código válido');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const API_BASE_URL = 'http://localhost:3000'; 
            const url = `${API_BASE_URL}/api/applications/search?dni=${encodeURIComponent(dni)}&type=${activeTab}`;

            console.log('🔍 Buscando en:', url);
            console.log('🔍 DNI:', dni, 'Tipo:', activeTab);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Status:', response.status);
            console.log('📡 Content-Type:', response.headers.get('content-type'));

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Respuesta no es JSON:', text.substring(0, 200));
                setError('Error de servidor: La ruta no existe o el servidor no está respondiendo correctamente.');
                return;
            }

            const result = await response.json();
            console.log('📦 Datos recibidos:', result);

            if (response.ok && result.success) {
                const transformedData = {
                    applicationId: result.data.application_id,
                    applicationType: result.data.application_type,
                    status: result.data.status,
                    createdAt: result.data.created_at,
                    projectName: result.data.project_name,
                    applicant: result.data.applicant,
                    documents: result.data.documents,
                    publication_link: result.data.publication_link,
                    timeline: result.data.timeline
                };

                console.log('✅ Datos transformados:', transformedData);
                onSearch(transformedData);
            } else {
                setError(result.message || 'No se encontró ningún trámite con ese DNI/código. Verifica que el DNI sea correcto y corresponda al tipo seleccionado.');
            }
        } catch (error) {
            console.error('❌ Error completo:', error);
            if (error.message.includes('Failed to fetch')) {
                setError('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
            } else if (error.name === 'SyntaxError') {
                setError('Error: El servidor no está devolviendo datos válidos. Verifica la ruta de la API.');
            } else {
                setError('Error al consultar el trámite. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        onTabChange(tab);
        setDni('');
        setError('');
    };

    return (
        <>
            <div className="h-16 bg-secondary shadow-lg flex items-center px-6">
                <Logo />
            </div>
            <div className="min-h-screen max-w-5xl mx-auto p-6 md:p-8een bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-7xl mx-auto p-6 md:p-8">
                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-slate-900 mb-3">
                            Consulta el Estado de tu Trámite
                        </h1>
                        <p className="text-1xl text-slate-600">
                            Selecciona tu tipo de trámite e ingresa tu DNI o código
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mb-6 justify-center">
                        <button
                            onClick={() => handleTabChange('estudiante')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${activeTab === 'estudiante'
                                ? 'bg-blue-900 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-600 hover:bg-blue-50 border-2 border-slate-200'
                                }`}
                        >
                            <GraduationCap className="w-5 h-5" />
                            Estudiante
                        </button>
                        <button
                            onClick={() => handleTabChange('docente')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${activeTab === 'docente'
                                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-600 hover:bg-emerald-50 border-2 border-slate-200'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            Docente
                        </button>
                    </div>

                    <div className=" lg:col-span-2 mt-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <p className="text-center">
                                <span className="font-semibold text-slate-800 text-base">
                                    {activeTab === 'estudiante' ? '🎓 Búsqueda de Tesis' : '👨‍🏫 Búsqueda de Informes'}
                                </span>
                                <br />
                                <span className="text-sm text-slate-600 mt-1 inline-block">
                                    {activeTab === 'estudiante'
                                        ? 'Consulta el estado de tu proyecto de tesis'
                                        : 'Consulta el estado de tu informe de investigación'
                                    }
                                </span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="dni" className="block text-sm font-semibold text-slate-700 mb-2">
                                    {activeTab === 'estudiante' ? 'Número de DNI (8 dígitos)' : 'Código de Docente (6 dígitos)'}
                                </label>
                                <input
                                    type="text"
                                    id="dni"
                                    value={dni}
                                    onChange={(e) => {
                                        const value = e.target.value.trim();
                                        setDni(value);
                                        setError('');
                                    }}
                                    placeholder={activeTab === 'estudiante' ? 'Ej: 12345678' : 'Ej: 123456'}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                                />
                                {error && (
                                    <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className={`w-full font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${activeTab === 'estudiante'
                                    ? 'bg-blue-900 hover:bg-blue-700 disabled:bg-blue-400'
                                    : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
                                    } text-white disabled:cursor-not-allowed`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Consultar Estado
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-slate-700">
                                    <p className="font-semibold mb-2">Nota importante:</p>
                                    <p className="mb-2">
                                        Ingresa el {activeTab === 'estudiante' ? 'DNI' : 'código'} que utilizaste al momento de realizar tu solicitud.
                                    </p>
                                    <p className="text-slate-600">
                                        Si no encuentras tu trámite, verifica que:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 ml-2">
                                        <li>Has seleccionado el tipo correcto (Estudiante/Docente)</li>
                                        <li>El {activeTab === 'estudiante' ? 'DNI' : 'código'} ingresado es correcto</li>
                                        <li>Tu solicitud ha sido registrada en el sistema</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 mt-2">
                            © {new Date().getFullYear()} Universidad Nacional Micaela Bastidas de Apurímac
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
