import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentEventsList } from '../components/dashboard/RecentEventsList';

export default function Events() {
  const [view, setView] = useState('list'); // list or calendar

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Events</h1>
          <p className="text-gray-500 mt-1">Manage and track all community gatherings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 flex items-center rounded-lg shadow-inner">
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List View
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`px-4 py-1.5 flex items-center gap-2 text-sm font-medium rounded-md transition-all ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CalendarIcon className="w-4 h-4" /> Calendar
            </button>
          </div>
          <Link to="/events/new" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm transition-all text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-3">
             {/* Reused from dashbaord for now to emulate the list */}
             <RecentEventsList />
           </div>
           
           <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-gray-900">Total Events</h3>
                 <p className="text-3xl font-black text-gray-900 mt-2">18</p>
                 <p className="text-sm text-gray-500 mt-1">Scheduled this month</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px] flex items-center justify-center flex-col text-center">
             <CalendarIcon className="w-16 h-16 text-gray-200 mb-4" />
             <h3 className="text-xl font-medium text-gray-900">Calendar View Interactive Mode</h3>
             <p className="text-gray-500 max-w-sm mt-2">The interactive calendar view will be connected to the upcoming real-time backend API integration.</p>
        </div>
      )}
    </div>
  );
}
