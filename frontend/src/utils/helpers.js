// Format date: 2026-04-12 → "Apr 12, 2026"
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time: 14:30 → "2:30 PM"
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Get engagement level: 15 events → "High"
export const getEngagementLevel = (eventCount) => {
  if (eventCount >= 10) return { level: 'high', bars: 3, color: '#10B981' }; // green-500
  if (eventCount >= 5) return { level: 'medium', bars: 2, color: '#F59E0B' }; // amber-500
  return { level: 'low', bars: 1, color: '#EF4444' }; // red-500
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100';
};

// Sentiment to emoji
export const sentimentEmoji = {
  'loved_it': '😍',
  'good': '😊',
  'ok': '😐',
  'didnt_enjoy': '😕',
  'hated_it': '😠',
};
