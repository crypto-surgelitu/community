import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, MessageSquare } from 'lucide-react';
import { sentimentEmoji } from '../../utils/helpers';
import { useNotification } from '../../context/NotificationContext';

export function FeedbackForm({ onSubmitComplete }) {
  const notify = useNotification();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sentiment, setSentiment] = useState('');
  
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  const handleManualSubmit = async () => {
    if (rating === 0) {
      notify.error('Please provide a star rating.');
      return;
    }
    if (!sentiment) {
      notify.error('Please tell us how you felt (Sentiment).');
      return;
    }
    
    try {
      // await feedbackService.submitFeedback(eventId, { ...data, rating, sentiment, eventId });
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      notify.success('Thank you for your feedback!');
      reset();
      setRating(0);
      setSentiment('');
      if (onSubmitComplete) onSubmitComplete();
    } catch {
      notify.error('Failed to submit feedback. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleManualSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">How was the event?</h3>
        <p className="text-sm text-gray-500 mt-1">Your honest feedback helps us improve Swahilipot Hub experiences.</p>
      </div>

      <div className="space-y-6">
        {/* Q1: 5-star rating */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Overall Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`transition-all p-1 ${
                  (hoverRating || rating) >= star ? 'text-amber-400 scale-110' : 'text-gray-200 hover:text-gray-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Sentiment */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block text-center">How did it make you feel? *</label>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {Object.entries(sentimentEmoji).map(([key, emoji]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSentiment(key)}
                className={`text-3xl p-3 border-2 rounded-xl transition-all ${
                  sentiment === key 
                  ? 'border-blue-500 bg-blue-50 scale-110 shadow-sm' 
                  : 'border-transparent hover:border-gray-200 bg-gray-50 opacity-60 hover:opacity-100'
                }`}
                title={key.replace('_', ' ')}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Text feedback */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" /> Additional Comments (Optional)
          </label>
          <textarea
            {...register('text')}
            rows="3"
            placeholder="Tell us what you liked or what we can improve..."
            className="w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900 bg-gray-50 focus:bg-white transition-colors"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-sm transition-all shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
