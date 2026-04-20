import { LoginForm } from '../components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 pb-6 border-b border-gray-100 bg-slate-50">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                S
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Welcome Back</h2>
            <p className="text-center text-gray-500 mt-2 text-sm">
              Sign in to manage the Swahilipot Hub Community
            </p>
          </div>
          <div className="p-8 pt-6">
            <LoginForm />
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          &copy; {new Date().getFullYear()} Swahilipot Hub. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
