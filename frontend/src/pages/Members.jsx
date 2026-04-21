import { useState, useCallback, useEffect } from 'react';
import { Search, Plus, Upload, Filter, Mail, MoreVertical, Loader2 } from 'lucide-react';
import { BulkImportModal } from '../components/members/BulkImportModal';
import { AddMemberModal } from '../components/members/AddMemberModal';
import { useNotification } from '../context/NotificationContext';
import { memberService } from '../services/memberService';

export default function Members() {
  const notify = useNotification();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data.members || []);
    } catch {
      notify.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleBulkImport = async (parsedData) => {
    try {
      await memberService.bulkImport(parsedData);
      notify.success(`Imported ${parsedData.length} members successfully.`);
      fetchMembers();
    } catch {
      notify.error('Import failed. Please check your CSV format.');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-12 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-bold text-on-surface tracking-tighter leading-none mb-4">Member Directory</h1>
          <p className="text-on-surface-variant font-medium text-lg">Manage all {members.length} Swahilipot Hub community members.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-sm font-bold text-on-surface-variant bg-surface-low hover:bg-surface-lowest transition-all duration-300"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-gradient flex items-center gap-3 py-3 px-8 rounded-full shadow-lg shadow-primary/20 text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      <div className="card-editorial overflow-hidden flex flex-col p-10">
        <div className="mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members by name or email..." 
              className="block w-full pl-14 pr-6 py-4 rounded-2xl text-[15px] bg-surface-low border-transparent focus:bg-surface-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          
          <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-on-surface-variant bg-surface-low hover:bg-surface-lowest transition w-full sm:w-auto">
            <Filter className="w-4 h-4 text-primary" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto -mx-10 px-10">
          <table className="min-w-full">
            <thead>
              <tr className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] text-left">
                <th className="px-6 py-6 font-bold">Member</th>
                <th className="px-6 py-6 font-bold">Contact Details</th>
                <th className="px-6 py-6 font-bold">Zone</th>
                <th className="px-6 py-6 font-bold">Engagement Status</th>
                <th className="px-6 py-6 font-bold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Accessing records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="group">
                  <td className="px-6 py-6 whitespace-nowrap bg-surface-low first:rounded-l-3xl group-hover:bg-surface-lowest group-hover:shadow-editorial transition-all duration-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-14">
                        <div className="h-14 w-14 rounded-2xl bg-surface-lowest flex items-center justify-center text-primary font-bold text-xl border-2 border-surface-low shadow-sm">
                          {member.name?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div className="ml-5">
                        <div className="text-[17px] font-bold text-on-surface">{member.name}</div>
                        <div className="text-[13px] font-bold text-primary mt-0.5">
                          {member.programs?.map(p => typeof p === 'string' ? p : p.name).join(', ') || 'Community Member'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap bg-surface-low group-hover:bg-surface-lowest group-hover:shadow-editorial transition-all duration-300">
                    <div className="text-[15px] font-semibold text-on-surface flex items-center gap-2"><Mail className="w-4 h-4 text-primary/60"/> {member.email}</div>
                    <div className="text-[13px] font-bold text-on-surface-variant/60 mt-1">{member.phone}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap bg-surface-low group-hover:bg-surface-lowest group-hover:shadow-editorial transition-all duration-300">
                    <span className="text-[13px] font-bold text-on-surface px-4 py-1.5 bg-surface-lowest rounded-full border border-surface-low/50">
                      {member.zone?.name || member.zone || 'Unassigned'}
                    </span>
                  </td>
                   <td className="px-6 py-6 whitespace-nowrap bg-surface-low group-hover:bg-surface-lowest group-hover:shadow-editorial transition-all duration-300">
                     <span className={`px-4 py-1.5 inline-flex text-[11px] font-bold rounded-full uppercase tracking-widest ${
                       member.status === 'active' ? 'bg-secondary/10 text-secondary' : 
                       member.status === 'at_risk' ? 'bg-red-50 text-red-600' : 'bg-on-surface-variant/10 text-on-surface-variant'
                     }`}>
                       {member.status?.replace('_', ' ') || 'Unknown'}
                     </span>
                   </td>
                  <td className="px-6 py-6 whitespace-nowrap text-right bg-surface-low last:rounded-r-3xl group-hover:bg-surface-lowest group-hover:shadow-editorial transition-all duration-300">
                    <button className="text-on-surface-variant/40 hover:text-primary p-3 rounded-xl hover:bg-surface-low transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredMembers.length === 0 && (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center text-on-surface-variant font-bold uppercase tracking-widest text-sm">
                      No members discovered matching your criteria.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-12 flex items-center justify-between">
           <span className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">Inventory: {filteredMembers.length} Results</span>
           <div className="flex gap-4">
             <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant bg-surface-low hover:bg-surface-lowest transition-all">Previous</button>
             <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant bg-surface-low hover:bg-surface-lowest transition-all">Next</button>
           </div>
        </div>
      </div>

      <BulkImportModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleBulkImport} 
      />

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onMemberAdded={fetchMembers} 
      />
    </div>
  );
}
