import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ArrowLeft, 
  Brain, 
  AlertCircle, 
  Calendar,
  Stethoscope,
  Heart
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedDoctor: (deptId: string) => void;
  onLaunchRecommendedScale: (scaleId: string) => void;
}

export const SelfDiagnosticTriageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectRecommendedDoctor,
  onLaunchRecommendedScale
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mainComplaint, setMainComplaint] = useState<string>('depression');
  const [duration, setDuration] = useState<string>('أكثر من أسبوعين');
  const [severityImpact, setSeverityImpact] = useState<string>('تعطيل متوسط للعمل والمهام');
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>(['أرق واضطراب نوم', 'خمول وإرهاق دائم']);

  if (!isOpen) return null;

  // Analysis result logic
  const getRecommendation = () => {
    if (mainComplaint === 'depression') {
      return {
        probableCondition: 'مؤشرات أعراض اكتئابية سريرية (Depressive Episode)',
        departmentId: 'psychiatry',
        departmentName: 'قسم الطب النفسي والاستشارات الإكلينيكية',
        scaleId: 'phq-9',
        scaleName: 'مقياس استبيان صحة المريض (PHQ-9)',
        doctorName: 'د. طارق الحكيم (استشاري الطب النفسي)',
        advice: 'يوصى بإجراء مقياس PHQ-9 المعتمد لمعرفة درجة الشدة بدقة، وحجز استشارة تشخيصية مع استشاري الطب النفسي لتحديد الخطة العلاجية.'
      };
    } else if (mainComplaint === 'anxiety') {
      return {
        probableCondition: 'مؤشرات اضطراب القلق العام أو نوبات الهلع (Anxiety / Panic)',
        departmentId: 'psychotherapy',
        departmentName: 'قسم العلاج النفسي وتعديل السلوك (CBT)',
        scaleId: 'gad-7',
        scaleName: 'مقياس اضطراب القلق العام (GAD-7)',
        doctorName: 'أ. مها الغامدي (أخصائية العلاج النفسي والصدمات)',
        advice: 'يوصى بتطبيق مقياس GAD-7 والبدء في جلسات العلاج المعرفي السلوكي لتعلم مهارات تفكيك التفكير الكارثي والاسترخاء.'
      };
    } else if (mainComplaint === 'insomnia') {
      return {
        probableCondition: 'اضطراب الأرق السريري ومشاكل استدامة النوم (Clinical Insomnia)',
        departmentId: 'psychiatry',
        departmentName: 'قسم الطب النفسي والاستشارات الإكلينيكية',
        scaleId: 'isi-insomnia',
        scaleName: 'مؤشر شدة الأرق السريري (ISI)',
        doctorName: 'د. طارق الحكيم (استشاري الطب النفسي)',
        advice: 'فحص مسببات الأرق الكيميائية والبيئية وتطبيق بروتوكول نظافة النوم (CBT-I).'
      };
    } else if (mainComplaint === 'eating_gut') {
      return {
        probableCondition: 'اضطرابات التغذية ومحور الأمعاء-الدماغ (Gut-Brain & Metabolic)',
        departmentId: 'nutrition',
        departmentName: 'قسم التغذية العلاجية النفسية والأيض',
        scaleId: 'phq-9',
        scaleName: 'مقياس الاكتئاب والمزاج',
        doctorName: 'أ. ريم الزهراني (استشارية التغذية النفسية)',
        advice: 'إجراء تقييم غذائي عصبي وفحص ميكروبيوم الأمعاء ونقص المغذيات الأساسية لنواقل المزاج.'
      };
    } else {
      return {
        probableCondition: 'ضغوط وصدمات نفسية وصعوبة تكيف (Trauma & Stress)',
        departmentId: 'psychotherapy',
        departmentName: 'قسم العلاج النفسي وتعديل السلوك (CBT)',
        scaleId: 'pcl-5-ptsd',
        scaleName: 'مقياس اضطراب ما بعد الصدمة (PCL-5)',
        doctorName: 'أ. مها الغامدي (أخصائية العلاج النفسي والصدمات)',
        advice: 'البدء في تقنيات معالجة الصدمات بالتعرض ومحاكاة العين (EMDR) لتفريغ الذاكرة الانفعالية.'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-teal-300 font-bold">الفحص التشخيصي الذاتي الموجه</span>
              <h2 className="text-base sm:text-lg font-black">ما هي الأعراض التي تشعر بها؟</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {currentStep === 1 ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100 text-xs">
            
            {/* Question 1: Main Complaint */}
            <div className="space-y-2">
              <label className="block font-bold text-sm text-slate-900 dark:text-white">
                1. ما هو الشعور أو الشكوى التي تؤرقك أكثر شيء حالياً؟
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'depression', label: 'حزن، فقدان شغف، خمول وإحباط مستمر' },
                  { id: 'anxiety', label: 'قلق مفرط، خوف من المستقبل، خفقان وهلع' },
                  { id: 'insomnia', label: 'صعوبة بالغة في النوم والاستيقاظ الليلي' },
                  { id: 'eating_gut', label: 'مشاكل في الأكل والوزن، أو اضطراب بالقولون' },
                  { id: 'trauma', label: 'ذكريات مؤلمة سابقة تقتحم ذهني وكوابيس' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMainComplaint(item.id)}
                    className={`p-3 rounded-xl border text-right font-medium transition-all cursor-pointer ${
                      mainComplaint === item.id
                        ? 'bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-200 font-bold ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Duration */}
            <div className="space-y-2">
              <label className="block font-bold text-sm text-slate-900 dark:text-white">
                2. منذ متى وأنت تعاني من هذه الأعراض؟
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['أقل من أسبوعين', 'أكثر من أسبوعين', 'عدة أشهر أو أكثر من عام'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                      duration === d
                        ? 'bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-200 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Impact */}
            <div className="space-y-2">
              <label className="block font-bold text-sm text-slate-900 dark:text-white">
                3. ما مقدار تعطيل هذه الأعراض لعملك ودراستك وعلاقاتك؟
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['تأثير طفيف أستطيع السيطرة عليه', 'تعطيل متوسط للعمل والمهام', 'عجز شديد وضيق لا يطاق'].map(imp => (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => setSeverityImpact(imp)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                      severityImpact === imp
                        ? 'bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-200 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Step 1 */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
              >
                تحليل الأعراض وعرض التوصية السريرية ←
              </button>
            </div>

          </div>
        ) : (
          /* STEP 2: RESULTS & TRIAGE ROUTING */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100 text-xs">
            
            <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>التقييم الأولي والتشخيص المرجح لحالتك:</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {recommendation.probableCondition}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                {recommendation.advice}
              </p>
            </div>

            {/* Recommended Department & Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-slate-400 block font-semibold">1. القسم الطبي الموصى به:</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{recommendation.departmentName}</h4>
                <p className="text-[11px] text-slate-500">الطبيب المقترح: {recommendation.doctorName}</p>
                
                <button
                  onClick={() => {
                    onClose();
                    onSelectRecommendedDoctor(recommendation.departmentId);
                  }}
                  className="w-full mt-2 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  الانتقال لحجز موعد في هذا القسم
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-slate-400 block font-semibold">2. المقياس السريري المقنن لحالتك:</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{recommendation.scaleName}</h4>
                <p className="text-[11px] text-slate-500">فحص دقيق من عدة أسئلة لحساب درجة الشدة رسمياً.</p>

                <button
                  onClick={() => {
                    onClose();
                    onLaunchRecommendedScale(recommendation.scaleId);
                  }}
                  className="w-full mt-2 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  بدء المقياس السريري الآن
                </button>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-slate-500 hover:text-slate-700 font-bold"
              >
                ← تعديل الإجابات
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
