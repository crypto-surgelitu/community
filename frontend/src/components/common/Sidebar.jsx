import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Briefcase, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" />, roles: [] },
    { name: 'Events', path: ROUTES.EVENTS, icon: <CalendarDays className="w-5 h-5" />, roles: [] },
    { name: 'Members', path: ROUTES.MEMBERS, icon: <Users className="w-5 h-5" />, roles: [] },
    { name: 'My Work', path: ROUTES.MY_WORK, icon: <Briefcase className="w-5 h-5" />, roles: ['case_manager', 'community_manager'] },
    { name: 'Settings', path: ROUTES.SETTINGS, icon: <Settings className="w-5 h-5" />, roles: ['admin', 'community_manager'] },
  ];

  const filteredNav = navItems.filter(item => 
    item.roles.length === 0 || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 text-white font-bold text-xl tracking-tight">
        <div className="flex items-center">
          <span className="text-blue-500 mr-2">S</span>Hub Manager
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/50 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize truncate">{user?.role?.replace('_', ' ') || 'Role'}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
