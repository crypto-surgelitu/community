import { AlertTriangle, MessageSquare } from 'lucide-react';
import { getEngagementLevel } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export function AtRiskMembersList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-900">Engagement is healthy</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">No community members are currently flagged as "at-risk" based on recent attendance.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900">At-Risk Members</h3>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">{members.length} Flagged</span>
      </div>
      
      <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
        {members.map((member) => {
          const engagement = getEngagementLevel(member.eventCount || 0);
          return (
            <div key={member.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  {member.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{member.zone?.name || member.zone || 'Unassigned'}</span>
                    <span>•</span>
                    <span>{member.lastSeen || 'Status unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="flex flex-col items-start sm:items-end w-24">
                  <span className="text-xs text-gray-500 mb-1">Engagement</span>
                  <div className="flex items-end gap-[2px] h-3">
                    {[1, 2, 3].map((bar) => (
                      <div 
                        key={bar} 
                        className={`w-1.5 rounded-t-sm ${bar <= engagement.bars ? 'bg-amber-500' : 'bg-gray-200'}`}
                        style={{ height: `${bar * 33}%`, backgroundColor: bar <= engagement.bars ? engagement.color : '' }}
                      />
                    ))}
                  </div>
                </div>
                
                <Link to={`/mywork?action=message&user=${member.id}`} className="p-2 text-blue-600 hover:bg-blue-50 bg-white border border-blue-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
        <Link to="/members?filter=at-risk" className="text-sm text-gray-600 hover:text-gray-900 font-medium">View detailed member engagement report &rarr;</Link>
      </div>
    </div>
  );
}
