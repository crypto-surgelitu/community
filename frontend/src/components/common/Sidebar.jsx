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
    <aside className="w-72 bg-surface-low flex flex-col h-full shrink-0">
      <div className="h-20 flex items-center justify-between px-8 text-primary font-bold text-2xl tracking-tighter font-display">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg font-bold mr-3">S</div>
          <span>Hub Manager</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-full hover:bg-surface-lowest transition"
        >
          <X className="w-5 h-5 text-on-surface" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-on-surface-variant hover:bg-surface-lowest hover:text-primary'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-primary'}`}>
                  {item.icon}
                </div>
                <span className="font-semibold text-[15px]">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 px-4 py-4 rounded-3xl bg-surface-lowest mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-on-surface truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest truncate">{user?.role?.replace('_', ' ') || 'Role'}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
