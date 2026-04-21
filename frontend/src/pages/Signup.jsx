import { SignupForm } from '../components/auth/SignupForm';
import { motion } from 'framer-motion';

export default function Signup() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-surface-lowest rounded-[32px] shadow-editorial overflow-hidden p-10 sm:p-14">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary/20 transform -rotate-6">
                S
              </div>
            </div>
            <h1 className="text-4xl font-bold text-on-surface mb-4 leading-tight text-center">Join Us</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed text-center">
              Start your journey with Swahilipot Hub. Create your community account today.
            </p>
          </div>
          
          <SignupForm />
        </div>
        
        <p className="text-center text-xs font-bold text-on-surface-variant/40 mt-12 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Swahilipot Hub • Handcrafted for impact
        </p>
      </motion.div>
    </div>
  );
}
