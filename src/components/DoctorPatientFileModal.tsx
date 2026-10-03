import React, { useState } from 'react';
import { 
  X, 
  User, 
  FileText, 
  Activity, 
  Pill, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Printer, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Heart, 
  Scale, 
  Award,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { Patient, ScaleAssessmentResult, Prescription, SavedClinicalRecord } from '../types';
import { clinicalStorage } from '../services/clinicalRecords';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  scaleResults: ScaleAssessmentResult[];
  prescriptions: Prescription[];
  onOpenNewSOAP?: () => void;
  onOpenNewScale?: () => void;
  onOpenNewRx?: () => void;
}

export const DoctorPatientFileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patient,
  scaleResults,
  prescriptions,
  onOpenNewSOAP,
  onOpenNewScale,
  onOpenNewRx
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'scales' | 'meds' | 'vitals' | 'goals'>('overview');

  if (!isOpen) return null;

  const savedRecords: SavedClinicalRecord[] = clinicalStorage.getPatientRecords(patient.id);
  const patientScales = scaleResults.filter(s => s.patientId === patient.id);
  const patientRx = prescriptions.filter(rx => rx.patientId === patient.id);

  const handlePrintFile = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[92vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-900 via-teal-950 to-slate-900 text-white p-6 border-b border-teal-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
              {patient.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 font-mono font-bold border border-teal-700/60">
                  {patient.fileNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {patient.age} سنة · {patient.gender}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                التشخيص الرئيسي: <strong className="text-teal-300">{patient.primaryDiagnosis}</strong> {patient.icd10Code && `(${patient.icd10Code})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintFile}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
              title="طباعة الملف الطبي الشامل"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            نظرة سريرية شاملة
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'sessions' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            سجل الجلسات والنماذج ({savedRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('scales')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'scales' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            المقاييس والتقدم ({patientScales.length})
          </button>
          <button
            onClick={() => setActiveTab('meds')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'meds' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            الأدوية والحساسية ({patientRx.length})
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'vitals' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            القياسات الحيوية والوزن
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'goals' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            أهداف الخطة العلاجية ({patient.treatmentGoals?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-900 dark:text-slate-100">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Allergy Alert Banner if any */}
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-rose-800 dark:text-rose-300 text-sm">
                      تنبيه حساسية دوائية شديدة (Drug Allergy Alert):
                    </strong>
                    {patient.allergies.map(alg => (
                      <div key={alg.id}>
                        • <strong>{alg.substance}</strong> ({alg.severity}): {alg.reaction}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                  ✓ لا توجد حساسيات دوائية مسجلة حتى الآن.
                </div>
              )}

              {/* Medical & Social History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-xs text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>التاريخ الطبي والنفسي السابق</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {patient.medicalHistory || 'لا توجد سوابق استشفاء نفسي أو جراحي معقد.'}
                  </p>
                  {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <strong>الأمراض المزمنة:</strong> {patient.chronicConditions.join(' · ')}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-xs text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>الخلفية الاجتماعية والبيئة الداعمة</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {patient.socialHistory || 'بيئة أسرية متعاونة، يمارس أنشطته اليومية والمهنية.'}
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                    <span>الطبيب المعالج: <strong>{patient.assignedDoctor}</strong></span>
                    <span>آخر زيارة: <strong>{patient.lastVisit}</strong></span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 pt-2">
                {onOpenNewSOAP && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNewSOAP();
                    }}
                    className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>توثيق جلسة علاجية (SOAP)</span>
                  </button>
                )}

                {onOpenNewRx && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNewRx();
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Pill className="w-4 h-4" />
                    <span>إصدار وصفة إلكترونية</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SESSIONS & FORMS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {savedRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد نماذج سريرية محفوظة لهذا المريض حتى الآن.
                </div>
              ) : (
                savedRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="p-5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 block">{rec.recordNumber}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.titleAr}</h4>
                      </div>

                      <div className="text-left text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          {rec.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{rec.date}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rec.summaryText}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span>المختص: <strong>{rec.doctorName}</strong> ({rec.doctorLicenseNumber})</span>
                      <span className="font-mono text-[10px] text-teal-600">✓ ختم وتوقيع إلكتروني رسمي</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SCALES & PROGRESS */}
          {activeTab === 'scales' && (
            <div className="space-y-4">
              {patientScales.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد مقاييس مكتملة لهذا المريض.
                </div>
              ) : (
                patientScales.map(sc => (
                  <div
                    key={sc.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sc.scaleName}</h4>
                      <p className="text-[11px] text-slate-500">{sc.clinicianNotes || sc.severity.interpretation}</p>
                      <div className="text-[10px] text-slate-400">{sc.date}</div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="text-lg font-black text-teal-700 dark:text-teal-400">
                        {sc.totalScore} <span className="text-xs font-normal text-slate-400">درجة</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {sc.severity.labelAr}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: MEDS */}
          {activeTab === 'meds' && (
            <div className="space-y-4">
              {patientRx.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد وصفات دوائية مسجلة.
                </div>
              ) : (
                patientRx.map(rx => (
                  <div
                    key={rx.id}
                    className="p-5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-teal-600">{rx.prescriptionNumber || rx.id}</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">التشخيص: {rx.diagnosis}</h4>
                      </div>
                      <span className="text-xs text-slate-400">{rx.date}</span>
                    </div>

                    <div className="space-y-2">
                      {rx.items.map((item, iIdx) => (
                        <div key={iIdx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                            <span>{item.tradeName} ({item.genericName})</span>
                            <span className="text-teal-600">{item.dosage}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{item.instructions} · {item.duration}</p>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>الطبيب: {rx.doctorName} ({rx.licenseNumber})</span>
                      <span className="text-emerald-600 font-bold">✓ وصفة معتمدة ومختومة</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: VITALS */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patient.vitalsHistory?.map((vit, vIdx) => (
                  <div key={vIdx} className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>تاريخ الرصد: {vit.date}</span>
                      <span className="text-teal-600">{vit.weightKg} كجم</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>ضغط الدم: <strong>{vit.bloodPressure}</strong></div>
                      <div>النبض: <strong>{vit.heartRate} ن/د</strong></div>
                      {vit.fastingGlucoseMgDl && (
                        <div>السكر الصائم: <strong>{vit.fastingGlucoseMgDl} مجم/دسل</strong></div>
                      )}
                    </div>
                    {vit.notes && <p className="text-[10px] text-slate-400">{vit.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TREATMENT GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-3">
              {patient.treatmentGoals?.map(goal => (
                <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{goal.title}</h4>
                    <div className="text-[10px] text-slate-400">تاريخ الهدف: {goal.targetDate} · فئة: {goal.category}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 shrink-0">
                    {goal.status}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
