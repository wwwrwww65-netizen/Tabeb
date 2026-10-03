import React from 'react';
import { 
  Stethoscope, 
  Brain, 
  Apple, 
  Users, 
  HeartPulse, 
  Activity, 
  Sparkles, 
  Smile, 
  Shield, 
  Pill, 
  Baby, 
  Eye, 
  BookOpen, 
  Heart,
  SmilePlus,
  LifeBuoy,
  Sun,
  Flame,
  LucideIcon
} from 'lucide-react';

export interface DepartmentIconOption {
  name: string;
  label: string;
  category: string;
  icon: LucideIcon;
}

export const AVAILABLE_DEPARTMENT_ICONS: DepartmentIconOption[] = [
  { name: 'Stethoscope', label: 'سماعة طبية', category: 'طب نفسي وتشخيص', icon: Stethoscope },
  { name: 'Brain', label: 'دماغ وعقل', category: 'علاج معرفي ونفسي', icon: Brain },
  { name: 'Apple', label: 'تغذية صحية', category: 'تغذية علاجية', icon: Apple },
  { name: 'Users', label: 'أسرة ومجتمع', category: 'خدمة اجتماعية', icon: Users },
  { name: 'HeartPulse', label: 'نبض وتوازن', category: 'طوارئ واستقرار', icon: HeartPulse },
  { name: 'Pill', label: 'أدوية وتأهيل', category: 'علاج دوائي وإدمان', icon: Pill },
  { name: 'Eye', label: 'عين وبصيرة', category: 'علاج الصدمات EMDR', icon: Eye },
  { name: 'Activity', label: 'نشاط وحيوية', category: 'تأهيل وتعديل سلوك', icon: Activity },
  { name: 'Baby', label: 'طفل ويافعين', category: 'طب نفسي أطفال', icon: Baby },
  { name: 'Sparkles', label: 'إشراق وتطوير', category: 'تطوير الذات والمرونة', icon: Sparkles },
  { name: 'Smile', label: 'ابتسامة وهدوء', category: 'صحة نفسية عامة', icon: Smile },
  { name: 'Shield', label: 'درع الحماية', category: 'دعم وأمان نفسي', icon: Shield },
  { name: 'Heart', label: 'رعاية وجدانية', category: 'استشارات أسرية وزوجية', icon: Heart },
  { name: 'BookOpen', label: 'كتاب وإرشاد', category: 'تثقيف ودراسات', icon: BookOpen },
  { name: 'LifeBuoy', label: 'طوق نجاة', category: 'تدخل أزمات سريعة', icon: LifeBuoy },
  { name: 'Sun', label: 'أمل وتفاؤل', category: 'علاج اكتئاب موسمي', icon: Sun },
  { name: 'Flame', label: 'عزيمة وتحدي', category: 'تعافي وإرادة', icon: Flame },
  { name: 'SmilePlus', label: 'سعادة إيجابية', category: 'علم النفس الإيجابي', icon: SmilePlus },
];

export const DepartmentIcon: React.FC<{ iconName: string; className?: string }> = ({ 
  iconName, 
  className = "w-5 h-5" 
}) => {
  const match = AVAILABLE_DEPARTMENT_ICONS.find(
    i => i.name.toLowerCase() === (iconName || '').toLowerCase()
  );
  const IconComponent = match ? match.icon : Stethoscope;
  return <IconComponent className={className} />;
};
