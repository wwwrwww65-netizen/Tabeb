import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  PhoneCall, 
  ExternalLink, 
  User, 
  Search, 
  Filter, 
  AlertCircle, 
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Appointment, Patient, StaffUser } from '../types';

interface Props {
  appointments: Appointment[];
  patients: Patient[];
  currentStaff: StaffUser | null;
  onUpdateAppointmentStatus: (aptId: string, newStatus: 'مؤكد' | 'قادم' | 'مكتمل' | 'ملغي', notes?: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenChatWithPatient: (patient: Patient) => void;
}

export const DoctorAppointmentsTab: React.FC<Props> = ({
  appointments,
  patients,
  currentStaff,
  onUpdateAppointmentStatus,
  onSelectPatient,
  onOpenChatWithPatient
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'today' | 'upcoming' | 'completed' | 'cancelled'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [apologyModalApt, setApologyModalApt] = useState<Appointment | null>(null);
  const [apologyReason, setApologyReason] = useState('اعتذار طارئ لظرف طبي، تم فتح خيارات إعادة الجدولة');
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('05:00 م');
  const [remindSuccessAptId, setRemindSuccessAptId] = useState<string | null>(null);

  // Filter doctor's appointments
  const doctorAppointments = appointments.filter(apt => 
    apt.doctorId === currentStaff?.doctorId || !apt.doctorId || currentStaff?.role === 'reception' || currentStaff?.role === 'supervisor'
  );

  const searched = doctorAppointments.filter(apt => 
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.sessionGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = searched.filter(apt => apt.date === todayStr || apt.status === 'قادم');
  const upcomingAppointments = searched.filter(apt => apt.status === 'مؤكد' || apt.status === 'قادم');
  const completedAppointments = searched.filter(apt => apt.status === 'مكتمل');
  const cancelledAppointments = searched.filter(apt => apt.status === 'ملغي');

  const displayedList = activeSubTab === 'today'
    ? todayAppointments
    : activeSubTab === 'upcoming'
    ? upcomingAppointments
    : activeSubTab === 'completed'
    ? completedAppointments
    : cancelledAppointments;

  const handleRemindPatient = (apt: Appointment) => {
    setRemindSuccessAptId(apt.id);
    setTimeout(() => setRemindSuccessAptId(null), 2500);
  };

  const handleConfirmApology = () => {
    if (!apologyModalApt) return;
    onUpdateAppointmentStatus(apologyModalApt.id, 'ملغي', `اعتذار من المختص: ${apologyReason}`);
    setApologyModalApt(null);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleApt || !newRescheduleDate) return;
    onUpdateAppointmentStatus(rescheduleApt.id, 'مؤكد', `تمت إعادة الجدولة إلى: ${newRescheduleDate} - ${newRescheduleTime}`);
    setRescheduleApt(null);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                منظومة إدارة الجلسات والحضور
              </span>
              <span className="text-xs text-slate-400">Clinical Sessions & Attendance</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              جدول مواعيد وجلسات العيادة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تأكيد، اعتذار، إعادة جدولة، وبدء جلسات الفيديو المباشرة عبر Google Meet مع إشعارات المريض الآلية
            </p>
          </div>

          {/* Next upcoming appointment card */}
          {todayAppointments.length > 0 && (
            <div className="bg-gradient-to-l from-teal-900 to-teal-800 text-white p-4 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">
                <Clock className="w-5 h-5 text-teal-300" />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-teal-200 font-bold">الجلسة القادمة لليوم:</div>
                <div className="text-xs font-bold">{todayAppointments[0].patientName}</div>
                <div className="text-[11px] text-teal-100 font-mono mt-0.5">{todayAppointments[0].time}</div>
              </div>
              <a
                href={todayAppointments[0].meetUrl || "https://meet.google.com/new"}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-900 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
              >
                <Video className="w-3.5 h-3.5 text-teal-700" />
                <span>دخول</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sub Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('today')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'today'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            مواعيد اليوم ({todayAppointments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('upcoming')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'upcoming'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            المواعيد القادمة ({upcomingAppointments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'completed'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            المكتملة ({completedAppointments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('cancelled')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cancelled'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الملغاة والاعتذارات ({cancelledAppointments.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الهدف السريري..."
            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
        </div>

      </div>

      {/* Appointments Cards List */}
      {displayedList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <p>لا توجد مواعيد تطابق الفلتر المحدد حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map(apt => {
            const patient = patients.find(p => p.id === apt.patientId) || patients[0];
            const isCompleted = apt.status === 'مكتمل';
            const isCancelled = apt.status === 'ملغي';

            return (
              <div
                key={apt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 rounded-2xl p-5 shadow-2xs transition-all space-y-4 text-right flex flex-col justify-between"
              >
                <div>
                  {/* Top line */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                        {apt.patientName[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{apt.patientName}</h4>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {apt.date} · {apt.time}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : isCancelled
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  {/* Goal & Details */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>الهدف من الجلسة:</strong> {apt.sessionGoal}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>النوع: <strong>{apt.type}</strong></span>
                      <span>·</span>
                      <span>الدفع: <strong className="text-emerald-600">{apt.paymentStatus} ({apt.amountSAR} ر.س)</strong></span>
                    </div>

                    {apt.notes && (
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-600 dark:text-slate-300">
                        ملاحظة: {apt.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Launch Meet */}
                    <a
                      href={apt.meetUrl || "https://meet.google.com/new"}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      title="بدء الجلسة في موعدها"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>بدء الجلسة (Meet)</span>
                    </a>

                    {/* Chat */}
                    <button
                      type="button"
                      onClick={() => onOpenChatWithPatient(patient)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs transition-colors"
                      title="فتح المحادثة الفورية مع المريض"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Remind Patient (OBS-D-019) */}
                    <button
                      type="button"
                      onClick={() => handleRemindPatient(apt)}
                      className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="إرسال تذكير فوري للمريض عبر الواتساب"
                    >
                      <Send className="w-3 h-3" />
                      <span>{remindSuccessAptId === apt.id ? 'تم التذكير ✓' : 'تذكير المريض'}</span>
                    </button>
                  </div>

                  {/* Status Modifiers */}
                  <div className="flex items-center gap-1">
                    {!isCompleted && !isCancelled && (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'مكتمل', 'تم حضور الجلسة وتوثيقها')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="تحديد الجلسة كمكتملة بعد الانتهاء"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>إتمام ✓</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleApt(apt);
                            setNewRescheduleDate(apt.date);
                          }}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                          title="إعادة جدولة الموعد"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setApologyModalApt(apt)}
                          className="px-2 py-1 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-900"
                          title="اعتذار عن الموعد"
                        >
                          اعتذار
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>منجزة</span>
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apology Reason Modal */}
      {apologyModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>الاعتذار عن الموعد وإشعار المريض</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              سيتم إلغاء موعد المريض <strong>{apologyModalApt.patientName}</strong> وإرسال إشعار فوري له مع رابط لإعادة الحجز في موعد آخر يناسبه.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                سبب الاعتذار (يظهر للمريض في الإشعار):
              </label>
              <textarea
                rows={2}
                value={apologyReason}
                onChange={(e) => setApologyReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApologyModalApt(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-bold"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmApology}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                تأكيد الاعتذار والإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-teal-600" />
              <span>إعادة جدولة موعد المريض</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التاريخ الجديد
                </label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوقت الجديد
                </label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="03:00 م">03:00 م</option>
                  <option value="04:00 م">04:00 م</option>
                  <option value="05:00 م">05:00 م</option>
                  <option value="06:30 م">06:30 م</option>
                  <option value="08:00 م">08:00 م</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
              >
                حفظ وإشعار المريض بالموعد الجديد
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
