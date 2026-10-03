import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  SlidersHorizontal, 
  Globe, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { StaffUser, DoctorSchedule } from '../types';
import { staffAuthService } from '../services/staffAuth';

interface Props {
  currentStaff: StaffUser | null;
  onScheduleUpdated?: (schedule: DoctorSchedule) => void;
}

const ALL_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const DoctorScheduleTab: React.FC<Props> = ({ currentStaff, onScheduleUpdated }) => {
  const doctorId = currentStaff?.doctorId || 'doc-hakim';
  const [schedule, setSchedule] = useState<DoctorSchedule>(() => {
    return staffAuthService.getDoctorSchedule(doctorId);
  });

  const [newSlotTime, setNewSlotTime] = useState('04:30 م');
  const [newVacationDate, setNewVacationDate] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSchedule(staffAuthService.getDoctorSchedule(doctorId));
  }, [doctorId]);

  const toggleDay = (day: string) => {
    setSchedule(prev => {
      const exists = prev.availableDays.includes(day);
      const updatedDays = exists 
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updatedDays };
    });
  };

  const addSlot = () => {
    if (!newSlotTime || schedule.timeSlots.includes(newSlotTime)) return;
    setSchedule(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlotTime]
    }));
    setNewSlotTime('');
  };

  const removeSlot = (slot: string) => {
    setSchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(s => s !== slot)
    }));
  };

  const addVacation = () => {
    if (!newVacationDate || schedule.vacationDates.includes(newVacationDate)) return;
    setSchedule(prev => ({
      ...prev,
      vacationDates: [...prev.vacationDates, newVacationDate]
    }));
    setNewVacationDate('');
  };

  const removeVacation = (dateStr: string) => {
    setSchedule(prev => ({
      ...prev,
      vacationDates: prev.vacationDates.filter(d => d !== dateStr)
    }));
  };

  const handleSave = () => {
    const updated = staffAuthService.saveDoctorSchedule(schedule);
    if (onScheduleUpdated) onScheduleUpdated(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleOnDuty = () => {
    const status = staffAuthService.toggleOnDuty(doctorId);
    setSchedule(prev => ({ ...prev, onDutyNow: status }));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                إدارة المواعيد والتواجد السريري
              </span>
              <span className="text-xs text-slate-400">Availability & Schedule Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              إدارة جدول جلساتي وأوقات التواجد
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              حدد الأيام والساعات المتاحة للحجز، الطاقة الاستيعابية اليومية، وتفضيلات الاستشارات الفورية
            </p>
          </div>

          {/* On-Duty Instant Toggle (OBS-D-016 & ADD-D-008) */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 dark:text-white">حالة المناوبة الفورية</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {schedule.onDutyNow ? 'متاح للاستشارات العاجلة الآن' : 'غير متصل بالمناوبة الفورية'}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleOnDuty}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                schedule.onDutyNow
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{schedule.onDutyNow ? 'مناوب الآن ✓' : 'تفعيل المناوبة'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Working Days & Hours */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Days Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>أيام العمل الأسبوعية المتاحة للحجز</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ALL_DAYS.map(day => {
                const isSelected = schedule.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>أوقات ومواعيد الجلسات في الأيام المحددة</span>
              </h3>
              <span className="text-xs text-slate-400">{schedule.timeSlots.length} مواعيد يومياً</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {schedule.timeSlots.map(slot => (
                <div
                  key={slot}
                  className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 rounded-xl text-xs font-bold"
                >
                  <span>{slot}</span>
                  <button
                    type="button"
                    onClick={() => removeSlot(slot)}
                    className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new Slot */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="مثال: 09:30 م أو 11:00 ص"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addSlot}
                className="px-4 py-2 bg-slate-900 dark:bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة موعد</span>
              </button>
            </div>
          </div>

          {/* Vacation / Blocked Dates */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>الإجازات والاستثناءات وتواريخ التوقف المؤقت</span>
            </h3>

            {schedule.vacationDates.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد إجازات مسجلة حالياً. جدولك متاح بالكامل.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {schedule.vacationDates.map(vDate => (
                  <div
                    key={vDate}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-bold"
                  >
                    <span>{vDate}</span>
                    <button
                      type="button"
                      onClick={() => removeVacation(vDate)}
                      className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="date"
                value={newVacationDate}
                onChange={(e) => setNewVacationDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addVacation}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة إجازة</span>
              </button>
            </div>
          </div>

        </div>

        {/* Capacity & System Preferences */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>إعدادات الطاقة الاستيعابية والمدد</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الحد الأقصى للجلسات اليومية
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={schedule.dailyCapacity}
                  onChange={(e) => setSchedule({ ...schedule, dailyCapacity: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مدة الجلسة الافتراضية (بالدقائق)
                </label>
                <select
                  value={schedule.sessionDurationMinutes}
                  onChange={(e) => setSchedule({ ...schedule, sessionDurationMinutes: parseInt(e.target.value) || 45 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value={30}>30 دقيقة (جلسة استشارية / متابعة دوائية)</option>
                  <option value={45}>45 دقيقة (جلسة علاج معرفي سلوكي قياسية)</option>
                  <option value={60}>60 دقيقة (جلسة مطولة / أسرية)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الفاصل الزمني بين الجلسات (Buffer)
                </label>
                <select
                  value={schedule.bufferMinutes}
                  onChange={(e) => setSchedule({ ...schedule, bufferMinutes: parseInt(e.target.value) || 15 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value={10}>10 دقائق استراحة</option>
                  <option value={15}>15 دقيقة استراحة وكتابة ملاحظات SOAP</option>
                  <option value={20}>20 دقيقة</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المنطقة الزمنية المعتمدة
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{schedule.timezone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>تم حفظ وتحديث الجدول بنجاح!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ وتطبيق الجدول في نظام الحجز</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
