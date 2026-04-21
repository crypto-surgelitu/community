import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function MetricCard({ title, value, icon, trend, colorClass = "text-blue-600" }) {
  const [hasStarted, setHasStarted] = useState(false);
  const springValue = useSpring(0, { duration: 1500, bounce: 0 });
  
  useEffect(() => {
    springValue.set(value);
    const timer = setTimeout(() => setHasStarted(true), 100);
    return () => clearTimeout(timer);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => Math.round(current));

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="card-editorial p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-on-surface flex items-center tracking-tighter">
            {hasStarted ? <motion.span>{displayValue}</motion.span> : 0}
          </h3>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider">
          <span className={`px-2 py-1 rounded-md ${trend.isPositive ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-on-surface-variant/50 ml-3">Growth Index</span>
        </div>
      )}
    </motion.div>
  );
}
