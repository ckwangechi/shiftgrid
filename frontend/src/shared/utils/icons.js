import {
  CalendarClock,
  Briefcase,
  Clock3,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Users,
  TrendingUp,
  Bell,
  Star,
} from "lucide-react";

const iconMap = {
  CalendarClock,
  Briefcase,
  Clock3,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Users,
  TrendingUp,
  Bell,
  Star,
};

export const getIcon = (name) => iconMap[name] ?? CalendarClock;
