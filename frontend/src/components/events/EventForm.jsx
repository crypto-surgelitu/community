import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Clock, MapPin, Users, Loader2 } from 'lucide-react';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name required').max(100),
  eventType: z.enum(['workshop', 'training', 'social', 'mentorship']),
  description: z.string().max(500).optional(),
  date: z.coerce.date().min(new Date(), "Date must be in the future"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  duration: z.coerce.number().min(30).max(480),
  maxCapacity: z.coerce.number().min(1).max(1000),
  location: z.string().min(3).max(200),
  zone: z.string().optional(),
  publish: z.boolean().default(false),
});

export function EventForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: defaultValues || { publish: false }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Event Details</h3>
          <p className="mt-1 text-sm text-gray-500">Provide basic information about the upcoming event.</p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Event Name *</label>
            <input 
              {...register('name')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : ''}`}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Event Type *</label>
            <select 
              {...register('eventType')}
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.eventType ? 'border-red-300' : ''}`}
            >
              <option value="">Select type...</option>
              <option value="workshop">Workshop</option>
              <option value="training">Training</option>
              <option value="social">Social</option>
              <option value="mentorship">Mentorship</option>
            </select>
            {errors.eventType && <span className="text-red-500 text-xs mt-1 block">{errors.eventType.message}</span>}
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              {...register('description')} 
              rows={3}
              className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
            {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-gray-50/50">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Logistics & Location</h3>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><CalendarDays className="w-4 h-4 mr-1 text-gray-400"/> Date *</label>
            <input 
              type="date"
              {...register('date')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.date ? 'border-red-300' : ''}`}
            />
            {errors.date && <span className="text-red-500 text-xs mt-1 block">{errors.date.message}</span>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400"/> Time *</label>
            <input 
              type="time"
              {...register('time')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.time ? 'border-red-300' : ''}`}
            />
            {errors.time && <span className="text-red-500 text-xs mt-1 block">{errors.time.message}</span>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Duration (mins) *</label>
            <input 
              type="number"
              {...register('duration')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.duration ? 'border-red-300' : ''}`}
            />
            {errors.duration && <span className="text-red-500 text-xs mt-1 block">{errors.duration.message}</span>}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400"/> Location *</label>
            <input 
              {...register('location')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-300' : ''}`}
            />
            {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location.message}</span>}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><Users className="w-4 h-4 mr-1 text-gray-400"/> Max Capacity *</label>
            <input 
              type="number"
              {...register('maxCapacity')} 
              className={`mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.maxCapacity ? 'border-red-300' : ''}`}
            />
            {errors.maxCapacity && <span className="text-red-500 text-xs mt-1 block">{errors.maxCapacity.message}</span>}
          </div>
        </div>
        
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="publish"
              type="checkbox"
              {...register('publish')}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="publish" className="font-medium text-gray-700">Publish immediately</label>
            <p className="text-gray-500">Make this event visible to all members right away.</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
        <button type="button" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}
