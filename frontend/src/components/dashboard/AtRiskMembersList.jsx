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
    <div className="flex flex-col h-full">
      <div className="space-y-2 flex-1 overflow-y-auto">
        {members.map((member) => {
          const engagement = getEngagementLevel(member.eventCount || 0);
          return (
            <div key={member.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-surface-low rounded-[24px] transition-all duration-300 group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-surface-lowest border-2 border-surface-low flex items-center justify-center text-primary font-bold shrink-0 text-lg shadow-sm group-hover:scale-105 transition-transform">
                  {member.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-[17px] mb-1">{member.name}</h4>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                    <span className="px-3 py-1 bg-surface-lowest rounded-full">{member.zone?.name || member.zone || 'Unassigned'}</span>
                    <span>•</span>
                    <span className="text-primary">{member.lastSeen || 'Status unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-2">Retention</span>
                  <div className="flex items-end gap-1 h-4">
                    {[1, 2, 3].map((bar) => (
                      <div 
                        key={bar} 
                        className={`w-2.5 rounded-full transition-all duration-500 ${bar <= engagement.bars ? '' : 'bg-surface-low'}`}
                        style={{ 
                          height: `${bar * 33 + 33}%`, 
                          backgroundColor: bar <= engagement.bars ? engagement.color : '' 
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <Link to={`/mywork?action=message&user=${member.id}`} className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-200">
                  <MessageSquare className="w-5 h-5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link to="/members?filter=at-risk" className="text-[13px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors">
          View full retention report &rarr;
        </Link>
      </div>
    </div>
  );
}
