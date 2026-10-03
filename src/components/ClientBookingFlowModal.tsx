import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  PhoneCall, 
  MessageSquare, 
  Building2, 
  Star, 
  ExternalLink,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  QrCode,
  Layers,
  UserCheck,
  Tag,
  RotateCcw,
  Baby,
  Zap
} from 'lucide-react';
import { Department, CLINICAL_DEPARTMENTS } from '../data/departments';
import { Doctor, Patient, Appointment, SessionFormatType, TherapyPathwayType } from '../types';
import { VALID_COUPONS } from '../data/packagesAndCoupons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  doctors: Doctor[];
  departments?: Department[];
  initialDeptId?: string;
  initialDoctorId?: string;
  initialStep?: 1 | 2;
  initialPathway?: TherapyPathwayType;
  initialFormat?: SessionFormatType;
  onCompleteBooking: (appointment: Omit<Appointment, 'id'>) => void;
  onOpenSelfDiagnostic: () => void;
  onOpenChatWithDoctor?: () => void;
  onOpenDiagnosticScale?: (scaleId: string) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenRefundPolicy?: () => void;
}

export const ClientBookingFlowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  doctors,
  departments = CLINICAL_DEPARTMENTS,
  initialDeptId,
  initialDoctorId,
  initialStep,
  initialPathway = 'individual',
  initialFormat = 'video',
  onCompleteBooking,
  onOpenSelfDiagnostic,
  onOpenChatWithDoctor,
  onOpenDiagnosticScale,
  onOpenPrivacyPolicy,
  onOpenRefundPolicy
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialStep || 1);
  const [selectedPathway, setSelectedPathway] = useState<TherapyPathwayType>(initialPathway);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId || 'psychiatry');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || '');
  const [selectionMode, setSelectionMode] = useState<'manual' | 'auto'>('manual');
  const [autoMatchedNotice, setAutoMatchedNotice] = useState<string | null>(null);

  // Country & Currency
  const [country, setCountry] = useState<'YE' | 'SA' | 'AE' | 'EG' | 'OTHER'>('YE');
  const [currency, setCurrency] = useState<'YER' | 'USD' | 'SAR'>('YER');
  
  // Format & Timing
  const [sessionFormat, setSessionFormat] = useState<SessionFormatType>(initialFormat);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');
  const [selectedTime, setSelectedTime] = useState<string>('05:00 مساءً');
  const [sessionGoal, setSessionGoal] = useState<string>('استشارة أولية وفحص إكلينيكي وتشخيص الأعراض');

  // Child Parental Consent
  const [parentConsentAgreed, setParentConsentAgreed] = useState<boolean>(false);

  // Coupon
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<string>('كريمي جوالي (Kuraimi)');
  const [yemeniAccountNum, setYemeniAccountNum] = useState<string>('770112233');
  const [senderName, setSenderName] = useState<string>('عميل المنصة');
  const [transferRef, setTransferRef] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('884');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  
  // Confirmed booking result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialDeptId) setSelectedDeptId(initialDeptId);
    if (initialDoctorId) setSelectedDoctorId(initialDoctorId);
    if (initialStep) setCurrentStep(initialStep);
    if (initialPathway) setSelectedPathway(initialPathway);
    if (initialFormat) setSessionFormat(initialFormat);
  }, [initialDeptId, initialDoctorId, initialStep, initialPathway, initialFormat, isOpen]);

  // Sync country with currency & payment methods
  const handleCountryChange = (c: 'YE' | 'SA' | 'AE' | 'EG' | 'OTHER') => {
    setCountry(c);
    if (c === 'YE') {
      setCurrency('YER');
      setPaymentMethod('كريمي جوالي (Kuraimi)');
    } else if (c === 'SA') {
      setCurrency('SAR');
      setPaymentMethod('مدى (Mada)');
    } else {
      setCurrency('USD');
      setPaymentMethod('بطاقة ائتمان (Visa/MC)');
    }
  };

  if (!isOpen) return null;

  // Filter doctors
  const departmentDoctors = doctors.filter(d => d.departmentId === selectedDeptId);
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || departmentDoctors[0] || doctors[0];
  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0] || CLINICAL_DEPARTMENTS[0];

  // Base price calculation
  const basePriceUSD = activeDoctor.priceUSD || 39;
  const basePriceYER = activeDoctor.priceYER || 11700;
  const basePriceSAR = activeDoctor.priceSAR || 146;

  // Discount calculation
  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const finalPriceUSD = Math.round(basePriceUSD * (1 - discountPercent / 100));
  const finalPriceYER = Math.round(basePriceYER * (1 - discountPercent / 100));
  const finalPriceSAR = Math.round(basePriceSAR * (1 - discountPercent / 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === code && c.isValid);
    if (found) {
      setAppliedCoupon({ code: found.code, percent: found.discountPercent });
    } else {
      setCouponError('كود الخصم غير صالح أو منتهي الصلاحية');
    }
  };

  // Auto-Match
  const handleAutoMatchDoctor = () => {
    setSelectionMode('auto');
    const candidates = departmentDoctors.length ? departmentDoctors : doctors;
    const best = [...candidates].sort((a, b) => b.rating - a.rating)[0];
    if (best) {
      setSelectedDoctorId(best.id);
      setAutoMatchedNotice(`✨ قام النظام بترشيح ${best.name} (${best.specialty}) تلقائياً بناءً على التقييم الأرفع (★ ${best.rating}) وأقرب وقت متاح.`);
    }
  };

  // Confirm booking & payment
  const handleConfirmAndPay = () => {
    if (selectedPathway === 'child' && !parentConsentAgreed) {
      alert('يرجى تأكيد موافقة وإقرار ولي الأمر للمتابعة في مسار رعاية الأطفال.');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedMeetUrl = `https://meet.google.com/cm-${activeDoctor.id.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
      const txnRef = `TXN-${country}-${Date.now().toString().slice(-6)}`;
      
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: activePatient.id,
        patientName: activePatient.name || 'عميل كول مايند',
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        departmentName: activeDept.nameAr,
        date: selectedDate,
        time: selectedTime,
        type: sessionFormat === 'video' ? 'جلسة عن بُعد (فيديو)' : ('جلسة عن بُعد (فيديو)' as any),
        status: 'مؤكد',
        sessionGoal: sessionGoal,
        meetUrl: generatedMeetUrl,
        paymentStatus: 'مدفوع بالكامل',
        paymentMethod: paymentMethod as any,
        amountSAR: finalPriceSAR,
        transactionId: txnRef,
        notes: `تم حجز جلسة (${sessionFormat === 'video' ? 'فيديو' : sessionFormat === 'audio' ? 'صوت' : 'شات'}) مع ${activeDoctor.name} بنجاح.`
      };

      onCompleteBooking(newApt);
      setConfirmedAppointment(newApt);
      setIsProcessingPayment(false);
      setCurrentStep(4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Stethoscope className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">حجز جلسة علاجية واستشارة متخصصة</h2>
              <p className="text-xs text-teal-100">
                تسعيرة موحدة معتمدة (${basePriceUSD} / {basePriceYER.toLocaleString()} YER) · تشفير وسرية مطلقة
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>1</span>
            <span>القسم والمختص</span>
          </div>
          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>2</span>
            <span>الموعد والنمط</span>
          </div>
          <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span>الدفع والخصم</span>
          </div>
          <div className={`flex items-center gap-1.5 ${currentStep >= 4 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>4</span>
            <span>التأكيد ورابط Meet</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-200">
          {/* STEP 1: Department & Doctor */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Department selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    1. اختر التخصص الطبي / العيادة:
                  </label>
                  <button
                    type="button"
                    onClick={onOpenSelfDiagnostic}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>لست متأكداً؟ أجب عن فحص الفرز الذاتي</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setSelectedDoctorId('');
                        setAutoMatchedNotice(null);
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                        selectedDeptId === dept.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 shadow-sm ring-1 ring-teal-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold text-xs">{dept.nameAr.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor Selection with Badges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    2. اختر المختص المعتمد:
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoMatchDoctor}
                    className="text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>الترشيح الذكي لأفضل متاح</span>
                  </button>
                </div>

                {autoMatchedNotice && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{autoMatchedNotice}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(departmentDoctors.length ? departmentDoctors : doctors).map((doc) => {
                    const isSelected = (selectedDoctorId || activeDoctor.id) === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setSelectionMode('manual');
                          setAutoMatchedNotice(null);
                        }}
                        className={`p-3.5 rounded-2xl border text-right transition flex items-start gap-3 relative ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-sm ring-1 ring-teal-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shrink-0" />
                        <div className="flex-1 min-w-0 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{doc.name}</h4>
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> مرخص
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{doc.specialty}</p>
                          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-0.5 font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" /> {doc.rating}
                            </span>
                            <span>⏱ التزام: <strong>{doc.punctualityRate}%</strong></span>
                            <span>🗣 <strong>{doc.dialect.split('/')[0]}</strong></span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Format & Schedule */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Session Format */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                  1. نمط الجلسة والتواصل المفضل:
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'video', label: 'محادثة فيديو 📹', desc: 'Google Meet مشفر' },
                    { id: 'audio', label: 'مكالمة صوتية 📞', desc: 'صوت فقط بدون كاميرا' },
                    { id: 'text', label: 'شات كتابي 💬', desc: 'رسائل نصية فورية' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSessionFormat(f.id as SessionFormatType)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        sessionFormat === f.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 ring-1 ring-teal-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-bold">{f.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    2. تاريخ الموعد:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-10-02"
                    max="2026-12-31"
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">يمكنك حجز المواعيد حتى 90 يوماً مقدماً</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    3. الوقت المناسب (بتوقيت مكة / صنعاء):
                  </label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    <option value="04:00 مساءً">04:00 مساءً</option>
                    <option value="05:00 مساءً">05:00 مساءً</option>
                    <option value="06:00 مساءً">06:00 مساءً</option>
                    <option value="07:30 مساءً">07:30 مساءً</option>
                    <option value="09:00 مساءً">09:00 مساءً</option>
                  </select>
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  4. الهدف الأساسي من الجلسة أو الأعراض التي تشكو منها:
                </label>
                <textarea
                  value={sessionGoal}
                  onChange={e => setSessionGoal(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  placeholder="مثال: التعامل مع نوبات التوتر والقلق، أو استشارة لتعديل جرعة دواء..."
                />
              </div>

              {/* Child Parental Consent */}
              {selectedPathway === 'child' && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="booking-parent-consent"
                    checked={parentConsentAgreed}
                    onChange={e => setParentConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 w-4 h-4"
                  />
                  <label htmlFor="booking-parent-consent" className="text-xs text-amber-900 dark:text-amber-200 leading-tight">
                    أؤكد بصفتي ولي أمر المستفيد القاصر (دون 18 عاماً) موافقتي على حضور الجلسة والتوجيه السلوكي.
                  </label>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Payment, Country & Coupon */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Country & Currency Switcher */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    اختر دولتك لضبط وسيلة الدفع والعملة تلقائياً:
                  </label>
                  <div className="flex items-center gap-1">
                    {[
                      { code: 'YE', label: '🇾🇪 اليمن' },
                      { code: 'SA', label: '🇸🇦 السعودية' },
                      { code: 'OTHER', label: '🌍 دولي / المهجر' }
                    ].map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleCountryChange(c.code as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          country === c.code
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="p-4 bg-teal-50/50 dark:bg-teal-950/30 rounded-2xl border border-teal-200/60 dark:border-teal-800/60">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute right-3 top-3 text-teal-600" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="أدخل كود الخصم (مثال: COOL50 أو Y10)"
                      className="w-full pr-9 pl-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    تطبيق الخصم
                  </button>
                </form>

                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> تم تطبيق كود {appliedCoupon.code} بنجاح: خصم {appliedCoupon.percent}%
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-bold mt-2">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                  اختر وسيلة الدفع الآمنة:
                </label>
                
                {country === 'YE' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                      {['كريمي جوالي (Kuraimi)', 'ون كاش (OneCash)', 'محفظة الجيب', 'حوالة النجم / إرسال'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 rounded-xl border text-center transition ${
                            paymentMethod === method
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 ring-1 ring-teal-500'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <p className="font-bold text-slate-800 dark:text-slate-200">بيانات التحويل المعتمدة لمنصة كول مايند:</p>
                      <p className="text-teal-600 font-mono font-bold">حساب الكريمي: 3001234567 | ون كاش: 770112233</p>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">رقم الحوالة أو إشعار التحويل:</label>
                        <input
                          type="text"
                          value={transferRef}
                          onChange={e => setTransferRef(e.target.value)}
                          placeholder="أدخل رقم الإشعار / الحوالة لتأكيد فوري"
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {['بطاقة ائتمان (Visa/MC)', 'مدى (Mada)', 'Apple Pay / PayPal'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 rounded-xl border text-center transition ${
                            paymentMethod === method
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 ring-1 ring-teal-500'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">رقم البطاقة</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">تاريخ الانتهاء</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">رمز الأمان (CVV)</label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown & Refund Guarantee Box */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">سعر الجلسة المعتمد:</span>
                  <span className="font-mono font-bold">${basePriceUSD} ({basePriceYER.toLocaleString()} YER)</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>خصم الكود ({appliedCoupon.code}):</span>
                    <span>-{appliedCoupon.percent}%</span>
                  </div>
                )}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-sm">
                  <span>الإجمالي المطلوب:</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono">
                    {currency === 'YER'
                      ? `${finalPriceYER.toLocaleString()} ريال يمني`
                      : currency === 'SAR'
                      ? `${finalPriceSAR} ر.س`
                      : `$${finalPriceUSD} USD`}
                  </span>
                </div>

                {/* Refund & Security Trust Notice (OBS-C-004 & OBS-C-027) */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تشفير مالي 256-Bit SSL · لا نقوم بحفظ بيانات بطاقتك الائتمانية</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ضمان الاسترداد: استرداد 100% قبل 24 ساعة، وإمكانية إلغاء الاشتراك بأي وقت</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & Meet Link */}
          {currentStep === 4 && confirmedAppointment && (
            <div className="text-center py-4 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 font-black" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  تم تأكيد الحجز وإصدار السند بنجاح 🎉
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  موعدك مع {confirmedAppointment.doctorName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  📅 {confirmedAppointment.date} · ⏱ {confirmedAppointment.time} · كود المرجع: {confirmedAppointment.transactionId}
                </p>
              </div>

              {/* Google Meet Link Box */}
              <div className="p-5 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-3xl max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-teal-800 dark:text-teal-200 font-bold text-xs">
                  <Video className="w-4 h-4" />
                  <span>رابط غرفة الجلسة المشفرة (Google Meet):</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-300 dark:border-teal-700 font-mono text-xs text-teal-700 dark:text-teal-300 break-all select-all font-bold">
                  {confirmedAppointment.meetUrl}
                </div>
                <a
                  href={confirmedAppointment.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <span>دخول غرفة الجلسة الآن</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              السابق
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1) as any)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>المتابعة للخطوة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleConfirmAndPay}
              className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              {isProcessingPayment ? (
                <span>جاري معالجة وتأكيد الحجز...</span>
              ) : (
                <>
                  <span>تأكيد الحجز والدفع ({currency === 'YER' ? `${finalPriceYER.toLocaleString()} YER` : `$${finalPriceUSD}`})</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              تم وإغلاق النافذة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
