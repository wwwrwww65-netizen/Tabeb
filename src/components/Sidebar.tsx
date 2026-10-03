import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Pill, 
  Activity, 
  FileText, 
  Apple, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  Clock,
  DollarSign,
  Share2,
  FileCheck2,
  Lock
} from 'lucide-react';
import { UserRole, StaffUser } from '../types';

export type TabId = 
  | 'dashboard' 
  | 'appointments'
  | 'chats'
  | 'schedule'
  | 'psychiatry' 
  | 'prescriptions' 
  | 'scales' 
  | 'clinical_forms' 
  | 'reports'
  | 'peer_consult'
  | 'financials'
  | 'nutrition_social' 
  | 'handbook' 
  | 'access_control';

interface SidebarProps {
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;
  currentRole: UserRole;
  currentStaff?: StaffUser | null;
  pendingRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  currentStaff,
  pendingRiskCount,
}) => {
  const menuItems: { id: TabId; label: string; icon: any; badge: string | null; desc: string; roles?: UserRole[] }[] = [
    {
      id: 'dashboard',
      label: 'لوحة القيادة ومرضاي',
      icon: LayoutDashboard,
      badge: null,
      desc: 'المؤشرات وملفات المرضى النشطة'
    },
    {
      id: 'appointments',
      label: 'المواعيد وإدارة الجلسات',
      icon: Calendar,
      badge: 'اليوم',
      desc: 'تأكيد، اعتذار، وبدء Meet'
    },
    {
      id: 'chats',
      label: 'محادثات مرضاي',
      icon: MessageSquare,
      badge: 'مباشر',
      desc: 'تواصل آمن وتتبع SLA'
    },
    {
      id: 'schedule',
      label: 'إدارة جدولي والتواجد',
      icon: Clock,
      badge: null,
      desc: 'ساعات العمل والمناوبة الفورية'
    },
    {
      id: 'psychiatry',
      label: 'الطب النفسي والتشخيصات',
      icon: Stethoscope,
      badge: 'DSM-5',
      desc: 'الدليل التشخيصي والدوائي',
      roles: ['psychiatrist', 'psychologist', 'admin', 'supervisor']
    },
    {
      id: 'scales',
      label: 'المقاييس والاختبارات',
      icon: Activity,
      badge: '48 مقياس',
      desc: 'PHQ-9, GAD-7, Y-BOCS...'
    },
    {
      id: 'prescriptions',
      label: 'الوصفات الطبية E-Rx',
      icon: Pill,
      badge: currentRole === 'psychiatrist' ? 'طبيب' : 'مقيد',
      desc: 'إصدار وطباعة الوصفات المختومة'
    },
    {
      id: 'clinical_forms',
      label: 'النماذج الإكلينيكية (MSE/SOAP)',
      icon: FileText,
      badge: pendingRiskCount > 0 ? `${pendingRiskCount} خطر` : null,
      desc: 'فحص الحالة العقلية وتقييم الخطر'
    },
    {
      id: 'reports',
      label: 'التقارير والإجازات المعتمدة',
      icon: FileCheck2,
      badge: null,
      desc: 'إجازات مرضية وتقارير رسمية'
    },
    {
      id: 'peer_consult',
      label: 'استشارات الزملاء والإحالات',
      icon: Share2,
      badge: 'سري',
      desc: 'مناقشة الحالات متعددة التخصصات'
    },
    {
      id: 'financials',
      label: 'أدائي المهني والمستحقات',
      icon: DollarSign,
      badge: '75%',
      desc: 'الدخل والتقييمات وكشف الحساب'
    },
    {
      id: 'nutrition_social',
      label: 'التغذية والخدمة الاجتماعية',
      icon: Apple,
      badge: null,
      desc: 'محور الأمعاء-الدماغ والإرشاد'
    },
    {
      id: 'handbook',
      label: 'دليل كول مايند السريري',
      icon: BookOpen,
      badge: 'مرجع',
      desc: 'البروتوكولات والممارسة'
    },
    {
      id: 'access_control',
      label: 'الأمان والسرية والتدقيق',
      icon: ShieldCheck,
      badge: 'HIPAA',
      desc: 'الصلاحيات وسجلات الوصول'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shrink-0 p-4 flex flex-col justify-between transition-colors overflow-y-auto">
      
      {/* Menu items list */}
      <div className="space-y-1.5 text-right">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isRestricted = item.id === 'prescriptions' && currentRole !== 'psychiatrist' && currentRole !== 'admin';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                  isActive 
                    ? 'bg-teal-800 text-teal-100'
                    : isRestricted
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logged-in Staff Card */}
      {currentStaff && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-right">
            <img
              src={currentStaff.avatar}
              alt={currentStaff.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentStaff.name}
              </div>
              <div className="text-[10px] text-teal-700 dark:text-teal-400 truncate">
                {currentStaff.specialty}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                {currentStaff.licenseNumber}
              </div>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};
