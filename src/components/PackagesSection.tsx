import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  ArrowLeft, 
  HelpCircle, 
  HeartHandshake,
  Tag,
  Building2,
  Lock
} from 'lucide-react';
import { TherapyPackage } from '../types';
import { OFFICIAL_THERAPY_PACKAGES } from '../data/packagesAndCoupons';

interface Props {
  packages?: TherapyPackage[];
  onSelectPackage: (pkg: TherapyPackage) => void;
  currency: 'USD' | 'YER' | 'SAR';
  onChangeCurrency: (c: 'USD' | 'YER' | 'SAR') => void;
  onOpenRefundPolicy: () => void;
  onOpenB2B: () => void;
}

export const PackagesSection: React.FC<Props> = ({
  packages = OFFICIAL_THERAPY_PACKAGES,
  onSelectPackage,
  currency,
  onChangeCurrency,
  onOpenRefundPolicy,
  onOpenB2B
}) => {
  return (
    <section id="packages-section" className="space-y-8 py-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-black mb-2 border border-teal-200 dark:border-teal-800">
            <Tag className="w-3.5 h-3.5" />
            الباقات العلاجية والأسعار المعتمدة
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            اختر باقتك العلاجية بأعلى خصوصية وأوفر سعر
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            لا قيود ولا التزامات طويلة — <strong>يمكنك إلغاء اشتراكك في أي وقت تريده وبدون الحاجة لإبداء أي سبب</strong>
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-500 px-2">العملة:</span>
          <button
            onClick={() => onChangeCurrency('YER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currency === 'YER'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            🇾🇪 ريال يمني (YER)
          </button>
          <button
            onClick={() => onChangeCurrency('USD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currency === 'USD'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            💵 دولار ($ USD)
          </button>
          <button
            onClick={() => onChangeCurrency('SAR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currency === 'SAR'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            🇸🇦 ريال سعودي (SAR)
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const isHope = pkg.id === 'pkg-hope';
          const isInsurance = pkg.id === 'pkg-insurance-corporate';

          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl flex flex-col justify-between p-6 transition duration-300 ${
                isHope
                  ? 'bg-gradient-to-b from-teal-900 to-slate-900 text-white border-2 border-teal-400 shadow-2xl shadow-teal-900/30 scale-100 lg:-translate-y-2'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Top Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      isHope
                        ? 'bg-teal-500 text-white shadow-md animate-pulse'
                        : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {pkg.badge || 'باقة معتمدة'}
                  </span>

                  {pkg.saveTextAr && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {pkg.saveTextAr}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-black ${isHope ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {pkg.nameAr}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isHope ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {pkg.descriptionAr}
                </p>

                {/* Price Display */}
                <div className="my-5 pt-4 border-t border-slate-100/20 dark:border-slate-800">
                  {isInsurance ? (
                    <div className="py-2">
                      <p className="text-xl font-black text-teal-400">تغطية مجانية بالكامل</p>
                      <p className="text-[11px] text-slate-400 mt-1">عبر كود المؤسسة أو وثيقة التأمين</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tight">
                          {currency === 'YER'
                            ? `${pkg.priceYER.toLocaleString()} YER`
                            : currency === 'SAR'
                            ? `${pkg.priceSAR} ر.س`
                            : `$${pkg.priceUSD}`}
                        </span>
                        <span className={`text-xs ${isHope ? 'text-teal-200' : 'text-slate-400'}`}>
                          / {pkg.sessionsCount === 1 ? 'الجلسة' : `${pkg.sessionsCount} جلسات`}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isHope ? 'text-teal-200' : 'text-slate-400'}`}>
                        {pkg.sessionDurationText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 my-5 text-xs">
                  {pkg.featuresAr.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isHope ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-300'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={isHope ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions & Guarantees */}
              <div className="pt-4 border-t border-slate-100/10 dark:border-slate-800/80 space-y-3">
                <p className={`text-[11px] text-center leading-tight flex items-center justify-center gap-1 ${
                  isHope ? 'text-teal-200/90' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <RotateCcw className="w-3 h-3 text-teal-400" />
                  {pkg.cancelAnytimeNoticeAr}
                </p>

                {isInsurance ? (
                  <button
                    onClick={onOpenB2B}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>تفعيل كود الشركة / طلب تعاقد</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 rounded-2xl font-black text-xs transition shadow-md flex items-center justify-center gap-2 ${
                      isHope
                        ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-500/20'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <span>اختر هذه الباقة وابدأ الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Teaser: CoolMind Plus Coming Soon (ADD-C-009) */}
      <div className="p-6 bg-gradient-to-r from-purple-900/30 via-slate-900/60 to-indigo-950/40 rounded-3xl border border-purple-500/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">اشتراك CoolMind Plus+ الإضافي</h4>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold border border-purple-400/30">
                قريباً 🚀
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-1 max-w-2xl">
              ميزة إضافية شهرية تشمل: جلسات دعم ومساندة جماعية تفاعلية مرتين شهرياً + 10 دقائق إضافية مجانية في كل جلسة + مساحة تواصل ومراسلة غير محدودة مع فريق الدعم الإكلينيكي.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('تم تسجيل اهتمامك باشتراك كول مايند بلس! سنخطرك فور تدشينه.')}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shrink-0 shadow-lg shadow-purple-900/50"
        >
          أشعرني عند الإطلاق
        </button>
      </div>
    </section>
  );
};
