import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User, 
  Sparkles,
  Stethoscope,
  Award
} from 'lucide-react';
import { StaffUser, Patient, MedicalReport } from '../types';
import { clinicalStorage, INITIAL_MEDICAL_REPORTS } from '../services/clinicalRecords';

interface Props {
  currentStaff: StaffUser | null;
  patients: Patient[];
  activePatient: Patient;
}

export const DoctorReportsTab: React.FC<Props> = ({ currentStaff, patients, activePatient }) => {
  const [reports, setReports] = useState<MedicalReport[]>(() => {
    return clinicalStorage.getMedicalReports();
  });

  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'تقرير طبي نفسي' | 'إجازة مرضية معتمدة' | 'خطاب تحويل استشاري' | 'إقرار وموافقة مستنيرة'>('تقرير طبي نفسي');
  const [selectedPatientId, setSelectedPatientId] = useState(activePatient.id);
  const [daysGranted, setDaysGranted] = useState(3);
  const [diagnosisText, setDiagnosisText] = useState(activePatient.primaryDiagnosis || '');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [selectedReportForPrint, setSelectedReportForPrint] = useState<MedicalReport | null>(null);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || activePatient;
    const reportNumber = `REP-${Date.now().toString().slice(-6)}`;

    const newRep: MedicalReport = {
      id: 'rep-' + Date.now(),
      reportNumber,
      patientId: patient.id,
      patientName: patient.name,
      patientFileNumber: patient.fileNumber,
      doctorId: currentStaff?.doctorId || 'doc-hakim',
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      type: reportType,
      date: new Date().toISOString().split('T')[0],
      daysGranted: reportType === 'إجازة مرضية معتمدة' ? daysGranted : undefined,
      diagnosis: diagnosisText,
      clinicalSummary: clinicalSummary || 'تمت معاينة الحالة سريرياً وتوثيق التقييم النفسي وفق المعايير المعتمدة.',
      recommendations: recommendations || 'الالتزام بالخطة العلاجية والراحة والمراجعة الدورية.',
      isOfficialStamped: true
    };

    const updated = clinicalStorage.saveMedicalReport(newRep);
    setReports(updated);
    setIsNewReportModalOpen(false);
    setSelectedReportForPrint(newRep);
  };

  const handlePrint = () => {
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
                التقارير والمستندات الطبية الرسمية
              </span>
              <span className="text-xs text-slate-400">Clinical Reports & Sick Leaves</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              إصدار التقارير الطبية والإجازات المعتمدة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مولد تقارير نفسية رسمية، إجازات مرضية مختومة، وخطابات إحالة معتمدة قابلة للطباعة والتصدير
            </p>
          </div>

          <button
            onClick={() => {
              setDiagnosisText(activePatient.primaryDiagnosis || '');
              setIsNewReportModalOpen(true);
            }}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إصدار تقرير طبي جديد</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(rep => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 text-xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">{rep.reportNumber}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{rep.type}</h4>
                </div>
                <div className="text-left">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                    معتمد ومختوم ✓
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{rep.date}</div>
                </div>
              </div>

              <div className="text-slate-700 dark:text-slate-300">
                <strong>المريض:</strong> {rep.patientName} ({rep.patientFileNumber})
              </div>

              <div className="text-slate-700 dark:text-slate-300">
                <strong>التشخيص:</strong> {rep.diagnosis}
              </div>

              {rep.daysGranted && (
                <div className="text-teal-700 dark:text-teal-300 font-bold">
                  مدة الإجازة الممنوحة: {rep.daysGranted} أيام عمل
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                {rep.clinicalSummary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                المصدر: <strong>{rep.doctorName}</strong>
              </span>

              <button
                type="button"
                onClick={() => setSelectedReportForPrint(rep)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>عرض وطباعة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Report Modal */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">إصدار تقرير أو إجازة طبية</h3>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">نوع المستند الطبي</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="تقرير طبي نفسي">تقرير طبي نفسي رسمي</option>
                  <option value="إجازة مرضية معتمدة">إجازة مرضية معتمدة</option>
                  <option value="خطاب تحويل استشاري">خطاب تحويل استشاري رسمي</option>
                  <option value="إقرار وموافقة مستنيرة">إقرار وموافقة مستنيرة على العلاج</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">المريض</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.fileNumber})</option>
                  ))}
                </select>
              </div>

              {reportType === 'إجازة مرضية معتمدة' && (
                <div>
                  <label className="block font-bold mb-1">عدد أيام الإجازة</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={daysGranted}
                    onChange={(e) => setDaysGranted(parseInt(e.target.value) || 3)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold mb-1">التشخيص الطبي (ICD / DSM)</label>
                <input
                  type="text"
                  required
                  value={diagnosisText}
                  onChange={(e) => setDiagnosisText(e.target.value)}
                  placeholder="اضطراب الاكتئاب الجسيم (F32.1)..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">الملخص السريري والتقييم</label>
                <textarea
                  rows={3}
                  required
                  value={clinicalSummary}
                  onChange={(e) => setClinicalSummary(e.target.value)}
                  placeholder="اكتب التقييم السريري، مدى الاستجابة، والحالة الوظيفية..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">التوصيات الطبية</label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="التوصيات والراحة والمراجعة الدورية..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewReportModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  اعتماد التقرير وختمه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print View Modal (OBS-D-006) */}
      {selectedReportForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-right space-y-6 shadow-2xl border border-slate-200 text-slate-900">
            
            {/* Report Header */}
            <div className="flex items-center justify-between border-b-2 border-teal-700 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">منصة CoolMind للاستشارات النفسية</h2>
                <p className="text-xs text-slate-500">عيادة الطب النفسي والعلاج المعرفي السلوكي المعتمدة</p>
                <p className="text-[10px] text-slate-400">ترخيص صحي معتمد رقم: YM-MOH-2026</p>
              </div>

              <div className="text-left text-xs space-y-1">
                <div className="font-mono font-bold text-teal-700">{selectedReportForPrint.reportNumber}</div>
                <div>التاريخ: <strong>{selectedReportForPrint.date}</strong></div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-2">
              <h3 className="text-lg font-black underline text-teal-900">{selectedReportForPrint.type}</h3>
            </div>

            {/* Patient Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>اسم المريض: <strong>{selectedReportForPrint.patientName}</strong></div>
              <div>رقم الملف الطبي: <strong className="font-mono">{selectedReportForPrint.patientFileNumber}</strong></div>
              <div className="col-span-2">التشخيص الطبي: <strong>{selectedReportForPrint.diagnosis}</strong></div>
              {selectedReportForPrint.daysGranted && (
                <div className="col-span-2 text-teal-800 font-bold">
                  مدة الإجازة المرضية: {selectedReportForPrint.daysGranted} أيام
                </div>
              )}
            </div>

            {/* Body */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="font-bold text-slate-800">التقرير السريري والتقييم:</div>
              <p className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">{selectedReportForPrint.clinicalSummary}</p>

              {selectedReportForPrint.recommendations && (
                <>
                  <div className="font-bold text-slate-800 pt-2">التوصيات:</div>
                  <p className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">{selectedReportForPrint.recommendations}</p>
                </>
              )}
            </div>

            {/* Footer Signatures & Official Stamp */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">المختص المعالج:</div>
                <div className="text-xs text-teal-800 mt-1 font-bold">{selectedReportForPrint.doctorName}</div>
                <div className="text-[10px] text-slate-500 font-mono">MD-PSY-98442</div>
              </div>

              {/* Official Stamp Box */}
              <div className="border-2 border-dashed border-teal-600 rounded-xl p-3 text-center w-36 text-teal-800">
                <div className="text-[10px] font-bold">ختم المنصة الرسمي</div>
                <div className="text-xs font-black tracking-widest my-0.5">COOLMIND</div>
                <div className="text-[9px] text-slate-500">CLINICAL VERIFIED</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReportForPrint(null)}
                className="px-4 py-2 text-xs text-slate-600 font-bold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة المستند الرسمي</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
