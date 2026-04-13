import { useState, useCallback } from 'react';
import { Search, Plus, Upload, Filter, Mail, MoreVertical } from 'lucide-react';
import { BulkImportModal } from '../components/members/BulkImportModal';
import { useNotification } from '../context/NotificationContext';

export default function Members() {
  const notify = useNotification();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data as specified without backend for now
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Mumbah', email: 'alice@example.com', phone: '+254700000001', zone: 'Kisauni', status: 'Active', programs: ['Mentorship'] },
    { id: 2, name: 'Bob Omondi', email: 'bob@example.com', phone: '+254700000002', zone: 'Nyali', status: 'Inactive', programs: [] },
    { id: 3, name: 'Charlie Kariuki', email: 'charlie@example.com', phone: '+254700000003', zone: 'Mvita', status: 'Active', programs: ['Tech Hub', 'Arts'] },
  ]);

  const handleBulkImport = async (parsedData) => {
    // Mock import logic
    notify.success(`Imported ${parsedData.length} members successfully.`);
    const newMembers = parsedData.map((m, i) => ({
      id: Date.now() + i,
      name: m.Name || 'Unknown',
      email: m.Email || '',
      phone: m.Phone || '',
      zone: m.Zone || 'Unassigned',
      status: 'Active',
      programs: m.Programs ? m.Programs.split(',') : []
    }));
    setMembers([...members, ...newMembers]);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Member Directory</h1>
          <p className="text-gray-500 mt-1">Manage all {members.length} Swahilipot Hub community members.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm transition-all text-sm">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members by name or email..." 
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.programs.join(', ') || 'No programs'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400"/> {member.email}</div>
                    <div className="text-sm text-gray-500 mt-1">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No members found matching your search.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
           <span className="text-sm text-gray-500">Showing {filteredMembers.length} results</span>
           <div className="flex gap-2 text-sm">
             <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50">Prev</button>
             <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>

      <BulkImportModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleBulkImport} 
      />
    </div>
  );
}
