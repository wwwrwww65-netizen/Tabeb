import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Search, 
  Layers, 
  ChevronRight, 
  Stethoscope, 
  Sparkles,
  Info,
  Calendar,
  Users
} from 'lucide-react';
import { Department, getDepartmentColorStyles } from '../data/departments';
import { Doctor } from '../types';
import { DepartmentIcon, AVAILABLE_DEPARTMENT_ICONS } from './DepartmentIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  doctors: Doctor[];
  onCreateDepartment: (dept: Omit<Department, 'id'> & { id?: string }) => Promise<void>;
  onUpdateDepartment: (id: string, updated: Partial<Department>) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onResetDepartments: () => Promise<void>;
  initialEditDepartment?: Department | null;
}

const COLOR_OPTIONS: { id: string; label: string; bgClass: string; borderClass: string }[] = [
  { id: 'teal', label: 'أخضر مزرق (Teal)', bgClass: 'bg-teal-500', borderClass: 'border-teal-600' },
  { id: 'indigo', label: 'نيلي (Indigo)', bgClass: 'bg-indigo-500', borderClass: 'border-indigo-600' },
  { id: 'amber', label: 'عنبري (Amber)', bgClass: 'bg-amber-500', borderClass: 'border-amber-600' },
  { id: 'purple', label: 'بنفسجي (Purple)', bgClass: 'bg-purple-500', borderClass: 'border-purple-600' },
  { id: 'rose', label: 'وردي ياقوتي (Rose)', bgClass: 'bg-rose-500', borderClass: 'border-rose-600' },
  { id: 'cyan', label: 'سماوي (Cyan)', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-600' },
  { id: 'emerald', label: 'زمردي (Emerald)', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-600' },
  { id: 'blue', label: 'أزرق كلاسيكي (Blue)', bgClass: 'bg-blue-500', borderClass: 'border-blue-600' }
];

export const DepartmentManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  departments,
  doctors,
  onCreateDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onResetDepartments,
  initialEditDepartment = null
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Delete confirmation
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Form states
  const [formId, setFormId] = useState<string>('');
  const [formNameAr, setFormNameAr] = useState<string>('');
  const [formNameEn, setFormNameEn] = useState<string>('');
  const [formBadge, setFormBadge] = useState<string>('');
  const [formIconName, setFormIconName] = useState<string>('Stethoscope');
  const [formAccentColor, setFormAccentColor] = useState<string>('teal');
  const [formShortDesc, setFormShortDesc] = useState<string>('');
  const [formFullDesc, setFormFullDesc] = useState<string>('');
  const [formTargetDisorders, setFormTargetDisorders] = useState<string[]>([]);
  const [newDisorderInput, setNewDisorderInput] = useState<string>('');
  const [formRecommendedTreatments, setFormRecommendedTreatments] = useState<string[]>([]);
  const [newTreatmentInput, setNewTreatmentInput] = useState<string>('');
  const [formDoctorCount, setFormDoctorCount] = useState<number>(1);

  // Pre-load if opened directly with edit
  useEffect(() => {
    if (initialEditDepartment && isOpen) {
      handleStartEdit(initialEditDepartment);
    } else if (isOpen && !initialEditDepartment) {
      setViewMode('list');
      setEditingDepartmentId(null);
    }
  }, [initialEditDepartment, isOpen]);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingDepartmentId(null);
    setFormId('');
    setFormNameAr('');
    setFormNameEn('');
    setFormBadge('');
    setFormIconName('Stethoscope');
    setFormAccentColor('teal');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormTargetDisorders([
      'اضطراب التكيف والضغوط النفسية',
      'أعراض القلق والتوتر'
    ]);
    setFormRecommendedTreatments([
      'التقييم الإكلينيكي المتخصص',
      'جلسات الدعم والمتابعة المجدولة'
    ]);
    setFormDoctorCount(1);
    setViewMode('form');
  };

  const handleStartEdit = (dept: Department) => {
    setEditingDepartmentId(dept.id);
    setFormId(dept.id);
    setFormNameAr(dept.nameAr);
    setFormNameEn(dept.nameEn);
    setFormBadge(dept.badge);
    setFormIconName(dept.iconName || 'Stethoscope');
    setFormAccentColor(dept.accentColor || 'teal');
    setFormShortDesc(dept.shortDesc);
    setFormFullDesc(dept.fullDesc);
    setFormTargetDisorders([...dept.targetDisorders]);
    setFormRecommendedTreatments([...dept.recommendedTreatments]);
    setFormDoctorCount(dept.doctorCount || 1);
    setViewMode('form');
  };

  const handleAddDisorder = () => {
    if (newDisorderInput.trim()) {
      if (!formTargetDisorders.includes(newDisorderInput.trim())) {
        setFormTargetDisorders([...formTargetDisorders, newDisorderInput.trim()]);
      }
      setNewDisorderInput('');
    }
  };

  const handleRemoveDisorder = (index: number) => {
    setFormTargetDisorders(formTargetDisorders.filter((_, i) => i !== index));
  };

  const handleAddTreatment = () => {
    if (newTreatmentInput.trim()) {
      if (!formRecommendedTreatments.includes(newTreatmentInput.trim())) {
        setFormRecommendedTreatments([...formRecommendedTreatments, newTreatmentInput.trim()]);
      }
      setNewTreatmentInput('');
    }
  };

  const handleRemoveTreatment = (index: number) => {
    setFormRecommendedTreatments(formRecommendedTreatments.filter((_, i) => i !== index));
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim()) {
      alert('يرجى كتابة اسم القسم باللغة العربية');
      return;
    }

    setIsSubmitting(true);
    try {
      const deptData: Omit<Department, 'id'> & { id?: string } = {
        id: formId.trim() || undefined,
        nameAr: formNameAr.trim(),
        nameEn: formNameEn.trim() || 'Clinical Department',
        badge: formBadge.trim() || 'خدمة متخصصة',
        iconName: formIconName,
        accentColor: formAccentColor,
        shortDesc: formShortDesc.trim() || formNameAr.trim(),
        fullDesc: formFullDesc.trim() || formShortDesc.trim() || formNameAr.trim(),
        targetDisorders: formTargetDisorders.length > 0 ? formTargetDisorders : ['استشارات نفسية عامة'],
        recommendedTreatments: formRecommendedTreatments.length > 0 ? formRecommendedTreatments : ['بروتوكول علاجي معتمد'],
        doctorCount: Number(formDoctorCount) || 1
      };

      if (editingDepartmentId) {
        await onUpdateDepartment(editingDepartmentId, deptData);
        setFeedbackMessage(`تم تحديث بيانات قسم "${formNameAr}" بنجاح`);
      } else {
        await onCreateDepartment(deptData);
        setFeedbackMessage(`تمت إضافة قسم "${formNameAr}" بنجاح إلى الصفحة الرئيسية`);
      }

      setTimeout(() => setFeedbackMessage(null), 3500);
      setViewMode('list');
      setEditingDepartmentId(null);
    } catch (err: any) {
      alert('حدث خطأ أثناء حفظ بيانات القسم: ' + (err.message || 'خطأ غير متوقع'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    setIsSubmitting(true);
    try {
      await onDeleteDepartment(departmentToDelete.id);
      setFeedbackMessage(`تم حذف قسم "${departmentToDelete.nameAr}" بنجاح`);
      setTimeout(() => setFeedbackMessage(null), 3500);
      setDepartmentToDelete(null);
    } catch (err: any) {
      alert('تعذر حذف القسم: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsSubmitting(true);
    try {
      await onResetDepartments();
      setFeedbackMessage('تمت استعادة الأقسام الطبية الافتراضية الأربعة بنجاح');
      setTimeout(() => setFeedbackMessage(null), 3500);
      setShowResetConfirm(false);
    } catch (err: any) {
      alert('تعذر استعادة الأقسام الافتراضية: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered departments
  const filteredDepartments = departments.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.nameAr.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.shortDesc.toLowerCase().includes(q) ||
      d.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  لوحة تحكم الأقسام الطبية
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                  {departments.length} أقسام تخصصية
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                التحكم الكامل في الأقسام الطبية المعروضة في الصفحة الرئيسية ونظام الحجز (إضافة، تعديل، حذف)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'form' ? (
              <button
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>العودة للقائمة</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleStartAdd}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {viewMode === 'list' && (
            <>
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن قسم طبي بالاسم، الوصف، أو الشارة..."
                    className="w-full pr-9 pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      مسح
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="استعادة الأقسام الأصلية الأربعة"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>
                </div>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDepartments.map((dept) => {
                  const colors = getDepartmentColorStyles(dept.accentColor);
                  const assignedDoctors = doctors.filter(d => d.departmentId === dept.id);

                  return (
                    <div
                      key={dept.id}
                      className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative group"
                    >
                      <div className="space-y-3">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                              <DepartmentIcon iconName={dept.iconName} className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                  {dept.nameAr}
                                </h3>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 block" dir="ltr">
                                {dept.nameEn}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(dept)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50 dark:text-slate-400 dark:hover:text-teal-300 transition-colors cursor-pointer"
                              title="تعديل بيانات القسم"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDepartmentToDelete(dept)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                              title="حذف هذا القسم"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Badge and Metadata */}
                        <div className="flex items-center flex-wrap gap-2 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
                            {dept.badge}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>{assignedDoctors.length} أطباء مرتبطين</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ID: {dept.id}
                          </span>
                        </div>

                        {/* Descriptions */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {dept.fullDesc || dept.shortDesc}
                        </p>

                        {/* Disorders Preview */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                            الاضطرابات المستهدفة ({dept.targetDisorders.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {dept.targetDisorders.slice(0, 4).map((disorder, idx) => (
                              <span 
                                key={idx}
                                className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                              >
                                {disorder}
                              </span>
                            ))}
                            {dept.targetDisorders.length > 4 && (
                              <span className="text-[10px] text-slate-400 px-1 py-0.5">
                                +{dept.targetDisorders.length - 4} أخرى
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Quick Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>نشط في الصفحة الرئيسية</span>
                        </span>

                        <button
                          onClick={() => handleStartEdit(dept)}
                          className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل التفاصيل</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDepartments.length === 0 && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 space-y-3">
                  <Layers className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    لا توجد أقسام مطابقة للبحث
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    لم نجد نتائج مطابقة لعبارة البحث. يمكنك إضافة قسم جديد أو إعادة تعيين البحث.
                  </p>
                  <button
                    onClick={handleStartAdd}
                    className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
                  >
                    إضافة قسم جديد الآن
                  </button>
                </div>
              )}
            </>
          )}

          {/* Form Mode (Add or Edit) */}
          {viewMode === 'form' && (
            <form onSubmit={handleSaveForm} className="space-y-5">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                      {editingDepartmentId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {editingDepartmentId ? `تعديل قسم: ${formNameAr || '...'}` : 'إضافة قسم طبي جديد للمنصة'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        سيظهر هذا القسم مباشرة في الصفحة الرئيسية ونماذج الحجز للمرضى
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Info Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      اسم القسم بالعربية <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formNameAr}
                      onChange={(e) => setFormNameAr(e.target.value)}
                      placeholder="مثال: قسم علاج الإدمان والتأهيل السلوكي"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      اسم القسم بالإنجليزية <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formNameEn}
                      onChange={(e) => setFormNameEn(e.target.value)}
                      placeholder="مثال: Addiction Rehab & Behavioral Health"
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-left font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      شارة القسم / التخصص المختصر <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="مثال: بروتوكولات التعافي وسحب السموم"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      معرف القسم البرمجي (Slug ID)
                    </label>
                    <input
                      type="text"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      disabled={!!editingDepartmentId}
                      placeholder="اتركه فارغاً للتوليد التلقائي (مثال: addiction_rehab)"
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    اللون المميز للقسم (Accent Color):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((col) => {
                      const isSelected = formAccentColor === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setFormAccentColor(col.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-slate-900 dark:border-white shadow-xs ring-2 ring-teal-500/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass}`}></span>
                          <span>{col.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Icon Selector Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    أيقونة القسم (اختر الأيقونة المعبرة عن القسم):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    {AVAILABLE_DEPARTMENT_ICONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formIconName.toLowerCase() === opt.name.toLowerCase();
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setFormIconName(opt.name)}
                          className={`p-2 rounded-xl text-right flex items-center gap-2.5 border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold ring-1 ring-teal-500'
                              : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs block truncate">{opt.label}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{opt.category}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Short and Full Descriptions */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      الوصف المختصر (يظهر في كروت العرض السريع) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="مثال: بروتوكولات دوائية وسلوكية للتعافي التام وبناء المقاومة."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      الوصف الإكلينيكي الكامل والشامل <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formFullDesc}
                      onChange={(e) => setFormFullDesc(e.target.value)}
                      placeholder="اكتب شرحاً وافياً للمنظومة العلاجية، الأهداف السريرية، ونوعية الاستشارات المقدمة في هذا القسم..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Target Disorders Manager */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>الحالات والاضطرابات التي يعالجها القسم ({formTargetDisorders.length}):</span>
                    <span className="text-[11px] text-slate-400 font-normal">أضف الاضطرابات التي يغطيها كادر هذا القسم</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDisorderInput}
                      onChange={(e) => setNewDisorderInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDisorder();
                        }
                      }}
                      placeholder="اكتب اسم الاضطراب واضغط إضافة (مثال: نوبات الهلع، الوسواس القهري)..."
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddDisorder}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة حالة</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formTargetDisorders.map((disorder, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 text-xs font-medium border border-teal-200 dark:border-teal-800 flex items-center gap-1.5"
                      >
                        <span>{disorder}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDisorder(idx)}
                          className="text-teal-600 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Treatments Manager */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>العلاجات والبروتوكولات الموصى بها ({formRecommendedTreatments.length}):</span>
                    <span className="text-[11px] text-slate-400 font-normal">العلاجات والتقنيات السريرية المعمول بها</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTreatmentInput}
                      onChange={(e) => setNewTreatmentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTreatment();
                        }
                      }}
                      placeholder="اكتب البروتوكول واضغط إضافة (مثال: العلاج المعرفي السلوكي CBT)..."
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTreatment}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة علاج</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formRecommendedTreatments.map((treatment, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-xs font-medium border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
                      >
                        <span>{treatment}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTreatment(idx)}
                          className="text-indigo-600 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء والعودة
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>جاري الحفظ...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingDepartmentId ? 'حفظ تعديلات القسم' : 'إضافة وتثبيت القسم في الصفحة الرئيسية'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Confirmation Overlay */}
        {departmentToDelete && (
          <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right border border-rose-200 dark:border-rose-900/50 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  هل أنت متأكد من حذف قسم "{departmentToDelete.nameAr}"؟
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  سيتم إزالة هذا القسم فوراً من الصفحة الرئيسية، ولن يظهر في خيارات حجز المواعيد للمرضى.
                </p>

                {doctors.filter(d => d.departmentId === departmentToDelete.id).length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                    ⚠️ تنبيه: يوجد {doctors.filter(d => d.departmentId === departmentToDelete.id).length} أطباء مسجلين في هذا القسم. سيتمكن المرضى من الوصول إليهم بشكل فردي.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDepartmentToDelete(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'جاري الحذف...' : 'تأكيد الحذف نهائياً'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-right border border-amber-200 dark:border-amber-900/50 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  استعادة الأقسام الطبية الافتراضية
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  سيتم إعادة تعيين قائمة الأقسام لتشمل الأقسام الأربعة الأصلية (الطب النفسي، العلاج النفسي CBT، التغذية العلاجية، والخدمة الاجتماعية).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  تراجع
                </button>
                <button
                  onClick={handleConfirmReset}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'جاري الاستعادة...' : 'نعم، استعادة الافتراضي'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
