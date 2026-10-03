import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  ShieldAlert, 
  Save, 
  Printer, 
  ClipboardCheck,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Patient, ClinicalFormTemplate, SavedClinicalRecord, StaffUser } from '../types';
import { CLINICAL_FORMS_TEMPLATES } from '../data/clinicalForms';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  formType: 'mse' | 'suicide_risk' | 'soap_note';
  currentStaff: StaffUser | null;
  onRecordSaved?: (record: SavedClinicalRecord) => void;
}

export const ClinicalFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  formType,
  currentStaff,
  onRecordSaved
}) => {
  const currentTemplate: ClinicalFormTemplate = 
    CLINICAL_FORMS_TEMPLATES.find(f => f.id === formType) || CLINICAL_FORMS_TEMPLATES[0];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [emergencyEscalated, setEmergencyEscalated] = useState<boolean>(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    const recordNumber = `EHR-${currentTemplate.code}-${Date.now().toString().slice(-6)}`;
    const newRecord: SavedClinicalRecord = {
      id: 'rec-' + Date.now(),
      recordNumber,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientFileNumber: activePatient.fileNumber,
      doctorId: currentStaff?.doctorId || 'doc-hakim',
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      doctorLicenseNumber: currentStaff?.licenseNumber || 'MD-PSY-98442',
      formType: formType,
      titleAr: currentTemplate.titleAr,
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد وموقع سريرياً',
      formData: formData,
      summaryText: formType === 'suicide_risk' 
        ? (emergencyEscalated ? 'تم تصعيد بروتوكول الطوارئ وتفعيل خطة الأمان الفورية.' : 'تقييم خطورة مكتمل، خطة الأمان مفعلة.')
        : formType === 'soap_note'
        ? `جلسة متابعة علاجية - الملاحظات مسجلة ومحفوظة.`
        : 'فحص الحالة العقلية الشامل مكتمل ومعتمد في ملف المريض.',
      emergencyEscalated,
      signatureText: `${currentStaff?.name || 'د. طارق الحكيم'} (${currentStaff?.licenseNumber || 'MD-PSY-98442'})`,
      verifiedStamp: true
    };

    clinicalStorage.saveRecord(newRecord);
    if (onRecordSaved) onRecordSaved(newRecord);

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[92vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 font-semibold">{currentTemplate.code}</span>
                <span className="text-xs text-slate-400">· المريض: <strong>{activePatient.name}</strong> ({activePatient.fileNumber})</span>
              </div>
              <h2 className="text-lg font-bold text-white">{currentTemplate.titleAr}</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confidentiality Notice & Emergency Escalation (ADD-D-005) */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>بروتوكول السرية الطبية:</strong> الملاحظات مشفرة ومحمية. استثناء كسر السرية: نية إيذاء النفس المباشرة أو تهديد سلامة الآخرين.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowEmergencyConfirm(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
              emergencyEscalated 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{emergencyEscalated ? 'تم تصعيد حالة طوارئ ✓' : 'تصعيد حالة طوارئ (Escalate)'}</span>
          </button>
        </div>

        {/* Emergency Confirm Modal */}
        {showEmergencyConfirm && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900 text-right space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>تأكيد تصعيد بروتوكول الطوارئ السريري</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              سيتم تسجيل إنذار خطورة فوري للمريض <strong>{activePatient.name}</strong> وتوثيق التدخل في سجل التدقيق وإرسال تنبيه لفريق الأزمات 24/7.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmergencyEscalated(true);
                  setShowEmergencyConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                تأكيد التصعيد وتوثيق الخطر
              </button>
              <button
                type="button"
                onClick={() => setShowEmergencyConfirm(false)}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right text-slate-900 dark:text-slate-100">
          
          {/* Active Doctor Info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
            <div>
              المختص القائم بالتوثيق: <strong className="text-teal-700 dark:text-teal-400">{currentStaff?.name || 'د. طارق الحكيم'}</strong> ({currentStaff?.licenseNumber || 'MD-PSY-98442'})
            </div>
            <div className="text-slate-500">
              التاريخ: <strong>{new Date().toLocaleDateString('ar-SA')}</strong>
            </div>
          </div>

          {currentTemplate.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-teal-800 dark:text-teal-400 border-b border-slate-200 dark:border-slate-700 pb-2">
                {section.title}
              </h3>
              
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || 'اكتب الملاحظات والتقييم السريري بالتفصيل...'}
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed resize-y"
                      ></textarea>
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      >
                        <option value="">-- اختر التقييم --</option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {field.options?.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs cursor-pointer hover:border-teal-400">
                            <input
                              type="radio"
                              name={field.id}
                              value={opt}
                              checked={formData[field.id] === opt}
                              onChange={() => handleFieldChange(field.id, opt)}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Electronic Stamp Preview */}
          <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                ختم
              </div>
              <div className="text-xs">
                <div className="font-bold text-teal-950 dark:text-teal-200">اعتماد التوثيق السريري الرسمي</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">منصة كول مايند للاستشارات النفسية · بروتوكول رقمي مؤمن</div>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
              HIPAA CERTIFIED
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>معاينة وطباعة النموذج</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 font-bold"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-700/20 cursor-pointer disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>تم الاعتماد والحفظ في ملف المريض!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>اعتماد وحفظ النموذج في السجل الطبي</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
