import { useState } from 'react';
import Logo from "@/shared/ui/Logo"
import {
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  ImageIcon,
  ZoomIn,
  X,
  GraduationCap,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ============================================
// COMPONENTE: Modal de Imágenes
// ============================================
function ImageModal({ show, images, currentIndex, onClose, onNext, onPrev }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm" onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentIndex]}
            alt="Evidencia ampliada"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          {images.length > 1 && (
            <div className="bg-white px-3 py-2 text-center text-xs text-slate-600 border-t">
              Imagen {currentIndex + 1} de {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Información del Solicitante
// ============================================
function ApplicantInfo({ applicant, createdAt }) {
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
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
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
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 mb-1">Correo electrónico</p>
          <p className="font-semibold text-xs text-gray-900">
            {applicant.email}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
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
        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
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

// ============================================
// COMPONENTE: Tarjeta de Documento
// ============================================
function DocumentCard({ doc, onOpenImage }) {
  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_revision: 'bg-blue-100 text-blue-800 border-blue-200',
      aprobado: 'bg-green-100 text-green-800 border-green-200',
      rechazado: 'bg-red-100 text-red-800 border-red-200',
      requiere_correccion: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprobado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'en_revision':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'requiere_correccion':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente de revisión',
      en_revision: 'En revisión',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      requiere_correccion: 'Requiere correcciones'
    };
    return labels[status] || status;
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 text-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
          <h3 className="font-medium text-slate-900">{doc.name}</h3>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 flex items-center gap-2 ${getStatusColor(doc.status)}`}>
          {getStatusIcon(doc.status)}
          {getStatusLabel(doc.status)}
        </span>
      </div>

      {doc.observation && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-900 mb-2">Observación del administrador:</p>
              <p className="text-sm text-orange-800 leading-relaxed">{doc.observation}</p>
            </div>
          </div>

          {doc.images && doc.images.length > 0 && (
            <div className="border-t-2 border-orange-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-orange-700" />
                <p className="text-sm font-bold text-orange-900">
                  Evidencia adjunta ({doc.images.length} {doc.images.length === 1 ? 'imagen' : 'imágenes'})
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {doc.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative group cursor-pointer aspect-square"
                    onClick={() => onOpenImage(doc.images, imgIndex)}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all shadow-sm hover:shadow-md">
                      <img
                        src={img}
                        alt={`Evidencia ${imgIndex + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <ZoomIn className="w-5 h-5 text-slate-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded font-mono">
                      {imgIndex + 1}/{doc.images.length}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-700 mt-3 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                Haz clic en las imágenes para ampliarlas
              </p>
            </div>
          )}
        </div>
      )}

      {doc.status === 'aprobado' && !doc.observation && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-semibold">
              Documento aprobado sin observaciones
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: Estado de Constancia
// ============================================
function ConstanciaStatus({ status }) {
  if (status === 'aprobado') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-900 mb-2">
              ¡En proceso!
            </h3>
            <p className="text-green-800 mb-4 text-sm">
              Su trámite está siendo generado
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'requiere_correccion' || status === 'rechazado') {
    return (
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-900 mb-2">
              Acción Requerida
            </h3>
            <p className="text-orange-800 mb-2 text-sm">
              Su trámite requiere correcciones antes de poder generar la constancia.
            </p>
            <p className="text-sm text-orange-700 leading-relaxed">
              Revise las observaciones en cada documento y envie los archivos corregidos nuevamente por el formulario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-s text-blue-900 leading-relaxed mb-2">
            ¡Publicado!
          </h3>
          <p className="text-blue-800 mb-2 text-sm">
            Su trámite ya ha sido publicado en el repositorio.
          </p>
          <p className="text-sm text-blue-700 leading-relaxed">
            Ingrese al siguiente link para
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Línea de Tiempo
// ============================================
function Timeline({ timeline }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 shadow-sm"></div>
            {index < timeline.length - 1 && (
              <div className="w-0.5 h-full bg-slate-200 my-1"></div>
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
              <p className="font-bold text-slate-900 mb-1 text-base">{item.status}</p>
              <p className="text-sm text-slate-600 mb-2 leading-relaxed">{item.description}</p>
              <p className="text-xs text-slate-500 font-mono bg-white inline-block px-2 py-1 rounded">
                {formatDate(item.date)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// COMPONENTE: Página de Detalles del Trámite
// ============================================
function TramiteDetailsPage({ tramiteData, activeTab, onReset }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  const openImageModal = (images, startIndex) => {
    setAllImages(images);
    setCurrentImageIndex(startIndex);
    setSelectedImage(images[startIndex]);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setAllImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_revision: 'bg-blue-100 text-blue-800 border-blue-200',
      aprobado: 'bg-green-100 text-green-800 border-green-200',
      rechazado: 'bg-red-100 text-red-800 border-red-200',
      requiere_correccion: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprobado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'en_revision':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'requiere_correccion':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente de revisión',
      en_revision: 'En revisión',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      requiere_correccion: 'Requiere correcciones'
    };
    return labels[status] || status;
  };

  return (
    <>
      <div className="h-16 bg-secondary shadow-lg flex items-center px-6">
        <Logo />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Realizar nueva búsqueda
          </button>

          <ImageModal
            show={showImageModal}
            images={allImages}
            currentIndex={currentImageIndex}
            onClose={closeImageModal}
            onNext={nextImage}
            onPrev={prevImage}
          />

          {/* Header del trámite */}
          <main className="max-w-5xl mx-auto p-6 md:p-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'estudiante'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
                  }`}>
                  {activeTab === 'estudiante' ? (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      Tesis de Estudiante
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      Informe de Docente
                    </>
                  )}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                <div className="flex-1">
                  <h1 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">
                    {tramiteData.projectName}
                  </h1>
                  <p className="text-sm text-slate-500 font-mono bg-slate-50 inline-block px-3 py-1 rounded-md">
                    {tramiteData.applicationId}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(tramiteData.status)} text-sm font-bold border-2 flex items-center gap-2`}>
                  {getStatusIcon(tramiteData.status)}
                  <span className="text-base">{getStatusLabel(tramiteData.status)}</span>
                </div>
              </div>

              <ApplicantInfo
                applicant={tramiteData.applicant}
                createdAt={tramiteData.createdAt}
              />
            </div>


            {/* Estado de documentos */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">Estado de Documentos</h2>
                  <p className="text-sm text-slate-600">Revisa el estado de cada documento presentado</p>
                </div>
              </div>

              <div className="space-y-5">
                {tramiteData.documents.map((doc, index) => (
                  <DocumentCard
                    key={index}
                    doc={doc}
                    onOpenImage={openImageModal}
                  />
                ))}
              </div>
            </div>

            {/* Grid de Constancia y Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">Constancia</h2>
                    <p className="text-sm text-slate-600">Estado de tu certificado</p>
                  </div>
                </div>
                <ConstanciaStatus status={tramiteData.status} />
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="md:textext-lgt-xl font-bold text-gray-900 mb-2">Historial</h2>
                    <p className="text-sm text-slate-600">Seguimiento del trámite</p>
                  </div>
                </div>
                <Timeline timeline={tramiteData.timeline} />
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-blue-900 mb-3 text-base">Información importante</p>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-1">•</span>
                      <span>Recibirá notificaciones por correo sobre cualquier cambio en su trámite</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-1">•</span>
                      <span>El tiempo de procesamiento es de 5 días hábiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-1">•</span>
                      <span>Si tiene dudas, puede contactar a la Unidad de Investigación</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ============================================
// COMPONENTE: Página de Búsqueda
// ============================================
function SearchPage({ activeTab, onTabChange, onSearch }) {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    // Validación básica - solo verificar que no esté vacío
    if (!dni || dni.trim() === '') {
      setError('Por favor, ingresa un DNI o código válido');
      return;
    }

    // Validación de longitud (comentada para permitir datos de prueba)
    // if (activeTab === 'estudiante' && dni.length !== 8) {
    //   setError('El DNI de estudiante debe tener 8 dígitos');
    //   return;
    // }
    // if (activeTab === 'docente' && dni.length !== 6) {
    //   setError('El código de docente debe tener 6 dígitos');
    //   return;
    // }

    setLoading(true);
    setError('');

    try {
      // Construir la URL completa - ajusta el puerto y ruta según tu configuración
      const API_BASE_URL = 'http://localhost:3000'; // Cambia esto según tu backend
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

      // Verificar si la respuesta es JSON
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
        // Transformar los datos del backend al formato esperado por el frontend
        const transformedData = {
          applicationId: result.data.application_id,
          applicationType: result.data.application_type,
          status: result.data.status,
          createdAt: result.data.created_at,
          projectName: result.data.project_name,
          applicant: result.data.applicant,
          documents: result.data.documents,
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
      <div className="min-h-screen max-w-5xl mx-auto p-6 md:p-8een bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
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
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
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
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
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

// ============================================
// COMPONENTE PRINCIPAL: App
// ============================================
export default function TramiteStatusApp() {
  const [activeTab, setActiveTab] = useState('estudiante');
  const [tramiteData, setTramiteData] = useState(null);

  const handleSearch = (data) => {
    setTramiteData(data);
  };

  const handleReset = () => {
    setTramiteData(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (tramiteData) {
    return (
      <TramiteDetailsPage
        tramiteData={tramiteData}
        activeTab={activeTab}
        onReset={handleReset}
      />
    );
  }

  return (
    <SearchPage
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSearch={handleSearch}
    />
  );
}
