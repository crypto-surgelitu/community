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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@swahilipothub.co.ke"
            className={`block w-full pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium ${
              errors.email ? 'bg-red-50 text-red-900' : 'bg-surface-low text-on-surface focus:bg-surface-lowest'
            }`}
          />
        </div>
        {errors.email && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-red-600 mt-1 font-bold ml-1">
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
            <label htmlFor="password" className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
            <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`block w-full pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium ${
              errors.password ? 'bg-red-50 text-red-900' : 'bg-surface-low text-on-surface focus:bg-surface-lowest'
            }`}
          />
        </div>
        {errors.password && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs text-red-600 mt-1 font-bold ml-1">
            {errors.password.message}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-gradient flex justify-center items-center py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4 font-display"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="-ml-1 mr-3 h-5 w-5" />
            Sign In
          </>
        )}
      </button>
      
      <p className="text-center text-sm text-on-surface-variant font-medium pt-2">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-primary hover:underline transition-all">
          Create one now
        </Link>
      </p>
    </form>
  );
}
