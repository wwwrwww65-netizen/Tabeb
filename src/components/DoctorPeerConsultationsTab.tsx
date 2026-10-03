import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { StaffUser, PeerConsultation, DoctorReferral, Patient } from '../types';
import { clinicalStorage, INITIAL_PEER_CONSULTATIONS, INITIAL_DOCTOR_REFERRALS } from '../services/clinicalRecords';
import { OFFICIAL_DOCTORS_TEAM } from '../data/packagesAndCoupons';

interface Props {
  currentStaff: StaffUser | null;
  patients: Patient[];
}

export const DoctorPeerConsultationsTab: React.FC<Props> = ({ currentStaff, patients }) => {
  const [consultations, setConsultations] = useState<PeerConsultation[]>(() => {
    return clinicalStorage.getPeerConsultations();
  });
  const [referrals, setReferrals] = useState<DoctorReferral[]>(() => {
    return clinicalStorage.getReferrals();
  });

  const [activeSubTab, setActiveSubTab] = useState<'board' | 'referrals'>('board');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // New consultation state
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('الطب النفسي والدوائي');
  const [newAge, setNewAge] = useState(28);
  const [newGender, setNewGender] = useState<'ذكر' | 'أنثى'>('أنثى');
  const [newDescription, setNewDescription] = useState('');

  // New referral state
  const [isNewReferralOpen, setIsNewReferralOpen] = useState(false);
  const [referralPatientId, setReferralPatientId] = useState(patients[0]?.id || '');
  const [referralDoctorId, setReferralDoctorId] = useState(OFFICIAL_DOCTORS_TEAM[0]?.id || '');
  const [referralReason, setReferralReason] = useState('');
  const [referralUrgency, setReferralUrgency] = useState<'عاجل' | 'روتيني'>('روتيني');

  const handleAddReply = (consultationId: string) => {
    const text = replyText[consultationId]?.trim();
    if (!text) return;

    const updated = clinicalStorage.addPeerReply(consultationId, {
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      doctorSpecialty: currentStaff?.specialty || 'استشاري الطب النفسي',
      text
    });

    setConsultations(updated);
    setReplyText(prev => ({ ...prev, [consultationId]: '' }));
  };

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    const item: PeerConsultation = {
      id: 'peer-' + Date.now(),
      title: newTitle,
      category: newCategory,
      anonymousPatientAge: newAge,
      anonymousPatientGender: newGender,
      description: newDescription,
      authorDoctorId: currentStaff?.doctorId || 'doc-hakim',
      authorDoctorName: `${currentStaff?.name || 'د. طارق الحكيم'} (${currentStaff?.specialty || 'استشاري'})`,
      createdAt: 'اليوم · ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      replies: []
    };

    const updated = clinicalStorage.savePeerConsultation(item);
    setConsultations(updated);
    setIsNewConsultationOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === referralPatientId) || patients[0];
    const targetDoctor = OFFICIAL_DOCTORS_TEAM.find(d => d.id === referralDoctorId) || OFFICIAL_DOCTORS_TEAM[0];

    const ref: DoctorReferral = {
      id: 'ref-' + Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      fromDoctorId: currentStaff?.doctorId || 'doc-hakim',
      fromDoctorName: currentStaff?.name || 'د. طارق الحكيم',
      toDoctorId: targetDoctor.id,
      toDoctorName: targetDoctor.name,
      toSpecialty: targetDoctor.specialty,
      reason: referralReason || 'إحالة علاجية لاستكمال خطة الرعاية متعددة التخصصات.',
      urgency: referralUrgency,
      date: new Date().toISOString().split('T')[0],
      status: 'قيد المراجعة'
    };

    const updated = clinicalStorage.saveReferral(ref);
    setReferrals(updated);
    setIsNewReferralOpen(false);
    setReferralReason('');
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                التعاون السريري والإحالات
              </span>
              <span className="text-xs text-slate-400">Peer Consultations & Multidisciplinary Referrals</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              منصة الاستشارات البينية وإحالة الحالات
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مساحة آمنة لمناقشة الحالات المعقدة بهوية سرية مجهولة، وتبادل الآراء السريرية، والإحالة بين التخصصات
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewConsultationOpen(true)}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>طرح استشارة حالة جديدة</span>
            </button>

            <button
              onClick={() => setIsNewReferralOpen(true)}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>إحالة مريض لمختص</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'board'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          مجلس استشارات الزملاء ({consultations.length})
        </button>

        <button
          onClick={() => setActiveSubTab('referrals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'referrals'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          سجل الإحالات والتحويلات ({referrals.length})
        </button>
      </div>

      {/* SUBTAB 1: CONSULTATIONS BOARD */}
      {activeSubTab === 'board' && (
        <div className="space-y-6">
          {consultations.map(c => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      حالة مجهولة الهوية: {c.anonymousPatientGender} · {c.anonymousPatientAge} سنة
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {c.title}
                  </h3>
                </div>

                <div className="text-left text-xs text-slate-400 shrink-0">
                  <div className="font-bold text-slate-700 dark:text-slate-300">{c.authorDoctorName}</div>
                  <div className="text-[10px] mt-0.5">{c.createdAt}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
                {c.description}
              </p>

              {/* Replies */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الردود والآراء السريرية للزملاء ({c.replies.length}):
                </h4>

                {c.replies.map(rep => (
                  <div
                    key={rep.id}
                    className="p-3.5 bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-teal-950 dark:text-teal-200">
                      <span>{rep.doctorName} · <span className="font-normal text-slate-500">{rep.doctorSpecialty}</span></span>
                      <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rep.text}</p>
                  </div>
                ))}

                {/* Reply Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={replyText[c.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [c.id]: e.target.value })}
                    placeholder="اكتب رأيك السريري أو التوصية الدوائية/السلوكية..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddReply(c.id)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال الرأي</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: REFERRALS */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-4">
          {referrals.map(ref => (
            <div
              key={ref.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center">
                    {ref.patientName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{ref.patientName}</h4>
                    <div className="text-[10px] text-slate-400">
                      محال من: <strong>{ref.fromDoctorName}</strong> إلى <strong>{ref.toDoctorName}</strong> ({ref.toSpecialty})
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    ref.urgency === 'عاجل'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-teal-50 text-teal-800 border-teal-200'
                  }`}>
                    {ref.urgency}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{ref.date}</div>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <strong>السبب السريري للإحالة:</strong> {ref.reason}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>الحالة: <strong className="text-teal-600">{ref.status}</strong></span>
                <span className="font-mono text-[10px] text-teal-700">✓ موثق في السجل الطبي الموحد</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Consultation Modal */}
      {isNewConsultationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">طرح استشارة حالة جديدة (بهوية مجهولة)</h3>
            <p className="text-xs text-slate-500">لضمان السرية، لا تذكر اسم المريض أو أي بيانات شخصية تعرفه.</p>

            <form onSubmit={handleCreateConsultation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان الاستشارة السريرية</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: حالة وسواس قهري لا تستجيب للجرعة القصوى من الدواء..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">الفئة</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="الطب النفسي والدوائي">دوائي</option>
                    <option value="العلاج المعرفي السلوكي">CBT</option>
                    <option value="التغذية العصبية">تغذية</option>
                    <option value="إرشاد أسري وزوجي">أسري</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">العمر التقريبي</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(parseInt(e.target.value) || 28)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">الجنس</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="أنثى">أنثى</option>
                    <option value="ذكر">ذكر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">وصف الحالة والتساؤل السريري</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اكتب ملخص الأعراض، الأدوية السابقة، الاستجابة، والتساؤل المطلوب من الزملاء..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewConsultationOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  نشر الاستشارة للزملاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {isNewReferralOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">إحالة مريض لمختص زميل</h3>

            <form onSubmit={handleCreateReferral} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">المريض المراد إحالته</label>
                <select
                  value={referralPatientId}
                  onChange={(e) => setReferralPatientId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.fileNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">المختص المستهدف بالإحالة</label>
                <select
                  value={referralDoctorId}
                  onChange={(e) => setReferralDoctorId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {OFFICIAL_DOCTORS_TEAM.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">درجة الاستعجال</label>
                <select
                  value={referralUrgency}
                  onChange={(e) => setReferralUrgency(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="روتيني">روتيني (خلال الأسبوع)</option>
                  <option value="عاجل">عاجل (خلال 24-48 ساعة)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">السبب السريري والتوصية</label>
                <textarea
                  rows={3}
                  required
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  placeholder="سبب التحويل والتوصيات للمختص الزميل..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewReferralOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  اعتماد الإحالة وإشعار المختص
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
