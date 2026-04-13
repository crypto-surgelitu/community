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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
        <Link to="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium pb-0.5 border-b border-transparent hover:border-blue-600 transition-all">View all</Link>
      </div>
      
      <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
        {displayEvents.map((event) => (
          <div key={event.id} className="p-5 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{event.name}</h4>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-3 ${getStatusColor(event.status)}`}>
                {event.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-500 mt-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{event.attendees} / {event.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
