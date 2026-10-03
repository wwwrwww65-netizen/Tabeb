import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Stethoscope, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Users
} from 'lucide-react';
import { StaffUser, UserRole } from '../types';
import { DEFAULT_STAFF_USERS, staffAuthService } from '../services/staffAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStaff: StaffUser | null;
  onStaffLogin: (user: StaffUser) => void;
  onOpenJoinTeamModal?: () => void;
}

export const StaffAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStaff,
  onStaffLogin,
  onOpenJoinTeamModal
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('psychiatrist');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (user: StaffUser) => {
    staffAuthService.switchStaffUser(user.id);
    onStaffLogin(user);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني للمختص');
      return;
    }
    const user = staffAuthService.loginStaff(email, password);
    user.role = selectedRole;
    onStaffLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-900 via-teal-950 to-slate-900 text-white p-6 border-b border-teal-900/40 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 font-bold border border-teal-700/60">
                  بوابة الكادر الطبي المعتمد
                </span>
                <span className="text-xs text-slate-400">HIPAA & RBAC Secure</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">تسجيل دخول المختص والمعالج</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                الوصول الآمن لعيادة الطبيب، ملفات المرضى، وجدول المواعيد المعتمد
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Demo Switcher with official 6 specialists */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>اختر حساب المختص المعتمد (فريق كول مايند الرسمي):</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">دخول فوري بضغطة زر</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEFAULT_STAFF_USERS.map(staff => (
                <button
                  key={staff.id}
                  onClick={() => handleQuickLogin(staff)}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                    currentStaff?.id === staff.id
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <img 
                    src={staff.avatar} 
                    alt={staff.name} 
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-xs font-bold truncate">{staff.name}</strong>
                      {currentStaff?.id === staff.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{staff.specialty}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-teal-700 dark:text-teal-300">
                      <span className="font-mono">{staff.licenseNumber}</span>
                      <span>·</span>
                      <span className="font-semibold">
                        {staff.role === 'psychiatrist' ? 'طبيب نفسي' : staff.role === 'psychologist' ? 'معالج نفسي' : staff.role === 'nutritionist' ? 'تغذية' : staff.role === 'social_worker' ? 'خدمة اجتماعية' : staff.role === 'supervisor' ? 'مشرف إكلينيكي' : 'استقبال'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 shrink-0">أو تسجيل الدخول المخصص</span>
          </div>

          {/* Custom Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  البريد الإلكتروني المهني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@coolmind.clinic"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الدور المهني والصلاحيات (RBAC Role)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="psychiatrist">طبيب نفسي واستشاري (Psychiatrist - صلاحية الوصفات والتشخيص)</option>
                <option value="psychologist">أخصائي ومعالج نفسي (Psychologist - مقاييس وجلسات CBT)</option>
                <option value="nutritionist">أخصائي تغذية علاجية (Nutritionist - خطط ومحور الأمعاء-الدماغ)</option>
                <option value="social_worker">أخصائي خدمة اجتماعية وإرشاد أسري (Social Worker)</option>
                <option value="supervisor">مشرف إكلينيكي (Clinical Supervisor - مراجعة واعتماد الجودة)</option>
                <option value="reception">موظف استقبال وتنسيق مواعيد (Reception)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>دخول عيادة المختص والتحقق</span>
            </button>
          </form>

          {/* Join Our Team Banner (ADD-D-003, ADD-D-015, ADD-D-016) */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">هل أنت استشاري أو معالج نفسي مرخص؟</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  انضم لفريق كول مايند: دوام مرن، دخل إضافي ممتاز (75%)، وإشراف إكلينيكي مستمر.
                </p>
              </div>
            </div>

            {onOpenJoinTeamModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenJoinTeamModal();
                }}
                className="px-3.5 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                انضم لفريقنا
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
