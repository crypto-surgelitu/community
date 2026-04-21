import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Mail, Phone, MapPin, Loader2, Save } from 'lucide-react';
import { memberService } from '../../services/memberService';
import { useNotification } from '../../context/NotificationContext';

const memberSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number (10-15 digits)'),
  zoneId: z.string().uuid('Please select a zone'),
});

export function AddMemberModal({ isOpen, onClose, onMemberAdded }) {
  const notify = useNotification();
  const [zones, setZones] = useState([]);
  const [loadingZones, setLoadingZones] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: 'active',
    }
  });

  useEffect(() => {
    if (isOpen) {
      const fetchZones = async () => {
        try {
          setLoadingZones(true);
          const data = await memberService.getZones();
          setZones(data);
        } catch {
          notify.error('Failed to load zones');
        } finally {
          setLoadingZones(false);
        }
      };
      fetchZones();
    } else {
      reset();
    }
  }, [isOpen, reset, notify]);

  const onSubmit = async (data) => {
    try {
      // Clean up empty email
      const payload = { ...data };
      if (!payload.email) delete payload.email;
      
      await memberService.create(payload);
      notify.success('Member added successfully!');
      onMemberAdded();
      onClose();
    } catch (err) {
      notify.error(err.response?.data?.error || 'Failed to add member');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Add New Member
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 transition text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g. Jane Foster"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="jane@example.com"
                    className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+254..."
                    className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Region/Zone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  {...register('zoneId')}
                  disabled={loadingZones}
                  className={`block w-full pl-10 pr-3 py-2 bg-white border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.zoneId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">{loadingZones ? 'Loading zones...' : 'Select a zone...'}</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              {errors.zoneId && <p className="mt-1 text-xs text-red-600">{errors.zoneId.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-70 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
