import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export function RecentEventsList({ events }) {
  const defaultEvents = [
    { id: 1, name: 'Tech Mentorship Session', date: '2026-05-10T14:00:00Z', location: 'Main Hall', capacity: 50, attendees: 45, status: 'published' },
    { id: 2, name: 'Community Townhall', date: '2026-05-15T09:00:00Z', location: 'Amphitheatre', capacity: 200, attendees: 180, status: 'published' },
    { id: 3, name: 'Coding Bootcamp - Web', date: '2026-05-20T10:00:00Z', location: 'Lab 1', capacity: 30, attendees: 15, status: 'in_progress' },
    { id: 4, name: 'Swahilipot Open Mic', date: '2026-05-25T17:00:00Z', location: 'Courtyard', capacity: 100, attendees: 0, status: 'draft' },
  ];

  const displayEvents = events?.length ? events : defaultEvents;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-on-surface">Upcoming Events</h3>
        <Link to="/events" className="text-[13px] text-primary hover:underline font-bold uppercase tracking-wider">View all</Link>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {displayEvents.map((event) => (
          <div key={event.id} className="p-5 bg-surface-low rounded-2xl hover:bg-surface-lowest transition-all duration-300 group hover:shadow-editorial border-transparent border-2 hover:border-primary/5">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors line-clamp-1">{event.name}</h4>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest whitespace-nowrap ml-3 ${getStatusColor(event.status)}`}>
                {event.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-[13px] text-on-surface-variant/70 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span className="truncate">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2 mr-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full bg-surface-lowest border-2 border-surface-low flex items-center justify-center text-[8px] font-bold">
                        {String.fromCharCode(64 + i)}
                     </div>
                   ))}
                </div>
                <span className="text-on-surface font-bold">{event.attendees} / {event.capacity} registered</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
