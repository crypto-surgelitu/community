import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ProgramChart({ data }) {
  const defaultData = [
    { name: 'Jan', active: 110, completed: 85 },
    { name: 'Feb', active: 130, completed: 90 },
    { name: 'Mar', active: 155, completed: 105 },
    { name: 'Apr', active: 180, completed: 135 },
    { name: 'May', active: 220, completed: 175 },
    { name: 'Jun', active: 250, completed: 190 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Program Engagement</h3>
        <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-blue-500 focus:border-blue-500 py-1">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="active" name="Active Members" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed Programs" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
