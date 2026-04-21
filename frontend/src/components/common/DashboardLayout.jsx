import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-on-surface relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-on-surface/20 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar key={location.pathname} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 h-full w-full min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 h-20 bg-surface-low shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white font-bold">S</div>
            <span className="font-display font-bold tracking-tight text-primary">Hub Manager</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-surface-lowest transition"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </header>

        <Navbar />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-12 bg-surface-bright">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full max-w-[1440px]"
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
