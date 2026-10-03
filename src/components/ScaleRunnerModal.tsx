import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Check, 
  AlertTriangle, 
  Save, 
  FileText, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { PsychologicalScale, Patient, ScaleAssessmentResult, SeverityLevel } from '../types';
import { PSYCHOLOGICAL_SCALES_DATA } from '../data/psychologicalScales';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  preselectedScaleId?: string;
  onSaveResult: (result: ScaleAssessmentResult) => void;
}

export const ScaleRunnerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activePatient,
  preselectedScaleId,
  onSaveResult
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>(preselectedScaleId || 'phq-9');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [clinicianNotes, setClinicianNotes] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedScaleId) {
      setSelectedScaleId(preselectedScaleId);
    }
  }, [preselectedScaleId]);

  useEffect(() => {
    // Reset answers when scale changes
    setAnswers({});
    setIsCompleted(false);
    setClinicianNotes('');
  }, [selectedScaleId]);

  if (!isOpen) return null;

  const currentScale = PSYCHOLOGICAL_SCALES_DATA.find(s => s.id === selectedScaleId) || PSYCHOLOGICAL_SCALES_DATA[0];

  const handleSelectOption = (questionId: number, value: number) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
  };

  // Calculate score
  const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === currentScale.questions.length;

  // Determine severity
  const currentSeverity: SeverityLevel = currentScale.scoringCriteria.find(
    s => totalScore >= s.min && totalScore <= s.max
  ) || currentScale.scoringCriteria[currentScale.scoringCriteria.length - 1];

  const handleSave = () => {
    const newResult: ScaleAssessmentResult = {
      id: 'res-' + Date.now(),
      patientId: activePatient.id,
      patientName: activePatient.name,
      scaleId: currentScale.id,
      scaleName: currentScale.nameAr,
      date: new Date().toISOString().split('T')[0],
      totalScore,
      severity: currentSeverity,
      answers,
      clinicianNotes: clinicianNotes.trim() || undefined
    };

    onSaveResult(newResult);
    setIsCompleted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-300 font-semibold">{currentScale.code}</span>
                <span className="text-xs text-slate-400">· للمريض: <strong className="text-white">{activePatient.name}</strong> ({activePatient.fileNumber})</span>
              </div>
              <h2 className="text-lg font-bold">{currentScale.nameAr}</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scale Switcher Tabs */}
        <div className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-5 py-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">اختر المقياس:</span>
          {PSYCHOLOGICAL_SCALES_DATA.map(scale => (
            <button
              key={scale.id}
              onClick={() => setSelectedScaleId(scale.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedScaleId === scale.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-600'
              }`}
            >
              {scale.code}
            </button>
          ))}
        </div>

        {/* Scale Overview Info */}
        <div className="p-4 bg-teal-50/50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/60 flex items-start gap-3 text-xs text-teal-950 dark:text-teal-200">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-teal-900 dark:text-teal-100 mb-0.5">{currentScale.descriptionAr}</p>
            <div className="flex items-center gap-4 text-[11px] text-teal-800/80 dark:text-teal-300 mt-1">
              <span>الفئة المستهدفة: {currentScale.targetPopulation}</span>
              <span>· الوقت المقدر: {currentScale.estimatedMinutes} دقائق</span>
              <span>· المرجع: {currentScale.referenceCitation}</span>
            </div>
          </div>
        </div>

        {/* Questions Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {currentScale.questions.map((q, idx) => {
            const options = q.options || currentScale.defaultOptions;
            const selectedVal = answers[q.id];

            return (
              <div 
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedVal !== undefined 
                    ? 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600' 
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-relaxed">
                      {q.textAr}
                    </p>
                  </div>
                  {selectedVal !== undefined && (
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      {selectedVal} نقاط
                    </span>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {options.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.labelAr}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Clinician Notes Field */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>ملاحظات الفاحص الإكلينيكية (اختياري):</span>
            </label>
            <textarea
              value={clinicianNotes}
              onChange={(e) => setClinicianNotes(e.target.value)}
              placeholder="اكتب أي ملاحظات سلوكية أثناء تطبيق المقياس أو تفسير خاص للبنود..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

        </div>

        {/* Real-time Scoring Bar & Actions */}
        <div className="bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Score & Severity Indicator */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">الدرجة الإجمالية</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{totalScore}</span>
              </div>

              <div className="flex-1 text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مستوى الشدة:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    currentSeverity.badgeColor === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                    currentSeverity.badgeColor === 'teal' ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300' :
                    currentSeverity.badgeColor === 'amber' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                    currentSeverity.badgeColor === 'orange' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300' :
                    'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}>
                    {currentSeverity.labelAr}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {currentSeverity.interpretation}
                </p>
              </div>
            </div>

            {/* Save / Close Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={handleSave}
                disabled={!isAllAnswered || isCompleted}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                  isAllAnswered && !isCompleted
                    ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم الحفظ في ملف المريض!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>اعتماد وحفظ النتيجة ({answeredCount}/{currentScale.questions.length})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
