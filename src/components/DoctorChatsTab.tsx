import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ClipboardCheck, 
  Activity, 
  Clock, 
  User, 
  Search, 
  PhoneCall,
  ExternalLink,
  Lock,
  Smile,
  AlertTriangle
} from 'lucide-react';
import { Patient, ChatMessage, StaffUser } from '../types';

interface Props {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, patientId: string) => void;
  currentStaff: StaffUser | null;
  onOpenSendScaleModal?: (patient: Patient) => void;
  onOpenSendExerciseModal?: (patient: Patient) => void;
}

export const DoctorChatsTab: React.FC<Props> = ({
  patients,
  activePatient,
  onSelectPatient,
  messages,
  onSendMessage,
  currentStaff,
  onOpenSendScaleModal,
  onOpenSendExerciseModal
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [quickTemplate, setQuickTemplate] = useState('');
  const [emergencyAlertText, setEmergencyAlertText] = useState('');

  // Quick templates for fast, empathetic replies
  const QUICK_TEMPLATES = [
    'أهلاً بك. اطلعت على سجل مشاعرك الأخير وسنناقشه في جلستنا القادمة بإذن الله.',
    'يرجى تعبئة مقياس استبيان الاكتئاب (PHQ-9) المرفق لمتابعة تطور الخطة العلاجية.',
    'ممتاز جداً! استمر على تمرين التنفس البطني ثلاث مرات يومياً كما اتفقنا.',
    'تم تجديد وصفتك الدوائية المعتمدة وستجدها في تبويب الوصفات بملفك الشخصي.'
  ];

  // Emergency keywords
  const EMERGENCY_KEYWORDS = ['انتحار', 'أموت', 'أنهي حياتي', 'إيذاء', 'أقتل نفسي', 'سكين', 'سلاح'];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.fileNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientMessages = messages.filter(m => 
    m.patientId === activePatient.id || (!m.patientId && m.doctorId === currentStaff?.doctorId)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim() || quickTemplate;
    if (!text) return;

    // Check emergency keywords in patient or doctor chat
    const hasEmergency = EMERGENCY_KEYWORDS.some(k => text.includes(k));
    if (hasEmergency) {
      setEmergencyAlertText('تنبيه أمان سريري: تم رصد مفردات خطورة عالية في نص المحادثة. يرجى تفعيل بروتوكول الأمان وفتح تقييم C-SSRS.');
    } else {
      setEmergencyAlertText('');
    }

    onSendMessage(text, activePatient.id);
    setInputText('');
    setQuickTemplate('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden text-right flex flex-col md:flex-row h-[750px] transition-colors">
      
      {/* Sidebar: Patient Conversations List */}
      <div className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-900/60">
        
        {/* Search header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>محادثات مرضاي المباشرة</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
              {filteredPatients.length} محادثة
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو رقم الملف..."
              className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* SLA Notice (ADD-D-002) */}
        <div className="px-3.5 py-2 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900 text-[10px] text-teal-800 dark:text-teal-300 flex items-center justify-between">
          <span>⏱️ زمن الرد المستهدف للمستشار (SLA):</span>
          <span className="font-bold">أقل من ساعتين</span>
        </div>

        {/* Patients list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredPatients.map(patient => {
            const isSelected = patient.id === activePatient.id;
            return (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`w-full p-3 text-right flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-r-4 border-teal-600' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
                    {patient.name[0]}
                  </div>
                  {patient.riskLevel === 'مرتفع' || patient.riskLevel === 'حرج' ? (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" title="مستوى خطورة مرتفع"></span>
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {patient.name}
                    </strong>
                    <span className="text-[10px] text-slate-400 shrink-0">اليوم</span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {patient.primaryDiagnosis}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-teal-700 dark:text-teal-400">
                    <span className="font-mono">{patient.fileNumber}</span>
                    <span>·</span>
                    <span>{patient.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        
        {/* Chat Top Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-sm shrink-0">
              {activePatient.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activePatient.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {activePatient.fileNumber}
                </span>
                {activePatient.riskLevel === 'متوسط' || activePatient.riskLevel === 'مرتفع' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>خطر {activePatient.riskLevel}</span>
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activePatient.primaryDiagnosis} · متصل الآن
              </p>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenSendScaleModal && (
              <button
                type="button"
                onClick={() => onOpenSendScaleModal(activePatient)}
                className="px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="إرسال مقياس نفسي للمريض لتعبئته"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إرسال مقياس</span>
              </button>
            )}

            {onOpenSendExerciseModal && (
              <button
                type="button"
                onClick={() => onOpenSendExerciseModal(activePatient)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="إرسال تمرين معرفي سلوكي للمريض"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إسناد واجب CBT</span>
              </button>
            )}

            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="بدء جلسة فيديو فورية"
            >
              <Video className="w-3.5 h-3.5" />
              <span>بدء الجلسة (Meet)</span>
            </a>
          </div>
        </div>

        {/* Emergency keyword warning banner if detected */}
        {emergencyAlertText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{emergencyAlertText}</span>
            </div>
            <button
              onClick={() => setEmergencyAlertText('')}
              className="text-[10px] underline font-bold"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
          
          <div className="text-center my-2">
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
              بداية المحادثة الآمنة والمشفرة مع {activePatient.name}
            </span>
          </div>

          {patientMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>لا توجد رسائل سابقة. يمكنك إرسال ترحيب أو توصية للمريض الآن.</p>
            </div>
          ) : (
            patientMessages.map((msg, idx) => {
              const isDoctor = msg.senderRole === 'doctor' || msg.senderName.includes('د.') || msg.senderName.includes('أ.');
              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                    <span>{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp || 'الآن'}</span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isDoctor
                        ? 'bg-teal-700 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Templates Selector */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-500 shrink-0">قوالب سريعة:</span>
          {QUICK_TEMPLATES.map((tpl, tIdx) => (
            <button
              key={tIdx}
              onClick={() => setInputText(tpl)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 truncate max-w-[200px] shrink-0 cursor-pointer"
            >
              {tpl}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="إرفاق ملف أو تقرير طبي"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAudioRecording(!isAudioRecording)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isAudioRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="تسجيل رسالة صوتية للمريض"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`اكتب رسالة علاجية للمريض ${activePatient.name}...`}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
