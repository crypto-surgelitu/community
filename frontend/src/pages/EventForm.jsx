import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, MapPin, Users, Info, ChevronLeft, Save, Loader2 } from 'lucide-react';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const eventSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  description: z.string().min(10, 'Please provide a more detailed description'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z.string().min(3, 'Location is required'),
  maxCapacity: z.coerce.number().min(1, 'Capacity must be at least 1').max(10000),
  programId: z.string().uuid('Please select a program'),
});

export default function EventForm() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      maxCapacity: 50,
    }
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const data = await eventService.getPrograms();
        setPrograms(data);
      } catch {
        notify.error('Failed to load programs');
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, [notify]);

  const onSubmit = async (data) => {
    if (!user?.id) {
      notify.error('You must be logged in to create an event');
      return;
    }

    try {
      setLoading(true);
      
      // Transform data for backend
      const dateTime = new Date(data.date);
      const eventDate = dateTime.toISOString().split('T')[0];
      const eventTime = dateTime.toTimeString().slice(0, 5); // HH:mm
      
      const payload = {
        title: data.title,
        description: data.description,
        location: data.location,
        maxCapacity: data.maxCapacity,
        programId: data.programId,
        eventDate: eventDate,
        eventTime: eventTime,
        durationMinutes: 60, // Default duration
        organizerId: user.id,
        notifyAll: false
      };

      await eventService.create(payload);
      notify.success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      notify.error(err.response?.data?.error || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Events
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to schedule a new community gathering.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Event Title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. Monthly Tech Mentorship"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> Date & Time
              </label>
              <input
                {...register('date')}
                type="datetime-local"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Location
              </label>
              <input
                {...register('location')}
                placeholder="e.g. Swahilipot Hub - Lab 1"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" /> Max Capacity
              </label>
              <input
                {...register('maxCapacity')}
                type="number"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.maxCapacity ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
              />
              {errors.maxCapacity && <p className="text-red-500 text-xs mt-1.5">{errors.maxCapacity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" /> Program
              </label>
              <select
                {...register('programId')}
                disabled={loadingPrograms}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.programId ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-white font-medium`}
              >
                <option value="">{loadingPrograms ? 'Loading programs...' : 'Select a program...'}</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
              {errors.programId && <p className="text-red-500 text-xs mt-1.5">{errors.programId.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="4"
                placeholder="Tell us more about the event goals and requirements..."
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save and Publish
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
