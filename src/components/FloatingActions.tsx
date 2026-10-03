import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Tag, 
  Copy, 
  Check 
} from 'lucide-react';

interface Props {
  onOpenEmergencyModal: () => void;
  whatsappNumber?: string;
  emergencyNumber?: string;
}

export const FloatingActions: React.FC<Props> = ({
  onOpenEmergencyModal,
  whatsappNumber = '+967770112233',
  emergencyNumber = '+967770112233'
}) => {
  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('مرحباً كول مايند، أود الاستفسار حول خدمات الرعاية النفسية وحجز الجلسات.');
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Floating Emergency SOS Button */}
      <button
        onClick={onOpenEmergencyModal}
        title="طوارئ ودعم الأزمات 24/7"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 hover:scale-105 transition active:scale-95 group relative"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
        </span>
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </button>

      {/* Floating WhatsApp Support Button */}
      <button
        onClick={handleOpenWhatsApp}
        title="مراسلة خدمة العملاء عبر واتساب"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-105 transition active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export const TopDiscountBar: React.FC<{
  onApplyCoupon?: (code: string) => void;
}> = ({ onApplyCoupon }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isVisible) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('COOL50');
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon('COOL50');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm relative z-30">
      <div className="flex-1 flex items-center justify-center gap-2 flex-wrap text-center">
        <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> عرض خاص
        </span>
        <span>
          خصم 50% على جلستك الأولى + 10% على باقي الباقات بكود الخصم:
        </span>
        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-mono text-amber-200 border border-white/20 transition cursor-pointer"
        >
          <span>COOL50</span>
          {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
