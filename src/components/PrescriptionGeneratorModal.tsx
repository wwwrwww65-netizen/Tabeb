import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Plus, 
  Trash2, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  FileCheck2,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Patient, Prescription, PrescriptionItem, StaffUser } from '../types';
import { PSYCHIATRIC_MEDS_DATA } from '../data/psychiatricMeds';
import { DISORDERS_DATA } from '../data/disorders';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  currentStaff: StaffUser | null;
  onSavePrescription: (prescription: Prescription) => void;
}

export const PrescriptionGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  currentStaff,
  onSavePrescription,
}) => {
  const isPsychiatrist = currentStaff?.role === 'psychiatrist' || currentStaff?.role === 'admin';

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>(
    activePatient.primaryDiagnosis || DISORDERS_DATA[0].nameAr
  );
  const [selectedMedId, setSelectedMedId] = useState<string>(PSYCHIATRIC_MEDS_DATA[0].id);
  const [dosage, setDosage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [duration, setDuration] = useState<string>('لمدة 30 يوماً');
  const [instructions, setInstructions] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'مراجعة العيادة بعد 4 أسابيع لإعادة تقييم الأعراض والتجاوب الإكلينيكي.'
  );
  
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      medId: PSYCHIATRIC_MEDS_DATA[0].id,
      genericName: PSYCHIATRIC_MEDS_DATA[0].genericName,
      tradeName: PSYCHIATRIC_MEDS_DATA[0].tradeNames[0],
      dosage: '10 مجم (قرص واحد)',
      frequency: 'مرة واحدة يومياً صباحاً بعد الطعام',
      duration: 'لمدة شهر (30 يوماً)',
      instructions: 'يؤخذ بانتظام دون انقطاع، مع مراقبة التحسن بعد أسبوعين.'
    }
  ]);

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentMed = PSYCHIATRIC_MEDS_DATA.find(m => m.id === selectedMedId) || PSYCHIATRIC_MEDS_DATA[0];

  // Allergy conflict check (OBS-D-023)
  const hasAllergyConflict = activePatient.allergies?.some(alg => 
    currentMed.genericName.toLowerCase().includes(alg.substance.toLowerCase()) ||
    currentMed.tradeNames.some(t => t.toLowerCase().includes(alg.substance.toLowerCase()))
  );

  const handleAddMed = () => {
    if (!dosage || !frequency) {
      setErrorMessage('يرجى إدخال الجرعة الدوائية والتكرار اليومي بصورة دقيقة.');
      return;
    }
    setErrorMessage('');

    const newItem: PrescriptionItem = {
      medId: currentMed.id,
      genericName: currentMed.genericName,
      tradeName: currentMed.tradeNames[0],
      dosage,
      frequency,
      duration,
      instructions: instructions || 'يؤخذ بانتظام بعد وجبة الطعام.'
    };

    setPrescriptionItems([...prescriptionItems, newItem]);
    setDosage('');
    setFrequency('');
    setInstructions('');
  };

  const handleRemoveItem = (index: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (prescriptionItems.length === 0) {
      setErrorMessage('يجب إضافة دواء واحد على الأقل للوصفة.');
      return;
    }
    if (!selectedDiagnosis) {
      setErrorMessage('التشخيص الطبي إلزامي لاعتماد الوصفة.');
      return;
    }

    const doctorLicense = currentStaff?.licenseNumber || 'MD-PSY-98442';
    const rxSerial = `RX-2026-${doctorLicense.replace(/[^0-9]/g, '').slice(0, 5) || '98442'}-${Date.now().toString().slice(-4)}`;

    const rx: Prescription = {
      id: 'rx-' + Date.now(),
      prescriptionNumber: rxSerial,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientAge: activePatient.age,
      fileNumber: activePatient.fileNumber,
      date: new Date().toISOString().split('T')[0],
      diagnosis: selectedDiagnosis,
      items: prescriptionItems,
      specialInstructions,
      doctorId: currentStaff?.doctorId || 'doc-hakim',
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      licenseNumber: doctorLicense,
      doctorSignature: `${currentStaff?.name || 'د. طارق الحكيم'} - استشاري الطب النفسي`,
      isOfficialStamped: true,
      status: 'نشطة'
    };

    onSavePrescription(rx);
    onClose();
  };

  // RBAC Block if not Psychiatrist (OBS-D-003)
  if (!isPsychiatrist) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl border border-rose-200 dark:border-rose-900">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              غير مصرح: صلاحية حصرية للطبيب النفسي
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              وفق المعايير الطبية ولوائح وزارة الصحة والـ RBAC، فإن إصدار وتعديل الوصفات الدوائية مقصور حصرياً على الأطباء النفسيين المرخصين (Psychiatrist).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-mono">
              دورك الحالي: {currentStaff?.role} ({currentStaff?.specialty})
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold"
            >
              العودة للعيادة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[92vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 font-semibold">منظومة الوصفات الرقمية E-Prescription</span>
                <span className="text-xs text-slate-400">· المريض: <strong>{activePatient.name}</strong> ({activePatient.fileNumber})</span>
              </div>
              <h2 className="text-lg font-bold text-white">إصدار وصفة دوائية نفسية معتمدة ومختومة</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Allergy Warning if applicable */}
        {activePatient.allergies && activePatient.allergies.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3 border-b border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200 shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>تنبيه الحساسية الدوائية للمريض:</strong> {activePatient.allergies.map(a => a.substance).join(' ، ')}
            </span>
          </div>
        )}

        {/* Doctor Identity Strip */}
        <div className="p-3 bg-teal-50/50 dark:bg-teal-950/20 border-b border-teal-100 dark:border-teal-900 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200 shrink-0">
          <div>
            الطبيب المصدر: <strong>{currentStaff?.name || 'د. طارق الحكيم'}</strong> (ترخيص: <span className="font-mono">{currentStaff?.licenseNumber || 'MD-PSY-98442'}</span>)
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            كود التحقق الرقمي: RX-2026-COOLMIND
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right text-slate-900 dark:text-slate-100">
          
          {/* Mandatory Diagnosis Selection (OBS-D-005) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              التشخيص الإكلينيكي الإلزامي (DSM-5 / ICD-10) *
            </label>
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
            >
              {DISORDERS_DATA.map(dis => (
                <option key={dis.id} value={`${dis.nameAr} (${dis.codeICD11} / ${dis.codeDSM5})`}>
                  {dis.nameAr} ({dis.codeICD11} / DSM-5: {dis.codeDSM5})
                </option>
              ))}
            </select>
          </div>

          {/* Add Medication Box */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة دواء جديد من الدليل السريري</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اختر الدواء
                </label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {PSYCHIATRIC_MEDS_DATA.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.tradeNames.join('/')} ({med.genericName}) - {med.classAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الجرعة الدقيقة *
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="مثال: 10 مجم (قرص واحد) أو 20 مجم"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تكرار الجرعة اليومية *
                </label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="مثال: مرة واحدة صباحاً بعد الإفطار أو مرتين يومياً"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مدة العلاج
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="مثال: لمدة 30 يوماً"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Blackbox Warning if exists */}
            {currentMed.blackBoxWarning && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <span>تحذير الصندوق الأسود (Black Box Warning):</span>
                </div>
                <p className="text-[11px] leading-relaxed">{currentMed.blackBoxWarning}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddMed}
              className="px-4 py-2 bg-slate-900 dark:bg-teal-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إدراج الدواء في الوصفة</span>
            </button>
          </div>

          {/* Current Items in Rx */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
              الأدوية المدرجة في هذه الوصفة ({prescriptionItems.length}):
            </h4>

            {prescriptionItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-teal-900 dark:text-teal-200 font-bold">{item.tradeName}</strong>
                    <span className="text-slate-500 font-mono">({item.genericName})</span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold text-[10px]">
                      {item.dosage}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    التكرار: <strong>{item.frequency}</strong> · المدة: <strong>{item.duration}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                  title="حذف الدواء"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              تعليمات وتحذيرات خاصة للمريض والصيدلي
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            ></textarea>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>معاينة الطباعة</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-500 font-bold"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-700/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>اعتماد الوصفة وختمها رسمياً</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
