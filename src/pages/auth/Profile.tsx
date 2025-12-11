import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle2,
  Camera,
  Shield,
  Clock,
  Calendar,
  Settings
} from 'lucide-react';

export default function AdminProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [adminData, setAdminData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    nombre_usuario: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar el perfil');
      }

      const data = await response.json();
      
      if (data.success) {
        setAdminData(data.data);
        setFormData({
          nombre: data.data.nombre,
          apellidos: data.data.apellidos,
          email: data.data.email,
          nombre_usuario: data.data.nombre_usuario,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.apellidos.trim()) {
      toast.error('El nombre y apellidos son obligatorios');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Ingresa un correo electrónico válido');
      return;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Debes ingresar tu contraseña actual');
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error('La nueva contraseña debe tener al menos 8 caracteres');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAdminData(data.data);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        toast.success('Perfil actualizado exitosamente');
      } else {
        toast.error(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Error al cargar el perfil</h3>
          <p className="text-slate-600 mb-4">No se pudo obtener la información de tu cuenta</p>
          <button 
            onClick={fetchProfile}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" richColors closeButton />
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header con gradiente */}
        <div className=" bg-blue-900 rounded-3xl  p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white to-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold  ring-4 ring-white/50">
                {formData.nombre.charAt(0)}{formData.apellidos.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all  hover:scale-110 group">
                <Camera className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-lgt font-bold text-white mb-2">
                {formData.nombre} {formData.apellidos}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Administrador
                </span>
                <span className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-white text-sm font-semibold flex items-center gap-2 ${
                  adminData.activo ? 'bg-emerald-400/30' : 'bg-red-400/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {adminData.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar con stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-3xl  border border-slate-200/50 p-6">
              <h3 className="md:text-lgt-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Información de Cuenta
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">Cuenta creada</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 ml-10">{formatDate(adminData.created_at)}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">Último acceso</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 ml-10">{formatDate(adminData.ultimo_acceso)}</p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 ">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-2 text-base">Seguridad</p>
                  <ul className="space-y-2 text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>No compartas tu contraseña</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>Usa contraseñas seguras</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span>Cierra sesión en PCs compartidas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-3xl  border border-slate-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient sticky top-0 z-30 bg-blue-900 to-indigo-500 rounded-2xl flex items-center justify-center ">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="md:text-lgt-xl font-bold text-slate-900">Información Personal</h2>
                  <p className="text-sm text-slate-500">Actualiza tus datos personales</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 fond-bold leading-relaxed "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 fond-bold leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 fond-bold leading-relaxed"
                    />
                  </div>
                </div>

              

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    DNI
                  </label>
                  <input
                    type="text"
                    value={adminData.dni}
                    disabled
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 cursor-not-allowed font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="md:text-lgt-xl font-bold text-slate-900">Cambiar Contraseña</h2>
                  <p className="text-sm text-slate-500">Mantén tu cuenta segura</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="•••••••••"
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repite la contraseña"
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-8 py-4  sticky top-0 z-30 bg-blue-900 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
