import React from 'react';
import { 
  Building2,
  Heart, 
  Stethoscope, 
  ShieldCheck,
  Calendar, 
  MessageSquare,
  Sun, 
  Moon
} from 'lucide-react';
import { PortalType, ThemeMode } from '../types';

interface Props {
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  patientTab?: string;
  onSelectPatientTab?: (tab: 'departments' | 'overview' | 'appointments' | 'meds' | 'scales' | 'exercises' | 'messages') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenBooking?: () => void;
  unreadChatCount?: number;
}

export const MobileBottomNav: React.FC<Props> = ({
  activePortal,
  setActivePortal,
  patientTab = 'departments',
  onSelectPatientTab,
  theme,
  onToggleTheme,
  onOpenBooking,
  unreadChatCount = 0
}) => {
  const isDepartmentsActive = activePortal === 'patient' && patientTab === 'departments';
  const isOverviewActive = activePortal === 'patient' && patientTab === 'overview';
  const isChatActive = activePortal === 'patient' && patientTab === 'messages';
  const isDoctorActive = activePortal === 'doctor';

  return (
    <nav 
      aria-label="التنقل السفلي للأجهزة الذكية"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around shadow-lg max-w-full overflow-hidden"
    >
      
      {/* 1. Main Clinic Departments (Home) */}
      <button
        onClick={() => {
          setActivePortal('patient');
          if (onSelectPatientTab) onSelectPatientTab('departments');
        }}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          isDepartmentsActive
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/50'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
        }`}
      >
        <Building2 className={`w-5 h-5 ${isDepartmentsActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">الرئيسية</span>
      </button>

      {/* 2. Patient Personal Dashboard */}
      <button
        onClick={() => {
          setActivePortal('patient');
          if (onSelectPatientTab) onSelectPatientTab('overview');
        }}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          isOverviewActive
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/50'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
        }`}
      >
        <Heart className={`w-5 h-5 ${isOverviewActive ? 'fill-current' : ''}`} />
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">لوحتي</span>
      </button>

      {/* 3. Direct Live Chat with Doctors - With Highlight State */}
      <button
        onClick={() => {
          setActivePortal('patient');
          if (onSelectPatientTab) onSelectPatientTab('messages');
        }}
        className={`relative flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
          isChatActive
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/50 ring-1 ring-teal-500/20'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className="relative">
          <MessageSquare className={`w-5 h-5 ${isChatActive ? 'fill-current' : ''}`} />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
              {unreadChatCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">الدردشة</span>
      </button>

      {/* 4. Quick Booking Page Link */}
      {onOpenBooking && (
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">حجز موعد</span>
        </button>
      )}

      {/* 5. Doctor Portal Link */}
      <button
        onClick={() => setActivePortal('doctor')}
        className={`flex flex-col items-center justify-center min-w-[46px] min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
          isDoctorActive
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/50'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
        }`}
      >
        <Stethoscope className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">الطبيب</span>
      </button>

      {/* 6. Admin Portal Link */}
      <button
        onClick={() => setActivePortal('admin')}
        className={`flex flex-col items-center justify-center min-w-[46px] min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
          activePortal === 'admin'
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/50'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">الأدمن</span>
      </button>

      {/* 7. Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        title="تبديل الثيم الليلي/النهاري"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        <span className="text-[9px] mt-0.5">{theme === 'dark' ? 'نهاري' : 'ليلي'}</span>
      </button>

    </nav>
  );
};

