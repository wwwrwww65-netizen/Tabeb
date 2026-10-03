import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Building2, Check, Stethoscope } from 'lucide-react';
import { Doctor, Patient, Appointment } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  activePatient: Patient;
  onBookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

export const BookAppointmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctors,
  activePatient,
  onBookAppointment
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [date, setDate] = useState<string>('2026-10-06');
  const [time, setTime] = useState<string>('05:00 مساءً');
  const [sessionType, setSessionType] = useState<'حضوري بالعيادة' | 'جلسة عن بُعد (فيديو)'>('جلسة عن بُعد (فيديو)');
  const [sessionGoal, setSessionGoal] = useState<string>('متابعة دورية للأعراض وتعديل الخطة العلاجية');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookAppointment({
      patientId: activePatient.id,
      patientName: activePatient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date,
      time,
      type: sessionType,
      status: 'قادم',
      sessionGoal,
      paymentStatus: 'مدفوع بالكامل',
      paymentMethod: 'PayPal',
      amountSAR: selectedDoctor.priceSAR || 350,
      transactionId: 'TXN-' + Date.now()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">حجز جلسة استشارة جديدة</h2>
              <span className="text-xs text-slate-400">للمريض: {activePatient.name}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              اختر الطبيب أو المعالج:
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الجلسة:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                وقت الجلسة:
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="03:00 مساءً">03:00 مساءً</option>
                <option value="04:00 مساءً">04:00 مساءً</option>
                <option value="05:00 مساءً">05:00 مساءً</option>
                <option value="06:00 مساءً">06:00 مساءً</option>
                <option value="07:00 مساءً">07:00 مساءً</option>
                <option value="08:00 مساءً">08:00 مساءً</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              طبيعة ومكان الجلسة:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSessionType('جلسة عن بُعد (فيديو)')}
                className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  sessionType === 'جلسة عن بُعد (فيديو)'
                    ? 'bg-teal-700 text-white border-teal-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>عن بُعد (فيديو آمن)</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('حضوري بالعيادة')}
                className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  sessionType === 'حضوري بالعيادة'
                    ? 'bg-teal-700 text-white border-teal-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>حضوري بالعيادة</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              هدف الجلسة أو الأعراض المراد مناقشتها:
            </label>
            <textarea
              value={sessionGoal}
              onChange={(e) => setSessionGoal(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-sm cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم تأكيد الحجز بنجاح!</span>
                </>
              ) : (
                <span>تأكيد حجز الموعد</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
