import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Baby, 
  Video, 
  PhoneCall, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Doctor, TherapyPathwayType, SessionFormatType, MatchingQuestionnaireData } from '../types';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPathway?: TherapyPathwayType;
  doctors?: Doctor[];
  onSelectMatchedDoctor: (doctor: Doctor, format: SessionFormatType, pathway: TherapyPathwayType) => void;
  onOpenPrivacyPolicy: () => void;
}

export const MatchingQuestionnaireModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialPathway = 'individual',
  doctors = OFFICIAL_DOCTORS_TEAM,
  onSelectMatchedDoctor,
  onOpenPrivacyPolicy
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<MatchingQuestionnaireData>({
    pathway: initialPathway,
    ageGroup: initialPathway === 'child' ? 'child_under_18' : 'adult_18_35',
    parentalConsentAgreed: false,
    problemCategory: 'القلق ونوبات الهلع',
    genderPreference: 'any',
    dialectPreference: 'any',
    formatPreference: 'video',
    preferredTime: 'evening'
  });

  const [matchedDoctor, setMatchedDoctor] = useState<Doctor | null>(null);

  if (!isOpen) return null;

  const problemOptions = [
    'القلق والتوتر ونوبات الهلع',
    'الاكتئاب وتدني المزاج وفقدان الشغف',
    'الوسواس القهري والأفكار المقتحمة',
    'الصدمات النفسية وكرب ما بعد الصدمة',
    'مشاكل النوم والأرق المزمن',
    'اضطرابات الأكل وصورة الجسد (تغذية علاجية)',
    'الخلافات الزوجية والعلاقات الأسرية',
    'تشتت الانتباه وفرط الحركة (ADHD)',
    'الإدمان والتعاطي والسلوكيات القهرية'
  ];

  const handleCalculateMatch = () => {
    // Matching logic
    let candidate = doctors[0];
    if (formData.problemCategory.includes('تغذية') || formData.problemCategory.includes('الأكل')) {
      candidate = doctors.find(d => d.id === 'doc-wejdan') || doctors[0];
    } else if (formData.problemCategory.includes('الزوجية') || formData.pathway === 'couples') {
      candidate = doctors.find(d => d.id === 'doc-yosra') || doctors[0];
    } else if (formData.problemCategory.includes('الإدمان') || formData.problemCategory.includes('دوائية')) {
      candidate = doctors.find(d => d.id === 'doc-saif' || d.id === 'doc-seham') || doctors[0];
    } else if (formData.genderPreference === 'female') {
      candidate = doctors.find(d => d.id === 'doc-seham' || d.id === 'doc-wejdan' || d.id === 'doc-yosra') || doctors[0];
    } else if (formData.genderPreference === 'male') {
      candidate = doctors.find(d => d.id === 'doc-moayad' || d.id === 'doc-amer' || d.id === 'doc-saif') || doctors[0];
    } else {
      candidate = doctors.find(d => d.id === 'doc-moayad') || doctors[0];
    }

    setMatchedDoctor(candidate);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">استبيان المطابقة الذكية لاختيار معالجك</h3>
              <p className="text-[11px] text-teal-100">نختار لك الأخصائي أو الطبيب الأنسب لحالتك خلال 24 ساعة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Tracker */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>المسار والعمر</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>نوع المشكلة</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>تفضيلات الجلسة</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
            <span>الترشيح المعتمد</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Step 1: Pathway & Age */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                  اختر نوع الرعاية المطلوبة:
                </label>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { id: 'individual', title: 'علاج فردي (18+)' },
                    { id: 'couples', title: 'علاج زوجي وأسري' },
                    { id: 'child', title: 'علاج أطفال ومراهقين (<18)' },
                    { id: 'instant', title: 'استشارة فورية عاجلة' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, pathway: p.id as TherapyPathwayType })}
                      className={`p-3 rounded-2xl border text-right font-bold transition flex items-center justify-between ${
                        formData.pathway === p.id 
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span>{p.title}</span>
                      {formData.pathway === p.id && <Check className="w-4 h-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                  الفئة العمرية للمستفيد:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'child_under_18', label: 'أقل من 18 سنة' },
                    { id: 'adult_18_35', label: '18 - 35 سنة' },
                    { id: 'adult_35_plus', label: '36 سنة فما فوق' }
                  ].map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, ageGroup: a.id as any })}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        formData.ageGroup === a.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Child Parental Consent */}
              {(formData.pathway === 'child' || formData.ageGroup === 'child_under_18') && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
                    <Baby className="w-4 h-4 text-amber-600" />
                    <span>إقرار وموافقة ولي الأمر (إلزامي لمسار الأطفال)</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="parent-consent"
                      checked={formData.parentalConsentAgreed}
                      onChange={e => setFormData({ ...formData, parentalConsentAgreed: e.target.checked })}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <label htmlFor="parent-consent" className="text-[11px] text-amber-800 dark:text-amber-300 leading-tight">
                      أقر بصفتي ولي أمر المستفيد بموافقتي الصريحة على بدء الاستشارات النفسية والتوجيه السلوكي للأطفال وفق المعايير الطبية المعتمدة.
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Problem Category */}
          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                ما هو التحدي أو المشكلة الرئيسية التي تبحث عن مساعدة بشأنها؟
              </label>
              <div className="space-y-2">
                {problemOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, problemCategory: opt })}
                    className={`w-full p-3 rounded-2xl border text-right text-xs font-bold transition flex items-center justify-between ${
                      formData.problemCategory === opt
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {formData.problemCategory === opt && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                  نمط وطريقة الجلسة المفضلة لديك:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'video', label: 'محادثة فيديو 📹', desc: 'تواصل مرئي مباشر' },
                    { id: 'audio', label: 'مكالمة صوتية 📞', desc: 'صوت فقط بدون كاميرا' },
                    { id: 'text', label: 'شات كتابي 💬', desc: 'رسائل نصية وتفريغ' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, formatPreference: f.id as SessionFormatType })}
                      className={`p-3 rounded-2xl border text-center transition ${
                        formData.formatPreference === f.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <p className="font-bold text-xs">{f.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    تفضيل جنس المختص:
                  </label>
                  <select
                    value={formData.genderPreference}
                    onChange={e => setFormData({ ...formData, genderPreference: e.target.value as any })}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="any">لا يهم (أي مختص معتمد)</option>
                    <option value="female">أخصائية / طبيبة (أنثى)</option>
                    <option value="male">أخصائي / طبيب (ذكر)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    اللهجة المفضلة:
                  </label>
                  <select
                    value={formData.dialectPreference}
                    onChange={e => setFormData({ ...formData, dialectPreference: e.target.value as any })}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="any">لا يهم (لهجة بيضاء واضحة)</option>
                    <option value="yemeni">يمنية (صنعاء / تعز / عدن)</option>
                    <option value="gulf">خليجية</option>
                    <option value="egyptian">مصرية</option>
                    <option value="levantine">شامية</option>
                    <option value="standard_arabic">عربية فصحى</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Matched Result */}
          {step === 4 && matchedDoctor && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-3xl flex items-start gap-4">
                <img
                  src={matchedDoctor.avatar}
                  alt={matchedDoctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shrink-0 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-full">
                      ✨ الترشيح الأنسب لحالتك 100%
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> مرخص {matchedDoctor.licenseNumber}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                    {matchedDoctor.name}
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                    {matchedDoctor.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong>{matchedDoctor.rating}</strong> ({matchedDoctor.reviewsCount} تقييم)
                    </span>
                    <span>⏱ التزام المواعيد: <strong>{matchedDoctor.punctualityRate}%</strong></span>
                    <span>🗣 اللهجة: <strong>{matchedDoctor.dialect}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <p>
                  <strong>نوع الجلسة المختار:</strong> {formData.formatPreference === 'video' ? 'فيديو مباشر' : formData.formatPreference === 'audio' ? 'مكالمة صوتية' : 'شات نصي مشفر'}
                </p>
                <p>
                  <strong>التسعيرة الموحدة:</strong> ${matchedDoctor.priceUSD} (≈ {matchedDoctor.priceYER.toLocaleString()} ريال يمني)
                </p>
                <p className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  وعدنا: سيتواصل معك فريق خدمة العملاء لتثبيت الموعد خلال 24 ساعة كحد أقصى.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              السابق
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={() => {
                if ((formData.pathway === 'child' || formData.ageGroup === 'child_under_18') && !formData.parentalConsentAgreed && step === 1) {
                  alert('يرجى الموافقة على إقرار ولي الأمر لمتابعة مسار الأطفال.');
                  return;
                }
                setStep((step + 1) as any);
              }}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>التالي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleCalculateMatch}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>إيجاد المعالج الأنسب</span>
            </button>
          )}

          {step === 4 && matchedDoctor && (
            <button
              type="button"
              onClick={() => {
                onSelectMatchedDoctor(matchedDoctor, formData.formatPreference, formData.pathway);
                onClose();
              }}
              className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <span>المتابعة للحجز مع {matchedDoctor.name.split(' ')[0]}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
