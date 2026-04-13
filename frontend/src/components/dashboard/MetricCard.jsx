import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function MetricCard({ title, value, icon, trend, colorClass = "text-blue-600" }) {
  const [hasStarted, setHasStarted] = useState(false);
  const springValue = useSpring(0, { duration: 1500, bounce: 0 });
  
  useEffect(() => {
    springValue.set(value);
    setHasStarted(true);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => Math.round(current));

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 flex items-center">
            {hasStarted ? <motion.span>{displayValue}</motion.span> : 0}
          </h3>
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      )}
      
      <div className={`absolute bottom-0 left-0 h-1 w-full opacity-20 bg-current ${colorClass}`}></div>
    </motion.div>
  );
}
