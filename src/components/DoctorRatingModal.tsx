import React, { useState } from 'react';
import { Star, X, Check, ShieldCheck } from 'lucide-react';
import { Doctor } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onSubmitRating: (rating: number, comment: string) => void;
}

export const DoctorRatingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctor,
  onSubmitRating
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-black text-base text-slate-900 dark:text-slate-100">شكراً لتقييمك الصادق!</h4>
            <p className="text-xs text-slate-500">تم تسجيل رأيك لمساعدة الآخرين في اختيار المختص الأنسب.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-teal-500" />
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100">تقييم الجلسة مع {doctor.name}</h3>
              <p className="text-xs text-slate-500">رأيك يظهر باسمك المستعار فقط وبسرية تامة</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تعليقك حول الجلسة (اختياري):
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="كيف كانت تجربتك مع المختص ومدى استفادتك من الجلسة؟"
                rows={3}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              إرسال التقييم
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
