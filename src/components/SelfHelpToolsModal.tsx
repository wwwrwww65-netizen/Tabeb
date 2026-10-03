import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Wind, 
  Heart, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Check, 
  Smile, 
  Feather,
  Volume2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfHelpToolsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'meditation' | 'gratitude' | 'quotes'>('breathing');

  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState<'شهيق' | 'حبس النفس' | 'زفير' | 'استرخاء'>('شهيق');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Gratitude notes
  const [gratitudeNotes, setGratitudeNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('coolmind_gratitude_notes');
    return saved ? JSON.parse(saved) : [
      'ممتن لفرصة التعافي اليوم ولقدرتي على المحاولة من جديد.',
      'ممتن لشخص قريب قدّم لي دعماً واستمع إلي بإنصات.'
    ];
  });
  const [newNote, setNewNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Meditation audio simulator
  const [isMeditationPlaying, setIsMeditationPlaying] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(300); // 5 mins

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            setBreathingPhase((curr) => {
              if (curr === 'شهيق') return 'حبس النفس';
              if (curr === 'حبس النفس') return 'زفير';
              if (curr === 'زفير') return 'استرخاء';
              return 'شهيق';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  useEffect(() => {
    let interval: any = null;
    if (isMeditationPlaying && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer(t => t - 1);
      }, 1000);
    } else if (meditationTimer === 0) {
      setIsMeditationPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isMeditationPlaying, meditationTimer]);

  if (!isOpen) return null;

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...gratitudeNotes];
    setGratitudeNotes(updated);
    localStorage.setItem('coolmind_gratitude_notes', JSON.stringify(updated));
    setNewNote('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">واحة المساعدة الذاتية المجانية</h3>
              <p className="text-[11px] text-teal-100">تمارين التنفس واليقظة ومذكرة الامتنان لحفظ التوازن النفسي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'breathing' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>تنفس تفاعلي (Box)</span>
          </button>
          <button
            onClick={() => setActiveTab('meditation')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'meditation' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>تأمل واسترخاء</span>
          </button>
          <button
            onClick={() => setActiveTab('gratitude')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'gratitude' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>مذكرة الامتنان</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 dark:text-slate-300">
          {activeTab === 'breathing' && (
            <div className="text-center space-y-6 py-4">
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    isBreathingActive
                      ? breathingPhase === 'شهيق'
                        ? 'scale-110 bg-teal-500/20 border-4 border-teal-500 animate-pulse'
                        : breathingPhase === 'حبس النفس'
                        ? 'scale-105 bg-amber-500/20 border-4 border-amber-500'
                        : breathingPhase === 'زفير'
                        ? 'scale-90 bg-indigo-500/20 border-4 border-indigo-500'
                        : 'scale-95 bg-slate-500/10 border-4 border-slate-400'
                      : 'bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300'
                  }`}
                ></div>
                <div className="relative z-10 space-y-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block">
                    {isBreathingActive ? breathingPhase : 'جاهز؟'}
                  </span>
                  <span className="text-3xl font-black text-teal-600 font-mono block">
                    {isBreathingActive ? breathingSeconds : '4-4-4'}
                  </span>
                  <p className="text-[11px] text-slate-400">تقنية الصندوق المهدئة للقلب</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-8 py-2.5 rounded-xl font-bold text-xs shadow-md transition ${
                    isBreathingActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {isBreathingActive ? 'إيقاف مؤقت' : 'ابدأ تمرين التنفس الآن'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'meditation' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center border-4 border-teal-200 dark:border-teal-800">
                <Volume2 className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                  جلسة استرخاء ذهني وتفريغ التوتر (5 دقائق)
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  توجيه صوتي هادئ لمساعدتك على فك التشنج العضلي وتهدئة تدفق الأفكار المقلقة.
                </p>
              </div>

              <div className="text-3xl font-mono font-black text-teal-600">
                {formatTime(meditationTimer)}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsMeditationPlaying(!isMeditationPlaying)}
                  className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {isMeditationPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isMeditationPlaying ? 'إيقاف مؤقت' : 'تشغيل الاسترخاء الصوتي'}</span>
                </button>
                <button
                  onClick={() => { setIsMeditationPlaying(false); setMeditationTimer(300); }}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 text-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'gratitude' && (
            <div className="space-y-4">
              <form onSubmit={handleAddGratitude} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  ما الذي تشعر بالامتنان له اليوم؟ (تدوين محمي وخاص بك)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="أشعر بالامتنان لأنني..."
                    className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shrink-0 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ في مذكرتي</span>
                  </button>
                </div>
              </form>

              {savedSuccess && (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> تم الحفظ في مذكرتك الخاصة بنجاح
                </p>
              )}

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400">سجل امتنانك السابق:</span>
                {gratitudeNotes.map((note, i) => (
                  <div key={i} className="p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl border border-teal-200/60 dark:border-teal-800/40 text-xs flex items-start gap-2.5">
                    <Heart className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
