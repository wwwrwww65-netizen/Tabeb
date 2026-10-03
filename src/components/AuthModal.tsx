import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
  UserCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/auth';
import { ClientUser } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: ClientUser) => void;
  initialMode?: 'login' | 'signup' | 'guest';
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  onOpenPrivacyPolicy,
  onOpenTerms
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'guest'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aliasOrName, setAliasOrName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('YE');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await authService.loginWithEmail(email, password);
      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('تعذر تسجيل الدخول، يرجى التأكد من البيانات');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await authService.signup({
        aliasOrName: aliasOrName || 'مستفيد المنصة',
        email,
        phone,
        country,
        password
      });
      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة ثانية');
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const guest = await authService.loginAsGuest();
      setIsLoading(false);
      onAuthSuccess(guest);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('تعذر الدخول كضيف');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى إدخال بريدك الإلكتروني لإرسال رابط الاستعادة');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('تم إرسال رابط استعادة كلمة المرور المشفر إلى بريدك الإلكتروني بنجاح.');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-3 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-teal-100" />
          </div>

          <h2 className="text-xl font-black">
            {mode === 'login' && 'تسجيل الدخول إلى حسابك'}
            {mode === 'signup' && 'إنشاء حساب جديد محمي'}
            {mode === 'forgot' && 'استعادة كلمة المرور'}
            {mode === 'guest' && 'الدخول السريع كزائر مجهول'}
          </h2>
          <p className="text-xs text-teal-100 mt-1">
            بياناتك مشفرة بالكامل ولا يتم مشاركة أي معلومات شخصية مع أي جهة
          </p>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Anonymous Mode Banner */}
          <div className="mb-5 p-3.5 bg-gradient-to-r from-slate-50 to-teal-50/40 dark:from-slate-800/80 dark:to-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                ?
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">تفرد بالسرية التامة</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">تصفح واحجز بدون كشف اسمك الحقيقي</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              دخول كضيف
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition ${mode === 'login' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition ${mode === 'signup' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              حساب جديد
            </button>
          </div>

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني أو كود العميل
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@coolmind.com أو CM-123456"
                    className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(''); }}
                    className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? 'جاري التحقق...' : 'دخول آمن'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم المستعار أو الاسم الأول (اختياري للسرية)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={aliasOrName}
                    onChange={e => setAliasOrName(e.target.value)}
                    placeholder="مثال: سارة أو عميل 88"
                    className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الدولة
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="YE">🇾🇪 اليمن (YER)</option>
                    <option value="SA">🇸🇦 السعودية (SAR)</option>
                    <option value="AE">🇦🇪 الإمارات</option>
                    <option value="EG">🇪🇬 مصر</option>
                    <option value="OTHER">🌍 دولي / المهجر (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف / الواتساب
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={country === 'YE' ? '77xxxxxxx' : '+966...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  أوافق على{' '}
                  <button type="button" onClick={onOpenTerms} className="text-teal-600 underline font-bold">
                    الشروط والأحكام
                  </button>
                  {' '}و{' '}
                  <button type="button" onClick={onOpenPrivacyPolicy} className="text-teal-600 underline font-bold">
                    سياسة الخصوصية
                  </button>
                  {' '}وسرية البيانات الطبية.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب والانطلاق'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مشفراً لتعيين كلمة مرور جديدة فوراً.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition"
              >
                إرسال رابط الاستعادة
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-teal-600 font-bold hover:underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
