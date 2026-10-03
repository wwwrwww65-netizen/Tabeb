import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Star, 
  Award, 
  Calendar, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Sparkles,
  FileText,
  CreditCard
} from 'lucide-react';
import { StaffUser, DoctorReview } from '../types';
import { INITIAL_REVIEWS } from '../data/packagesAndCoupons';

interface Props {
  currentStaff: StaffUser | null;
}

export const DoctorFinancialsTab: React.FC<Props> = ({ currentStaff }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const doctorName = currentStaff?.name || 'د. طارق الحكيم';
  const doctorReviews: DoctorReview[] = INITIAL_REVIEWS;

  // Revenue math: 75% for doctor (مطمئنة/عرب ثيرابي standard)
  const completedSessions = 42;
  const avgSessionPriceUSD = 39;
  const grossRevenueUSD = completedSessions * avgSessionPriceUSD; // $1,638
  const doctorSharePercent = 75;
  const netEarningsUSD = (grossRevenueUSD * doctorSharePercent) / 100; // $1,228.50
  const netEarningsYER = Math.round(netEarningsUSD * 300); // 368,550 YER
  const platformFeeUSD = grossRevenueUSD - netEarningsUSD;

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                المالية والأداء المهني
              </span>
              <span className="text-xs text-slate-400">Financial Ledger & Clinical Ratings</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              أدائي المهني والمستحقات المالية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              كشف حساب شفاف بنسبة دخل المستشار ({doctorSharePercent}%)، إحصاءات الجلسات المنفذة، وتقييمات المرضى
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintStatement}
            className="px-4 py-2.5 bg-slate-900 dark:bg-teal-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>تصدير كشف حساب مالي رسمي</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Earnings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>صافي المستحقات (75%)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ${netEarningsUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">
            يعادل {netEarningsYER.toLocaleString()} ر.ي
          </p>
        </div>

        {/* Completed Sessions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>الجلسات المنفذة هذا الشهر</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedSessions} <span className="text-xs font-normal text-slate-400">جلسة</span>
          </div>
          <p className="text-[11px] text-teal-600 font-bold">
            نسبة الالتزام بالمواعيد: 99.2%
          </p>
        </div>

        {/* Doctor Rating */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>متوسط تقييم المرضى</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>4.96</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-amber-600 font-bold">
            بناءً على 420 تقييماً موثقاً
          </p>
        </div>

        {/* Platform Share */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>رسوم التشغيل والمنصة (25%)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ${platformFeeUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            تشمل البنية التحتية، Meet، والمدفوعات
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payout History Ledger */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>سجل الحوالات والتحويلات المالية للمستشار</span>
            </h3>
            <span className="text-xs text-emerald-600 font-bold">حساب بنكي نشط ومعتمد ✓</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">تحويل مستحقات شهر سبتمبر 2026</div>
                <div className="text-[11px] text-slate-400">رقم الحوالة: PAY-CM-20260930-88 · بنك الكريمي / الكريمي إكسبرس</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-emerald-600">$1,180.00</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 font-bold">
                  تم التحويل بنجاح
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">تحويل مستحقات شهر أغسطس 2026</div>
                <div className="text-[11px] text-slate-400">رقم الحوالة: PAY-CM-20260831-41 · بنك الكريمي</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-emerald-600">$985.00</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 font-bold">
                  تم التحويل بنجاح
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">تحويل مستحقات شهر يوليو 2026</div>
                <div className="text-[11px] text-slate-400">رقم الحوالة: PAY-CM-20260731-19 · الحوالة السريعة</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-emerald-600">$1,050.00</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 font-bold">
                  تم التحويل بنجاح
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Patient Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span>أحدث تقييمات المرضى</span>
            </h3>
            <span className="text-xs text-slate-400">{doctorReviews.length} تقييمات</span>
          </div>

          <div className="space-y-3">
            {doctorReviews.map(rev => (
              <div
                key={rev.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>{rev.clientAlias}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>{rev.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="text-[10px] text-slate-400">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
