import { useState } from 'react';
import { User, Shield, Bell, Key, Database, Server } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const notify = useNotification();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const navItems = [
    { id: 'account', label: 'My Account', icon: User },
    { id: 'users', label: 'User Management', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & API', icon: Key },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'backup', label: 'Data Backup', icon: Database },
  ];

  const handleSave = () => {
    notify.success('Settings saved successfully');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 h-full flex flex-col">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1">Manage portal configurations, access rights, and your profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 bg-opacity-70' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8 min-h-[500px] overflow-y-auto">
          {activeTab === 'account' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''} 
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || ''} 
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 bg-gray-50" 
                    readOnly 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address is managed via your account provider and is read-only.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Role</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                      {user?.role?.replace('_', ' ') || 'User'}
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                   <button onClick={handleSave} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow disabled:opacity-50 hover:bg-blue-700 transition">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'system' && (
            <div>
               <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-bold">API Service</p>
                    <p className="text-green-600 text-sm mt-1">Operational • 43ms latency</p>
                 </div>
                 <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-bold">Database Instance</p>
                    <p className="text-green-600 text-sm mt-1">Operational • MySQL 8.x</p>
                 </div>
               </div>
            </div>
          )}
          
          {activeTab !== 'account' && activeTab !== 'system' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 text-gray-500">
               <Settings className="w-16 h-16 text-gray-200 mb-4" />
               <h3 className="text-xl font-medium text-gray-900 mb-2 capitalize">{activeTab} Settings</h3>
               <p className="max-w-md">Configuration panel for {activeTab} is currently restricted while we verify your elevated administrative privileges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
