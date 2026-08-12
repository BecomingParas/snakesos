import {
  BarChart3,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Map,
  Phone,
  ScrollText,
  Settings,
  Shield,
  Siren,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Worm,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  building: Building2,
  calendar: Calendar,
  chart: BarChart3,
  check: CheckCircle2,
  clock: Clock,
  heart: Heart,
  map: Map,
  phone: Phone,
  scroll: ScrollText,
  settings: Settings,
  shield: Shield,
  siren: Siren,
  star: Star,
  "trending-up": TrendingUp,
  users: Users,
  wallet: Wallet,
  worm: Worm,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Siren;
}
