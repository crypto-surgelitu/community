import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Loader2, Mail, Lock, User, MapPin, Briefcase } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  zone: z.enum(['Kisauni', 'Nyali', 'Likoni', 'Mvita', 'Changamwe', 'Jomvu'], {
    required_error: 'Please select a zone.'
  }),
  role: z.enum(['case_manager', 'area_manager', 'mentor', 'mentee', 'youth_engagement_leader', 'community_engagement_leader', 'community_engagement_associate', 'assistant_project_associate', 'other']).default('case_manager'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export function SignupForm() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      notify.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      // Prioritize specific backend error messages (e.g., "User already exists")
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create account. Please try again.';
      
      notify.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('name')}
            type="text"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('email')}
            type="email"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
            placeholder="you@swahilipot.org"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Zone</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <select
            {...register('zone')}
            className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.zone ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
          >
            <option value="">Select your sub-county...</option>
            <option value="Kisauni">Kisauni</option>
            <option value="Nyali">Nyali</option>
            <option value="Likoni">Likoni</option>
            <option value="Mvita">Mvita</option>
            <option value="Changamwe">Changamwe</option>
            <option value="Jomvu">Jomvu</option>
          </select>
        </div>
        {errors.zone && <p className="mt-1 text-sm text-red-600">{errors.zone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <select
            {...register('role')}
            className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.role ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
          >
            <option value="case_manager">Case Manager</option>
            <option value="area_manager">Area Manager</option>
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
            <option value="youth_engagement_leader">Youth Engagement Leader</option>
            <option value="community_engagement_leader">Community Engagement Leader</option>
            <option value="community_engagement_associate">Community Engagement Associate</option>
            <option value="assistant_project_associate">Assistant Project Associate</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('password')}
            type="password"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('confirmPassword')}
            type="password"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirmPassword ? 'border-red-300 ring-red-100' : 'border-gray-200'
            }`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Creating account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>

      <p className="text-center text-sm text-gray-600 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
          Sign In here
        </Link>
      </p>
    </form>
  );
}
