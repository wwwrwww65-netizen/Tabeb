import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Brain, 
  Apple, 
  Users, 
  Sparkles, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  Star, 
  ExternalLink,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  QrCode,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Department, CLINICAL_DEPARTMENTS } from '../data/departments';
import { Doctor, Patient, Appointment } from '../types';

interface FullPageBookingProps {
  activePatient: Patient;
  doctors: Doctor[];
  departments?: Department[];
  initialDeptId?: string;
  initialStep?: 1 | 2 | 3 | 4;
  onCompleteBooking: (appointment: Omit<Appointment, 'id'>) => void;
  onOpenSelfDiagnostic: () => void;
  onOpenChatWithDoctor: () => void;
  onOpenDiagnosticScale: (scaleId: string) => void;
  onBackToOverview: () => void;
}

export const FullPageBookingView: React.FC<FullPageBookingProps> = ({
  activePatient,
  doctors,
  departments = CLINICAL_DEPARTMENTS,
  initialDeptId,
  initialStep,
  onCompleteBooking,
  onOpenSelfDiagnostic,
  onOpenChatWithDoctor,
  onOpenDiagnosticScale,
  onBackToOverview
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialStep || 1);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId || 'psychiatry');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [autoMatchedNotice, setAutoMatchedNotice] = useState<string | null>(null);

  const [sessionType, setSessionType] = useState<'جلسة عن بُعد (فيديو)' | 'حضوري بالعيادة'>('جلسة عن بُعد (فيديو)');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');
  const [selectedTime, setSelectedTime] = useState<string>('05:00 مساءً');
  const [sessionGoal, setSessionGoal] = useState<string>('استشارة أولية وفحص إكلينيكي وتشخيص الأعراض');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'PayPal' | 'مدى (Mada)' | 'بطاقة ائتمان (Visa/MC)' | 'Apple Pay' | 'STC Pay'>('PayPal');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('884');
  const [paypalEmail, setPaypalEmail] = useState<string>('client@example.com');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  
  // Confirmed booking result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialDeptId) setSelectedDeptId(initialDeptId);
    if (initialStep) setCurrentStep(initialStep);
  }, [initialDeptId, initialStep]);

  // Filter doctors by selected department
  const departmentDoctors = doctors.filter(d => d.departmentId === selectedDeptId);
  // Only fallback to a doctor for fee calculation if none explicitly chosen
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || departmentDoctors[0] || doctors[0];
  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0] || CLINICAL_DEPARTMENTS[0];

  // Auto-Match feature: picks best rated doctor available with clear explanation
  const handleAutoMatchDoctor = () => {
    const candidates = departmentDoctors.length ? departmentDoctors : doctors;
    const best = [...candidates].sort((a, b) => b.rating - a.rating)[0];
    if (best) {
      setSelectedDoctorId(best.id);
      setAutoMatchedNotice(`✨ قام النظام بترشيح ${best.name} (${best.specialty}) تلقائياً بناءً على تقييم الأعضاء المرتفع (★ ${best.rating}) وأقرب وقت متاح في الجدول.`);
    }
  };

  const handleProceedToPayment = () => {
    // If the patient did NOT select a doctor manually, system automatically auto-assigns
    if (!selectedDoctorId) {
      const candidates = departmentDoctors.length ? departmentDoctors : doctors;
      const best = [...candidates].sort((a, b) => b.rating - a.rating)[0] || doctors[0];
      setSelectedDoctorId(best.id);
      setAutoMatchedNotice(`✨ نظراً لعدم اختيار طبيب بنفسك، قام النظام تلقائياً باختيار وترشيح ${best.name} وفقاً للأعلى تقييماً والجدول المتاح.`);
    }
    setCurrentStep(3);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const generatedMeet = 'https://meet.google.com/cm-' + Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6);
      const transactionId = 'TXN-' + paymentMethod.replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor(100000 + Math.random() * 900000);

      const newApt: any = {
        id: 'apt-' + Date.now(),
        patientId: activePatient.id,
        patientName: activePatient.name,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        departmentName: activeDept.nameAr,
        date: selectedDate,
        time: selectedTime,
        type: sessionType,
        status: 'مؤكد',
        sessionGoal,
        meetUrl: sessionType === 'جلسة عن بُعد (فيديو)' ? generatedMeet : undefined,
        paymentStatus: 'مدفوع بالكامل',
        paymentMethod,
        amountSAR: activeDoctor.priceSAR,
        transactionId
      };

      setConfirmedAppointment(newApt);
      onCompleteBooking(newApt);
      setCurrentStep(4);
    }, 900);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right w-full max-w-full">
      
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onBackToOverview} 
            className="hover:text-teal-700 dark:hover:text-teal-400 font-bold transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-bold">حجز استشارة تخصصية</span>
          <span>/</span>
          <span className="text-teal-700 dark:text-teal-400 font-mono font-bold">
            خطوة {currentStep} من 4
          </span>
        </div>

        <button
          onClick={onBackToOverview}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <span>العودة للوحة الشخصية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        
        {/* Stepper Progress Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-400/20 mb-1">
                <span>نظام حجز المواعيد والاستشارات الطبية المتكامل</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight">
                {currentStep === 1 && 'الخطوة 1: اختيار القسم التخصصي'}
                {currentStep === 2 && `الخطوة 2: اختيار الطبيب وتحديد موعد الجلسة (${activeDept.nameAr})`}
                {currentStep === 3 && 'الخطوة 3: صفحة الدفع الإلكتروني (PayPal والبطاقات)'}
                {currentStep === 4 && 'الخطوة 4: تأكيد الحجز وتوليد رابط Google Meet'}
              </h1>
            </div>

            <div className="text-xs text-slate-300">
              {currentStep === 1 && 'اختر القسم الطبي المناسب لأعراضك'}
              {currentStep === 2 && 'اختر طبيبك بنفسك أو استخدم الترشيح التلقائي'}
              {currentStep === 3 && 'الدفع المشفر مع ضمان استرجاع الرسوم'}
              {currentStep === 4 && 'جلسة معتمدة مع إشعار الطبيب الفوري'}
            </div>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentStep === 1 
                  ? 'bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm' 
                  : currentStep > 1 ? 'bg-teal-900/60 text-teal-200 border-teal-800' : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              1. اختيار القسم
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentStep === 2 
                  ? 'bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm' 
                  : currentStep > 2 ? 'bg-teal-900/60 text-teal-200 border-teal-800' : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              2. اختيار الطبيب
            </button>

            <button
              onClick={() => {
                if (currentStep >= 3) setCurrentStep(3);
                else handleProceedToPayment();
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentStep === 3 
                  ? 'bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm' 
                  : currentStep > 3 ? 'bg-teal-900/60 text-teal-200 border-teal-800' : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              3. الدفع الإلكتروني
            </button>

            <div className={`p-2.5 rounded-xl border text-center transition-all ${
              currentStep === 4 
                ? 'bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}>
              4. رابط Google Meet
            </div>
          </div>
        </div>

        {/* STEP 1: CHOOSE DEPARTMENT */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Self-Diagnostic Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-900 rounded-2xl p-5 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-teal-200 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>هل أنت محتار في تحديد القسم الأنسب لحالتك؟</span>
                </span>
                <h3 className="font-bold text-sm text-white">
                  الفحص التشخيصي الذاتي الموجه (AI Triage & Clinical Assessment)
                </h3>
                <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
                  أجب على 4 أسئلة سريعة حول الأعراض ومستوى طاقتك ونومك، وسيقوم النظام بتوجيهك فورياً للقسم والطبيب المخصص لحالتك.
                </p>
              </div>

              <button
                onClick={onOpenSelfDiagnostic}
                className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-colors shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>بدء الفحص الذاتي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="font-black text-lg text-slate-900 dark:text-white">
                  الأقسام التخصصية الأساسية الأربعة (اختر قسماً للمتابعة):
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  انقر على القسم المطلوب للانتقال إلى قائمة الأطباء المتاحين في ذلك القسم
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;

                  return (
                    <div
                      key={dept.id}
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        // Reset selected doctor when switching dept so the user can choose
                        setSelectedDoctorId('');
                        setAutoMatchedNotice(null);
                      }}
                      className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold ${
                            isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {dept.badge}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {dept.doctorCount} أطباء معتمدين متاحين
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {dept.nameAr}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {dept.fullDesc}
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/90 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                          <strong className="block text-slate-800 dark:text-slate-200 font-bold">أبرز الحالات المعالجة بالقسم:</strong>
                          <p className="line-clamp-2">{dept.targetDisorders.join(' · ')}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                          {isSelected ? '✓ تم تحديد هذا القسم' : 'انقر لتحديد القسم'}
                        </span>
                        <ChevronLeft className="w-4 h-4 text-teal-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions for Step 1 */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAutoMatchDoctor}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>الترشيح الذكي: دع النظام يختار لي أفضل طبيب متاح</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  // Do NOT auto-pick a doctor here! Leave selectedDoctorId empty so the user can choose freely
                  setCurrentStep(2);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-7 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <span>متابعة لاختيار الطبيب والموعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: CHOOSE DOCTOR OR AUTO-MATCH */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header with Explicit Choice Instructions */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                    {activeDept.nameAr}
                  </span>
                  <h2 className="font-black text-lg text-slate-900 dark:text-white mt-1">
                    أمامك خياران: اختر طبيبك بنفسك، أو دع النظام يختار لك تلقائياً
                  </h2>
                </div>

                {/* Auto-Match Button */}
                <button
                  onClick={handleAutoMatchDoctor}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>الترشيح الذكي التلقائي للأفضل</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">🔹 الخيار 1: اختيار الطبيب بنفسك يدوياً</strong>
                  <p className="text-slate-500 dark:text-slate-400">تصفح بطاقات الأطباء أدناه واضغط زر "اختيار هذا الطبيب" لتحديده رسمياً.</p>
                </div>

                <div className="p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200/80 dark:border-teal-800">
                  <strong className="text-teal-900 dark:text-teal-200 block mb-0.5">✨ الخيار 2: ترشيح النظام التلقائي</strong>
                  <p className="text-teal-700 dark:text-teal-300">إذا لم تقم باختيار طبيب، سيقوم النظام تلقائياً بتعيين أفضل طبيب متاح عند المتابعة للدفع.</p>
                </div>
              </div>
            </div>

            {/* Auto Matched Notice Alert */}
            {autoMatchedNotice && (
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 text-xs font-bold flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{autoMatchedNotice}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDoctorId('');
                    setAutoMatchedNotice(null);
                  }}
                  className="text-[11px] underline text-teal-800 dark:text-teal-300 hover:text-teal-950 cursor-pointer shrink-0"
                >
                  إلغاء الترشيح والاختيار يدوياً
                </button>
              </div>
            )}

            {/* Doctors Cards Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                قائمة الأطباء المتاحين في القسم (اضغط على بطاقة الطبيب لاختياره):
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(departmentDoctors.length ? departmentDoctors : doctors).map(doc => {
                  const isSelected = selectedDoctorId === doc.id;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setAutoMatchedNotice(null); // clear auto match notice since user manually picked
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-md ring-2 ring-teal-500/30'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={doc.avatar}
                              alt={doc.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                                {isSelected && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>طبيبك المختار</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold block">{doc.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ترخيص: {doc.licenseNumber}</span>
                            </div>
                          </div>

                          <div className="text-left font-mono font-bold text-amber-600 text-xs shrink-0">
                            ★ {doc.rating} <span className="text-[10px] text-slate-400">({doc.reviewsCount} تقييم)</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {doc.bio}
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span>الخبرة الإكلينيكية: <strong>{doc.experienceYears} سنة</strong></span>
                            <span>أقرب موعد: <strong className="text-teal-700 dark:text-teal-400">{doc.nextAvailableSlot}</strong></span>
                          </div>
                          <div className="flex justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700">
                            <span>سعر الجلسة (45 دقيقة):</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">{doc.priceSAR} ر.س ({doc.priceUSD}$)</span>
                          </div>
                        </div>
                      </div>

                      {/* Select Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctorId(doc.id);
                          setAutoMatchedNotice(null);
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-600'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>✓ تم اختيار {doc.name} (طبيبك لهذه الاستشارة)</span>
                          </>
                        ) : (
                          <span>اختيار هذا الطبيب يدوياً</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date, Time & Session Goal Configuration Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>
                    {selectedDoctorId 
                      ? `حدد تفاصيل وموعد جلستك مع ${activeDoctor.name}:`
                      : 'حدد تفاصيل الموعد المطلوب (سيتم تعيين أفضل طبيب تلقائياً إذا لم تختر):'
                    }
                  </span>
                </h4>

                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                  {activeDoctor.priceSAR} ر.س
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">طبيعة الجلسة:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSessionType('جلسة عن بُعد (فيديو)')}
                      className={`p-2 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                        sessionType === 'جلسة عن بُعد (فيديو)'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Google Meet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionType('حضوري بالعيادة')}
                      className={`p-2 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                        sessionType === 'حضوري بالعيادة'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>حضوري</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الجلسة:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ساعة الموعد المتاحة:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="03:00 مساءً">03:00 مساءً</option>
                    <option value="04:30 مساءً">04:30 مساءً</option>
                    <option value="05:00 مساءً">05:00 مساءً</option>
                    <option value="06:30 مساءً">06:30 مساءً</option>
                    <option value="08:00 مساءً">08:00 مساءً</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                  الشكوى الأساسية أو هدف الاستشارة:
                </label>
                <input
                  type="text"
                  value={sessionGoal}
                  onChange={(e) => setSessionGoal(e.target.value)}
                  placeholder="مثال: تشخيص نوبات قلق وتوتر، مراجعة وصفة دوائية، استشارة علاج سلوكي..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            {/* Step 2 Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                ← العودة لاختيار القسم
              </button>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>
                  {selectedDoctorId 
                    ? `متابعة للدفع مع ${activeDoctor.name}` 
                    : 'متابعة للدفع (مع ترشيح الطبيب الأنسب تلقائياً)'
                  }
                </span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: PAYMENT GATEWAY (PAYPAL, MADA, VISA, APPLE PAY) */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                بوابة الدفع الإلكتروني المشفرة وتأكيد الحجز
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ادفع بأمان عبر PayPal أو مدى أو بطاقات الائتمان أو Apple Pay لتأكيد الحجز وتوليد رابط الجلسة
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Payment Methods Selection & Form */}
              <div className="lg:col-span-2 space-y-5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">اختر وسيلة الدفع المناسبة:</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'PayPal', label: 'PayPal', badge: 'باي بال الرسمي' },
                    { id: 'مدى (Mada)', label: 'مدى (Mada)', badge: 'بطاقات مدى' },
                    { id: 'بطاقة ائتمان (Visa/MC)', label: 'Visa / MC', badge: 'فيزا وماستر' },
                    { id: 'Apple Pay', label: 'Apple Pay', badge: 'آبل باي' },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'bg-teal-50 dark:bg-teal-950 border-teal-600 text-teal-900 dark:text-teal-300 font-bold shadow-xs ring-2 ring-teal-500/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-xs font-black block">{method.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{method.badge}</span>
                    </button>
                  ))}
                </div>

                {/* PayPal Specific Form */}
                {paymentMethod === 'PayPal' && (
                  <div className="bg-[#0070ba]/10 border border-[#0070ba]/30 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0070ba] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        <span>الدفع الفوري والآمن عبر حساب PayPal:</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#003087]">PayPal Official Checkout</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        البريد الإلكتروني لحساب PayPal الخاص بك:
                      </label>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                        placeholder="client@paypal.com"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      سيتم خصم مبلغ <strong>{activeDoctor.priceSAR} ر.س (${activeDoctor.priceUSD})</strong> فورياً وتأكيد الحجز وتوليد رابط Google Meet المباشر.
                    </p>
                  </div>
                )}

                {/* Cards Form (Mada or Visa) */}
                {(paymentMethod === 'مدى (Mada)' || paymentMethod === 'بطاقة ائتمان (Visa/MC)') && (
                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم البطاقة (16 رقماً):</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الانتهاء (MM/YY):</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رمز الأمان (CVV):</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Apple Pay Form */}
                {paymentMethod === 'Apple Pay' && (
                  <div className="bg-black text-white rounded-2xl p-6 text-center space-y-2">
                    <span className="text-base font-bold block">Pay الدفع السريع والآمن</span>
                    <p className="text-xs text-slate-300">
                      سيتم تأكيد الدفع بمبلغ {activeDoctor.priceSAR} ر.س عبر Face ID / Touch ID في خطوة واحدة.
                    </p>
                  </div>
                )}

              </div>

              {/* Order Invoice Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 text-xs h-fit">
                <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  ملخص الفاتورة وتفاصيل الاستشارة
                </h3>

                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>الطبيب المعالج:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{activeDoctor.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>القسم الطبي:</span>
                    <span>{activeDept.nameAr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>موعد الجلسة:</span>
                    <span className="font-mono">{selectedDate} · {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نوع الجلسة:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">{sessionType}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>رسوم الجلسة:</span>
                    <span className="font-mono">{activeDoctor.priceSAR} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span className="font-mono text-emerald-600 font-bold">مشمولة</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t-2 border-slate-200 dark:border-slate-700">
                    <span>المجموع الإجمالي:</span>
                    <span className="text-teal-700 dark:text-teal-400 font-mono text-base">{activeDoctor.priceSAR} ر.س</span>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>دفع آمن 100% مع ضمان استرجاع الرسوم بالكامل في حال رغبة المريض بالإلغاء قبل الجلسة.</span>
                </div>
              </div>

            </div>

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                ← العودة لتعديل الطبيب والموعد
              </button>

              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري معالجة وتأكيد الدفع عبر {paymentMethod}...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تأكيد وسداد ({activeDoctor.priceSAR} ر.س) عبر {paymentMethod}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: CONFIRMATION & GOOGLE MEET LINK */}
        {currentStep === 4 && confirmedAppointment && (
          <div className="p-8 sm:p-10 space-y-6 text-center">
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                تم السداد وتأكيد الحجز بنجاح عبر {confirmedAppointment.paymentMethod}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                موعد استشارتك مؤكد وجاهز!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                تم إرسال إشعار فوري وتثبيت الموعد بجدول وساعات {confirmedAppointment.doctorName} المتاحة، وتوليد رابط Google Meet المباشر.
              </p>
            </div>

            {/* Google Meet Card */}
            {confirmedAppointment.meetUrl && (
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl max-w-xl mx-auto shadow-lg text-right space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-teal-300" />
                    <span className="font-bold text-sm">رابط الجلسة عبر Google Meet (توليد تلقائي):</span>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-mono">
                    HD Video Ready
                  </span>
                </div>

                <div className="bg-white/10 p-3 rounded-xl font-mono text-xs text-teal-200 select-all text-center flex items-center justify-between gap-2">
                  <span className="truncate">{confirmedAppointment.meetUrl}</span>
                  <a
                    href={confirmedAppointment.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center gap-1 shrink-0"
                  >
                    <span>دخول الجلسة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-slate-300">
                  سيكون الطبيب بانتظارك في الموعد المحدد: <strong>{confirmedAppointment.date} في تمام {confirmedAppointment.time}</strong>.
                </p>
              </div>
            )}

            {/* Invoice Digital Voucher */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 max-w-xl mx-auto text-xs text-right space-y-2">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>رقم المعاملة (Ref ID):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmedAppointment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>المريض:</span>
                <span className="font-bold">{confirmedAppointment.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>الطبيب المعالج:</span>
                <span className="font-bold">{confirmedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span>إشعار جدول الطبيب:</span>
                <span className="font-bold text-emerald-600">✓ تم الإرسال والإدراج بجدول المواعيد المتاحة</span>
              </div>
              <div className="flex justify-between">
                <span>المبلغ المدفوع:</span>
                <span className="font-bold text-emerald-600 font-mono">{confirmedAppointment.amountSAR} ر.س</span>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {confirmedAppointment.meetUrl && (
                <a
                  href={confirmedAppointment.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>دخول جلسة Google Meet الآن</span>
                </a>
              )}

              <button
                onClick={onOpenChatWithDoctor}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>بدء محادثة ودردشة الطبيب</span>
              </button>

              <button
                onClick={onOpenSelfDiagnostic}
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>إجراء اختبار تشخيصي لمعرفة مرضي</span>
              </button>

              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة إشعار الحجز</span>
              </button>

              <button
                onClick={onBackToOverview}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                العودة للوحة الرئيسية
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
