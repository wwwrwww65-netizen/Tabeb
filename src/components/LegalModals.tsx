import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  RefreshCw, 
  Cookie, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'emergency' | 'refund' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'emergency' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {type === 'refund' && <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                {type === 'privacy' && 'سياسة الخصوصية وحماية البيانات الطبية'}
                {type === 'terms' && 'الشروط والأحكام العامة للمنصة'}
                {type === 'emergency' && 'سياسة الطوارئ والتدخل في الأزمات النفسية'}
                {type === 'refund' && 'سياسة الإلغاء وإعادة الجدولة والاسترداد المالي'}
              </h3>
              <p className="text-xs text-slate-500">منصة CoolMind — كول مايند للرعاية النفسية المتكاملة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {type === 'privacy' && (
            <>
              {/* Highlight Box: Your Privacy is Safe */}
              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  خصوصيتك بأمان — وعد كول مايند للسرية القصوى
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  نحن نؤمن بأن الأمان النفسي يبدأ من الخصوصية المطلقة. تخضع جميع الاتصالات والمقاييس لبروتوكولات تشفير متقدمة من طرف إلى طرف (End-to-End Encryption).
                </p>
                <ul className="text-xs text-teal-800 dark:text-teal-300 space-y-1 list-disc list-inside">
                  <li><strong>لا يتم تسجيل الجلسات المرئية أو الصوتية إطلاقاً</strong> ولا يمكن لأي طرف الاطلاع عليها.</li>
                  <li><strong>اسمك وهويتك اختياريان تماماً:</strong> يمكنك التسجيل باسم مستعار أو استخدام الدخول المجهول.</li>
                  <li><strong>الاستقلالية التامة:</strong> لا يتم ربط ملفك بأي تأمين تجاري أو جهة عمل دون موافقتك الصريحة.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. جمع البيانات واستخدامها</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  نجمع فقط الحد الأدنى من البيانات اللازمة لتقديم الرعاية الطبية (مثل نتائج المقاييس الذاتية، وسجل الأدوية المعتمد في الجلسة، وتفضيلات المواعيد).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. حدود الاستثناء الوحيدة لكسر السرية الطبية (Limits of Confidentiality)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  التزاماً بأخلاقيات الطب النفسي العالمية والقوانين الطبية، تظل جميع معلوماتك طي الكتمان التام إلا في حالتين حصريتين فقط:
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <li><strong>وجود خطة انتحار نشطة ووشيكة</strong> مع نية مؤكدة لإيذاء النفس تتطلب تدخلاً إنقاذياً عاجلاً لحماية الحياة.</li>
                  <li><strong>وجود تهديد صريح ومباشر لحياة شخص آخر</strong>، خصوصاً ما يتعلق بحماية الأطفال أو العجزة من الإيذاء الجسيم.</li>
                </ol>
                <p className="text-xs text-slate-500 mt-2">
                  * موقف التعاطي والإدمان: الإفصاح عن تعاطي أي مادة يخضع للسرية الطبية التامة ولا يتم إبلاغ أي جهة قانونية، حيث يُعامل المريض كطالب علاج ورعاية صحية.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. حق حذف البيانات وحذف الحساب</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  يحق للعميل في أي وقت طلب تصدير بياناته أو حذف حسابه وبياناته نهائياً من خوادم المنصة عبر صفحة إدارة الحساب أو التواصل مع مسؤول حماية البيانات.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. طبيعة الخدمات المقدمة</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  منصة CoolMind تقدم استشارات طبية نفسية، علاجاً معرفياً سلوكياً (CBT)، إرشاداً أسرياً، وتغذية علاجية نفسية عن بُعد. المنصة ليست بديلاً عن غرف الطوارئ الإسعافية في المستشفيات للحالات العضوية الحرجة.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. أهلية الاستخدام ومسار الأطفال</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  الخدمات الفردية مخصصة للأفراد من سن 18 عاماً فأكثر. بالنسبة لمسار الأطفال والمراهقين (أقل من 18 عاماً)، يُشترط وجود موافقة خطية صريحة من ولي الأمر أو حضور ولي الأمر في المقابلة التشخيصية الأولى.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. معايير المختصين والتراخيص</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  جميع الاستشاريين والأخصائيين المعتمدين في كول مايند حاصلون على تراخيص مزاولة مهنة سارية ومصادق عليها من المجالس الطبية والنقابات المهنية المعتمدة.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">4. سياسة حضور الجلسات والمواعيد</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  يبدأ وقت الجلسة في الموعد المحدد بدقة. في حال تأخر العميل يتم إكمال الوقت المتبقي من الجلسة. وفي حال تأخر المختص يتم تعويض الوقت كاملاً أو تقديم جلسة بديلة مجاناً.
                </p>
              </div>
            </>
          )}

          {type === 'emergency' && (
            <>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl space-y-2">
                <h4 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  تنبيه وإقرار طوارئ هام
                </h4>
                <p className="text-xs text-rose-800 dark:text-rose-300">
                  منصة كول مايند تقدم استشارات مجدولة وعلاجاً متواصلاً، وليست وحدة عناية إسعافية فورية للحالات الحرجة التي تهدد الحياة لحظياً.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">أرقام وخطوط الدعم والطوارئ المباشرة</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🇾🇪 طوارئ اليمن والمهجر</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">+967-770112233 / 01-234567</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">خط المساعدة النفسية والتدخل السريع</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🇸🇦 المملكة العربية السعودية</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">937 (الاستشارات الطبية) / 920033360</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">المركز الوطني لتعزيز الصحة النفسية</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">🌍 خط الطوارئ الدولي</p>
                    <p className="text-teal-600 font-mono font-bold mt-1 text-sm">Befrienders Worldwide / 988</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">دعم الأزمات المجاني في أكثر من 30 دولة</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">💬 واتساب الدعم الفوري</p>
                    <p className="text-emerald-600 font-mono font-bold mt-1 text-sm">+967 770 112 233</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">توجيه مباشر للحالات غير الإسعافية</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">خطوات التعامل في حالات الخطر الشديد</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  إذا كنت أنت أو أي شخص قريب منك في خطر داهم، يرجى التوجه فوراً إلى أقرب قسم طوارئ مستشفى أو التواصل مع أحد الأرقام الإسعافية المحلية في بلدك دون انتظار.
                </p>
              </div>
            </>
          )}

          {type === 'refund' && (
            <>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl space-y-1">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  سياسة واضحة وعادلة تحمي حقوقك كاملة
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  يمكنك إلغاء اشتراكك في أي وقت تريده وبدون الحاجة لإبداء أي سبب.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">قواعد الإلغاء والاسترداد المالي:</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">إلغاء قبل أكثر من 24 ساعة من موعد الجلسة</p>
                      <p className="text-[11px] text-slate-500">إلغاء الموعد واسترداد 100% من المبلغ تلقائياً أو إعادة جدولة مجانية</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg shrink-0">استرداد 100%</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">إلغاء بين 12 إلى 24 ساعة قبل الموعد</p>
                      <p className="text-[11px] text-slate-500">استرداد 50% من قيمة الجلسة نظراً لحجز وقت المختص في الجدول</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg shrink-0">استرداد 50%</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">إلغاء قبل أقل من 12 ساعة أو التغيب (No-show)</p>
                      <p className="text-[11px] text-slate-500">لا يمكن الاسترداد، مع إمكانية تقديم طلب استثنائي للظروف القاهرة</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg shrink-0">لا استرداد</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">استرداد جلسات الباقات المتعددة (أمل / رضا)</p>
                      <p className="text-[11px] text-slate-500">يتم احتساب الجلسات المستهلكة بسعر الجلسة الفردية واسترداد كامل الرصيد المتبقي</p>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg shrink-0">رصيد متبقي</span>
                  </div>

                  <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800/40 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-teal-900 dark:text-teal-200">الاستشارة الفورية (Instant Consultation)</p>
                      <p className="text-[11px] text-teal-700 dark:text-teal-300">استرداد تلقائي كامل وفوري في حال تعذر تعيين طبيب متاح خلال 15 دقيقة</p>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-600 text-white font-bold rounded-lg shrink-0">استرداد فوري</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-sm text-sm"
          >
            إغلاق وقبول
          </button>
        </div>
      </div>
    </div>
  );
};

export const CookieConsentBanner: React.FC<{ onOpenSettings?: () => void }> = ({ onOpenSettings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [necessary, setNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('coolmind_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('coolmind_cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('coolmind_cookie_consent', JSON.stringify({ necessary, analytics, preferences }));
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slideUp">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">إعدادات الخصوصية وملفات الارتباط</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            نستخدم ملفات ارتباط أساسية لتأمين تسجيل دخولك وتشفير بيانات الجلسات وتحسين تجربتك العلاجية.
          </p>
        </div>
      </div>

      {isCustomizing && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">ملفات ضرورية للتشغيل والأمان (إلزامية)</span>
            <input type="checkbox" checked={true} disabled className="rounded text-teal-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">تفضيلات اللغة والمظهر</span>
            <input 
              type="checkbox" 
              checked={preferences} 
              onChange={e => setPreferences(e.target.checked)} 
              className="rounded text-teal-600" 
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">تحليلات الأداء مجهولة الهوية</span>
            <input 
              type="checkbox" 
              checked={analytics} 
              onChange={e => setAnalytics(e.target.checked)} 
              className="rounded text-teal-600" 
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
        >
          السماح للكل
        </button>
        {isCustomizing ? (
          <button
            onClick={handleSaveCustom}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition"
          >
            حفظ اختياراتي
          </button>
        ) : (
          <button
            onClick={() => setIsCustomizing(true)}
            className="px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold transition flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            تخصيص
          </button>
        )}
      </div>
    </div>
  );
};
