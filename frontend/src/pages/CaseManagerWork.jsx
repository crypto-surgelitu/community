import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneCall, Clock, CheckCircle, FileText, Send, Loader2, Plus, AlertTriangle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { memberService } from '../services/memberService';
import { templateService } from '../services/templateService';

export default function CaseManagerWork() {
  const notify = useNotification();
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [templates, setTemplates] = useState([]);
  
   const fetchData = useCallback(async () => {
     try {
       setLoading(true);
       const [membersData, templatesData] = await Promise.all([
         memberService.getAll({ status: 'at_risk' }),
         templateService.getAll()
       ]);
       setMembers(membersData.members || []);
       setTemplates(templatesData || []);
     } catch {
       notify.error('Failed to load data for Case Manager Hub');
     } finally {
       setLoading(false);
     }
   }, [notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = (actionName) => {
    notify.success(`${actionName} logged successfully`);
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Readying your hub...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Case Manager Hub</h1>
          <p className="text-gray-500 mt-1">Manage interventions, track engagements, and maintain templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar/Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border text-sm border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
             <h3 className="font-bold text-gray-900">Quick Actions</h3>
             <button onClick={() => handleAction('Log Call')} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition">
                <PhoneCall className="w-4 h-4 text-gray-500" /> Log Call
             </button>
             <button onClick={() => handleAction('Send SMS')} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition">
                <Mail className="w-4 h-4 text-gray-500" /> Send Message
             </button>
             <button onClick={() => handleAction('Add Note')} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition">
                <FileText className="w-4 h-4 text-gray-500" /> Add Note
             </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-5 text-white">
             <h3 className="font-bold mb-1">Priority Attention</h3>
             <p className="text-3xl font-black mt-2 mb-1">{members.length}</p>
             <p className="text-blue-100 text-sm">Flagged members pending follow-up</p>
             <button className="mt-4 w-full bg-white text-blue-700 font-medium py-2 rounded-lg text-sm hover:bg-blue-50 transition">Start Sequence</button>
          </div>
        </div>

        {/* Main Interface Content */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="border-b border-gray-200 px-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['members', 'events', 'templates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex-1 p-6 bg-gray-50/30 overflow-y-auto">
             {activeTab === 'members' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Members needing prioritization
                  </h3>
                  
                  {members.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                      <p>All flagged members have been processed!</p>
                    </div>
                  ) : (
                    members.map(member => (
                      <div key={member.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between hover:border-red-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">
                            {member.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{member.name}</p>
                            <p className="text-xs text-gray-500">
                              Zone: {member.zone?.name || member.zone} • {member.email}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                          <Send className="w-4 h-4"/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
             )}
             
             {activeTab === 'templates' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-gray-900">Message Templates</h3>
                     <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                       <Plus className="w-4 h-4" /> New Template
                     </button>
                  </div>
                  
                  {templates.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p>No templates created yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {templates.map(template => (
                     <div key={template.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 cursor-pointer transition-all group">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{template.title?.split(' ')[0] || 'Template'}</span>
                          <Clock className="w-3 h-3 text-gray-400" />
                       </div>
                       <p className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{template.title}</p>
                       <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{template.content}</p>
                     </div>
                   ))}
                    </div>
                  )}
                </div>
             )}
             
             {activeTab === 'events' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
                   <Clock className="w-12 h-12 text-gray-300 mb-4" />
                   <h3 className="font-bold text-gray-900">Event Operations</h3>
                   <p className="max-w-xs text-center mt-1">Visit the Events page to manage check-ins and performance metrics.</p>
                   <Link to="/events" className="mt-4 text-blue-600 font-semibold hover:underline">Go to Events &rarr;</Link>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
