import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, UserCheck, Star, ShieldCheck } from 'lucide-react';
import { Doctor } from '../types';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDoctorId?: string;
  onConfirmChange: (newDoctor: Doctor) => void;
}

export const ChangeDoctorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDoctorId = 'doc-moayad',
  onConfirmChange
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [reason, setReason] = useState<string>('رغبة في تجربة أسلوب علاجي آخر');
  const [transferred, setTransferred] = useState(false);

  if (!isOpen) return null;

  const availableDoctors = OFFICIAL_DOCTORS_TEAM.filter(d => d.id !== currentDoctorId);

  const handleConfirm = () => {
    const doc = OFFICIAL_DOCTORS_TEAM.find(d => d.id === selectedDocId);
    if (!doc) return;
    onConfirmChange(doc);
    setTransferred(true);
    setTimeout(() => {
      setTransferred(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">تغيير المعالج / الطبيب المتابع</h3>
              <p className="text-[11px] text-slate-500">نقل سلس لملفك بدون أي حرج أو تعقيد</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {transferred ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-black text-base text-slate-900 dark:text-slate-100">تم نقل ملفك بنجاح!</h4>
              <p className="text-slate-500">تم تعيين مختصك الجديد ونقل مقاييسك وجدولك بسلاسة تامة.</p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-teal-50 dark:bg-teal-950/40 p-3 rounded-2xl border border-teal-200 dark:border-teal-800">
                من حقك الكامل اختيار المختص الذي ترتاح معه نفسياً. سيتم تحويل رصيد باقتك ومقاييسك السابقة دون الحاجة لتكرار شرح حالتك من البداية.
              </p>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  اختر المختص البديل من فريقنا المعتمد:
                </label>
                <div className="space-y-2">
                  {availableDoctors.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                        selectedDocId === doc.id
                          ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</p>
                          <p className="text-[11px] text-slate-500">{doc.title} · لهجة: {doc.dialect}</p>
                        </div>
                      </div>
                      <div className="text-left font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سبب التغيير (اختياري لتحسين الجودة):
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="رغبة في تجربة أسلوب علاجي آخر">رغبة في تجربة أسلوب علاجي آخر</option>
                  <option value="تفضيل لهجة أو جنس مختص مختلف">تفضيل لهجة أو جنس مختص مختلف</option>
                  <option value="عدم توافق المواعيد المتاحة">عدم توافق المواعيد المتاحة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <button
                type="button"
                disabled={!selectedDocId}
                onClick={handleConfirm}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition"
              >
                تأكيد نقل الملف وتعيين المختص
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
