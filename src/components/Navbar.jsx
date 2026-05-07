import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LayoutDashboard, LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-50 animate-fadeInDown">
      <div className="mx-4 mt-3 mb-1 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">EduNet</span>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-medium capitalize flex items-center gap-1">
                  <Zap size={10} />{user.role}
                </span>
              </div>

              <Link to="/dashboard"
                className={`p-2 rounded-xl transition-all duration-200 ${location.pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-100 text-gray-500'}`}>
                <LayoutDashboard size={18} />
              </Link>

              <button onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
