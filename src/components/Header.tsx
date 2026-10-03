import React, { useState } from 'react';
import { 
  Brain, 
  UserCheck, 
  HelpCircle, 
  ShieldCheck,
  Stethoscope,
  Activity,
  Plus,
  Moon,
  Sun,
  Heart,
  Settings,
  Bell,
  MessageSquare
} from 'lucide-react';
import { UserRole, Patient, PortalType, ThemeMode, AppNotification } from '../types';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activePatient: Patient | null;
  patients: Patient[];
  notifications?: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  onOpenChat?: () => void;
  onOpenAppointments?: () => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenOverview: () => void;
  onOpenQuickScale: () => void;
  onOpenNewPrescription: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activePortal,
  setActivePortal,
  theme,
  onToggleTheme,
  activePatient,
  patients,
  notifications = [],
  onMarkAllNotificationsRead,
  onOpenChat,
  onOpenAppointments,
  onSelectPatient,
  onOpenOverview,
  onOpenQuickScale,
  onOpenNewPrescription,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/15">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                  Cool<span className="text-teal-600 dark:text-teal-400">Mind</span>
                </span>
                <span className="hidden xs:inline text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 shrink-0">
                  منظومة متكاملة
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                بوابات المريض · الطبيب · الإدارة و API
              </p>
            </div>
          </div>

          {/* Desktop Portals Navigation Hub */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActivePortal('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'patient'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activePortal === 'patient' ? 'fill-current' : ''}`} />
              <span>بوابة المريض</span>
            </button>

            <button
              onClick={() => setActivePortal('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'doctor'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>عيادة الطبيب</span>
            </button>

            <button
              onClick={() => setActivePortal('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'admin'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الأدمن و API</span>
            </button>
          </div>

          {/* Controls: Notifications, Chat, Theme Switcher, Quick Modal, Patient Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Quick Chat Direct Access Button */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200 dark:border-teal-800 cursor-pointer"
                title="فتح المحادثة والدردشة مع الطبيب"
              >
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">الدردشة</span>
              </button>
            )}

            {/* Notifications Bell Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="الإشعارات والتنبيهات"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Popover */}
              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAllAsRead={() => {
                  if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
                }}
                onOpenChat={() => {
                  if (onOpenChat) onOpenChat();
                }}
                onOpenAppointments={() => {
                  if (onOpenAppointments) onOpenAppointments();
                }}
              />
            </div>

            {/* Active Patient Switcher (Doctor view) */}
            {activePortal === 'doctor' && (
              <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">
                  {activePatient ? activePatient.name[0] : 'م'}
                </div>
                <select 
                  value={activePatient?.id || ''} 
                  onChange={(e) => {
                    const p = patients.find(item => item.id === e.target.value);
                    if (p) onSelectPatient(p);
                  }}
                  aria-label="اختيار المريض النشط"
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="dark:bg-slate-800">
                      {p.name} ({p.fileNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={theme === 'dark' ? "التحويل للوضع النهاري (Light Mode)" : "التحويل للوضع الليلي (Dark Mode)"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* What is this app button */}
            <button
              onClick={onOpenOverview}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200 dark:border-teal-800 cursor-pointer"
              title="شرح هيكلية وهدف المنصة"
            >
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">هدف المنصة</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
