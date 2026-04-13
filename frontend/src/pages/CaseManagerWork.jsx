import { useState } from 'react';
import { Mail, PhoneCall, Clock, CheckCircle, FileText, Send } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function CaseManagerWork() {
  const notify = useNotification();
  const [activeTab, setActiveTab] = useState('members');
  
  const handleAction = (actionName) => {
    notify.success(`${actionName} logged successfully`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Case Manager Hub</h1>
        <p className="text-gray-500 mt-1">Manage interventions, track engagements, and maintain templates.</p>
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
             <h3 className="font-bold mb-1">Today's Tasks</h3>
             <p className="text-3xl font-black mt-2 mb-1">12</p>
             <p className="text-blue-100 text-sm">Follow-ups pending</p>
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
          
          <div className="flex-1 p-6 bg-gray-50/30">
             {activeTab === 'members' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Members needing attention</h3>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">O</div>
                       <div>
                         <p className="font-semibold text-gray-900 leading-tight">Omar Hassan</p>
                         <p className="text-xs text-gray-500">Last attended: 90 days ago</p>
                       </div>
                     </div>
                     <button className="p-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Send className="w-4 h-4"/></button>
                  </div>
                </div>
             )}
             
             {activeTab === 'templates' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-gray-900">Message Templates</h3>
                     <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition">New Template</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 cursor-pointer transition">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Check-in</p>
                        <p className="font-semibold text-gray-900 mb-1">Missed You at Hub</p>
                        <p className="text-sm text-gray-500 line-clamp-2">Hi [Name], we missed you at the last few sessions! Everything okay?</p>
                     </div>
                  </div>
                </div>
             )}
             
             {activeTab === 'events' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                   <Clock className="w-12 h-12 text-gray-300 mb-4" />
                   <p>No event action items pending today.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
