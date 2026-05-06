import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <GraduationCap size={28} />
          <span>EduClass</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">
              {user.name} · <span className="capitalize text-green-600 font-medium">{user.role}</span>
            </span>
            <Link to="/dashboard" className={`p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/dashboard' ? 'bg-gray-100' : ''}`}>
              <LayoutDashboard size={20} />
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
