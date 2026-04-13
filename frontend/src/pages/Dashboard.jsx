import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ProgramChart } from '../components/dashboard/ProgramChart';
import { RecentEventsList } from '../components/dashboard/RecentEventsList';
import { AtRiskMembersList } from '../components/dashboard/AtRiskMembersList';
import { Users, CalendarDays, TrendingUp, MessageCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}. Here is what's happening at Swahilipot Hub.</p>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-white border text-sm border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm transition-all">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm shadow-blue-500/20 transition-all text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Total Members" 
            value={1425} 
            icon={<Users className="w-6 h-6 text-blue-600" />}
            colorClass="text-blue-600"
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Active Programs" 
            value={24} 
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            colorClass="text-green-600"
            trend={{ value: 4.2, isPositive: true }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Events This Month" 
            value={18} 
            icon={<CalendarDays className="w-6 h-6 text-amber-500" />}
            colorClass="text-amber-500"
            trend={{ value: 2.1, isPositive: false }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Avg Satisfaction" 
            value={4.6} 
            icon={<MessageCircle className="w-6 h-6 text-purple-600" />}
            colorClass="text-purple-600"
            trend={{ value: 0.2, isPositive: true }}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ProgramChart />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <RecentEventsList />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-2">
        <AtRiskMembersList />
      </motion.div>
      
    </motion.div>
  );
}
