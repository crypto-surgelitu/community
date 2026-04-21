import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ProgramChart } from '../components/dashboard/ProgramChart';
import { RecentEventsList } from '../components/dashboard/RecentEventsList';
import { AtRiskMembersList } from '../components/dashboard/AtRiskMembersList';
import { Users, CalendarDays, TrendingUp, MessageCircle, Loader2 } from 'lucide-react';
import { memberService } from '../services/memberService';
import { eventService } from '../services/eventService';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';

export default function Dashboard() {
  const { user } = useAuth();
  const notify = useNotification();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activePrograms: 12,
    eventsThisMonth: 0,
    satisfaction: 4.8
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [atRiskMembers, setAtRiskMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [membersData, eventsData, programsData, atRiskData] = await Promise.all([
        memberService.getAll(),
        eventService.getAll(),
        dashboardService.getPrograms(),
        dashboardService.getAtRiskMembers()
      ]);
      
      setStats(prev => ({
        ...prev,
        totalMembers: membersData.total || 0,
        eventsThisMonth: eventsData.events?.length || 0,
      }));
      setRecentEvents(eventsData.events || []);
      setProgramData(programsData);
      setAtRiskMembers(atRiskData);
    } catch {
      notify.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-on-surface tracking-tighter leading-none mb-4">Work Hub</h1>
          <p className="text-on-surface-variant font-medium text-lg">
            Welcome back, <span className="text-primary font-bold">{user?.name || 'Admin'}</span>. Here is the pulse of the community today.
          </p>
        </div>
        
        <div className="flex gap-4">
          <select className="bg-surface-low text-sm text-on-surface font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="btn-gradient py-3 px-8 rounded-full shadow-lg shadow-primary/20 text-sm font-bold">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Total Members" 
            value={stats.totalMembers} 
            icon={<Users className="w-6 h-6 text-white" />}
            colorClass="bg-primary shadow-xl shadow-primary/20"
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Active Programs" 
            value={stats.activePrograms} 
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            colorClass="bg-secondary shadow-xl shadow-secondary/20"
            trend={{ value: 4.2, isPositive: true }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Events Summary" 
            value={stats.eventsThisMonth} 
            icon={<CalendarDays className="w-6 h-6 text-white" />}
            colorClass="bg-amber-500 shadow-xl shadow-amber-500/20"
            trend={{ value: 2.1, isPositive: false }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Avg Satisfaction" 
            value={stats.satisfaction} 
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            colorClass="bg-purple-600 shadow-xl shadow-purple-600/20"
            trend={{ value: 0.2, isPositive: true }}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="card-editorial p-10 h-full">
            <h3 className="text-2xl font-bold mb-8 text-on-surface">Program Performance</h3>
            <ProgramChart 
              data={programData.map(p => ({
                name: p.name,
                active: p.totalAttendance,
                completed: p.eventsTotal
              }))}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="card-editorial p-8 h-full">
            <h3 className="text-xl font-bold mb-6 text-on-surface">Recent Activity</h3>
            <RecentEventsList events={recentEvents} />
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <div className="card-editorial p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-on-surface">At-Risk Members</h3>
            <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest">Action Required</span>
          </div>
          <AtRiskMembersList members={atRiskMembers} />
        </div>
      </motion.div>
      
    </motion.div>
  );
}
