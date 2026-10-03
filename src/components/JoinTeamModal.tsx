import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  DollarSign, 
  Globe, 
  GraduationCap, 
  FileText,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinTeamModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('اليمن');
  const [degree, setDegree] = useState('ماجستير');
  const [specialty, setSpecialty] = useState('علاج نفسي معرفي سلوكي (CBT)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [dialects, setDialects] = useState('يمنية / بيضاء ميسرة');
  const [bio, setBio] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right my-8 transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-900 via-teal-950 to-slate-900 text-white p-6 border-b border-teal-900/40 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 font-bold border border-teal-700/60">
                  فرص الانضمام والتوظيف
                </span>
                <span className="text-xs text-slate-400">Join CoolMind Clinical Faculty</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">انضم إلى كادر كول مايند الطبي</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                مساحة عمل احترافية، دخل إضافي شفاف (75%)، ومرونة كاملة في تحديد ساعات عملك
              </p>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تم استلام طلب انضمامك بنجاح!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              شكراً لاهتمامك بالانضمام لمنظومة كول مايند. سيقوم فريق الإشراف الإكلينيكي والاعتماد بمراجعة مؤهلاتك وترخيصك المهني والتواصل معك خلال 48 ساعة لتحديد موعد المقابلة السريرية.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-md mx-auto text-xs text-slate-500 space-y-1.5 text-right">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">مسار اعتماد المعالج الجديد:</div>
              <div>1. فحص المؤهلات والترخيص المهني الساري ✓</div>
              <div>2. المقابلة السريرية مع رئيس المجلس الطبي (عن بُعد)</div>
              <div>3. اجتياز اختبار المعايير الأخلاقية والأمان الدوائي</div>
              <div>4. تفعيل حساب المستشار المعتمد وجدول الحجوزات</div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>دوام مرن بالكامل من أي مكان</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>نسبة 75% من قيمة الجلسات</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>إشراف وتدريب سريري مستمر</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل واللقب المهني *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="د. / أ. محمد..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف / واتساب *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+967-77XXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  بلد الإقامة الحالي
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="اليمن">اليمن</option>
                  <option value="السعودية">المملكة العربية السعودية</option>
                  <option value="الإمارات">الإمارات العربية المتحدة</option>
                  <option value="مصر">مصر</option>
                  <option value="الأردن">الأردن</option>
                  <option value="دولة أخرى">المهجر / دولة أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الدرجة العلمية *
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="دكتوراه / بورد طبي">دكتوراه / بورد طبي في الطب النفسي</option>
                  <option value="ماجستير">ماجستير في علم النفس الإكلينيكي / التغذية</option>
                  <option value="دبلوم عالي معتمد">دبلوم عالي معتمد + 5 سنوات خبرة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التخصص الدقيق *
                </label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="علاج معرفي سلوكي، صدمات EMDR، إدمان..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم ترخيص مزاولة المهنة *
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="YM-MED-XXXX أو رقم الترخيص المعتمد"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سنوات الخبرة الإكلينيكية
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="3-5">3 - 5 سنوات</option>
                  <option value="5-10">5 - 10 سنوات</option>
                  <option value="+10">+10 سنوات خبرة استشارية</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اللهجات واللغات التي تقدم بها الجلسات
              </label>
              <input
                type="text"
                value={dialects}
                onChange={(e) => setDialects(e.target.value)}
                placeholder="يمنية، خليجية، فصحى، إنجليزية..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نبذة مهنية موجزة والمدارس العلاجية
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة عن مسيرتك المهنية وأبرز الحالات التي تعالجها..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden resize-none"
              ></textarea>
            </div>

            {/* Upload CV / License */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رفع السيرة الذاتية وصورة الترخيص المهني (PDF / JPG)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-teal-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/40">
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                  <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {uploadedFileName ? uploadedFileName : 'انقر هنا لرفع ملف السيرة والترخيص'}
                  </span>
                  <span className="text-[10px] text-slate-400">الحد الأقصى 10 ميجابايت</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إرسال طلب الانضمام إلى لجنة الاعتماد</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
