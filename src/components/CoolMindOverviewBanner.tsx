import React from 'react';
import { 
  X, 
  Brain, 
  CheckCircle2, 
  Stethoscope, 
  Activity, 
  FileCheck, 
  Apple, 
  Users, 
  ShieldCheck, 
  FolderArchive,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const CoolMindOverviewBanner: React.FC<Props> = ({ isOpen, onClose, onNavigateToTab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <span className="text-teal-200 text-xs font-bold uppercase tracking-wider">تحليل الملفات والحزمة المفكوكة</span>
              <h2 className="text-2xl font-black">ما هو الهدف من تطبيق CoolMind بالتحديد؟</h2>
            </div>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mt-2 max-w-2xl">
            إليك الإجابة الدقيقة والشاملة بعد استعراض كافة ملفات الأرشيف ومكوناته الإكلينيكية والتقنية.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-200">
          
          {/* Main Executive Summary */}
          <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 rounded-xl p-5">
            <h3 className="font-bold text-teal-900 dark:text-teal-200 text-base mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>الخلاصة: منصة طبية ونفسية إكلينيكية متكاملة للعيادات والممارسين</span>
            </h3>
            <p className="text-teal-950 dark:text-teal-100 leading-relaxed text-sm">
              تطبيق <strong>CoolMind (كول مايند)</strong> هو <strong>نظام تشغيل إكلينيكي متقدم (Clinical Practice OS)</strong> مخصص للعيادات النفسية ومراكز الصحة النفسية متعددة التخصصات. صُمم التطبيق لربط الفحص الطبي والتقييم السيكولوجي والتغذية العلاجية والدعم الاجتماعي في ملف رقمي موحد، مع مكتبة مقاييس رقمية ذات تصحيح فوري ووصفات طبية نفسية مقننة.
            </p>
          </div>

          {/* 5 Core Pillars */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <span>الأهداف والوظائف الخمس الأساسية للمنصة:</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>1. الطب النفسي والتشخيص والوصفات (Psychiatry)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  توثيق تشخيصات الدليل التشخيصي (DSM-5 & ICD-11)، ودليل الأدوية النفسية (جرعات، أعراض، تحذيرات الصندوق الأسود)، وتوليد وصفات طبية نفسية رقمية رسمية قابلة للطباعة فورياً.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                  <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>2. محرك المقاييس والاختبارات النفسية (Scales Engine)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  تطبيق المقاييس المعتمدة (PHQ-9 للاكتئاب، GAD-7 للقلق، Y-BOCS للوسواس، ASRS للـ ADHD، ISI للأرق) وحساب الدرجة وشدة الحالة والتوصية الإكلينيكية تلقائياً.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>3. النماذج الإكلينيكية وفحص الحالة العقلية (MSE)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  نماذج رقمية معتمدة لفحص الحالة العقلية (Mental Status Examination)، وتقييم خطورة الانتحار وإيذاء النفس، وتوثيق الجلسات العلاجية بنموذج SOAP المعتمد طبياً.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                  <Apple className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>4. التغذية العلاجية النفسية (Nutritional Psychiatry)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  تطبيق علم محور الأمعاء-الدماغ (Gut-Brain Axis)، وتقديم بروتوكولات غذائية للمرضى النفسيين، وحماية متلازمة الأيض الناتجة عن بعض مضادات الذهان.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-300 transition-colors md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>5. الخدمة الاجتماعية النفسية والسرية الصارمة (Social Work & HIPAA RBAC)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  دراسة البيئة الأسرية والضغوط المجتمعية، ونظام صلاحيات صارم يفصل أدوار الأطباء والمعالجين والإداريين لحماية السرية الطبية الفائقة.
                </p>
              </div>

            </div>
          </div>

          {/* Unpacked Zip Files Map */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>مطابقة ملفات الأرشيف المفكوك مع وظائف التطبيق:</span>
            </h4>
            
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-800 dark:text-teal-300">app.js / workspaces.js</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">إدارة الواجهات وتنسيق مساحات العمل الخمس</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-800 dark:text-teal-300">scales.js / free-scales-data.js / scales-full-runner.js</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">محرك تشغيل وتصحيح المقاييس النفسية الرقمية فورياً</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-800 dark:text-teal-300">data/psychiatric_meds.json & prescription_template.html</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">أطلس الأدوية النفسية ومولد الوصفات الطبية</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-800 dark:text-teal-300">data/clinical_forms.json & clinical_forms_reference.html</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">فحص الحالة العقلية ونماذج تقييم الخطورة</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-teal-800 dark:text-teal-300">data/nutrition_tools.json & social_work_forms.json</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">أدوات التغذية النفسية واستبيانات البحث الاجتماعي</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-800 dark:text-teal-300">refs/cool_mind_book.html</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans">دليل كول مايند السريري المرجعي للممارسين</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            تم تشغيل المنصة بنجاح في بيئة تفاعلية حية
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            بدء استخدام المنصة الإكلينيكية
          </button>
        </div>

      </div>
    </div>
  );
};
