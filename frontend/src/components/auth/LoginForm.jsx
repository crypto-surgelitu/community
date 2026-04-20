import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { ROUTES } from '../../utils/constants';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const notify = useNotification();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      notify.success('Signed in successfully');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Error is handled in context and axio interceptor, but we can do extra logic here if needed
      if(error.response?.status === 401) {
         notify.error('Invalid email or password');
      } else if (error.response?.status === 429) {
         notify.error('Too many attempts. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@swahilipothub.co.ke"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-transparent'
            }`}
          />
        </div>
        {errors.email && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-red-600 mt-1">
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-transparent'
            }`}
          />
        </div>
        {errors.password && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-red-600 mt-1">
            {errors.password.message}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="-ml-1 mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </button>
      
      <p className="text-center text-sm text-gray-600 pt-2">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
          Create one now
        </Link>
      </p>
    </form>
  );
}
