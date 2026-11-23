import {
  Award,
  Backpack,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  Droplets,
  Footprints,
  HeartPulse,
  PhoneCall,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
  Wind,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Award,
  Backpack,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  Droplets,
  Footprints,
  HeartPulse,
  PhoneCall,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
  Wind,
};

interface IconGlyphProps extends LucideProps {
  name: string;
}

export function IconGlyph({ name, ...props }: IconGlyphProps) {
  const Component = ICON_MAP[name] || Star;
  return <Component aria-hidden="true" {...props} />;
}
