import { useEffect, useRef, useState } from "react";
import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    // Ajusta esto según cómo guardes tu sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/"); // inicio
  };

  return (
    <header className="sticky top-0 z-30 bg-secondary h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 w-80">
          <Search size={18} className="text-white/60" />
          <input
            type="text"
            placeholder="Buscar tesis, estudiantes..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Search size={20} />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* ✅ Dropdown Admin */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User size={18} />
            </span>
            <span className="hidden md:block text-sm font-medium">Admin</span>
            <ChevronDown
              className={`hidden md:block w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <Link
                to="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-sm font-semibold"
              >
                <User className="w-4 h-4" />
                Perfil
              </Link>

              <div className="h-px bg-slate-200" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm font-semibold text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
