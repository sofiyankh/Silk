"use client";

import React from "react";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconCircleCheck,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconCompass,
  IconCreditCard,
  IconEdit,
  IconExternalLink,
  IconHeart,
  IconLayoutDashboard,
  IconLock,
  IconLogout,
  IconMail,
  IconMapPin,
  IconMenu2,
  IconMinus,
  IconPackage,
  IconPhone,
  IconPlus,
  IconPower,
  IconRefresh,
  IconRotateClockwise,
  IconDeviceFloppy,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconShoppingBag,
  IconAdjustmentsHorizontal,
  IconSparkles,
  IconBuildingStore,
  IconTag,
  IconTrash,
  IconTrendingUp,
  IconTruck,
  IconUser,
  IconUsers,
  IconX,
  IconCircleX,
  TablerIcon,
} from "@tabler/icons-react";

// Helper wrapper to ensure default stroke width (1.5) matching luxury editorial aesthetic
function createIcon(IconComponent: TablerIcon) {
  return function LuxuryIcon({
    size = 20,
    stroke = 1.5,
    className = "",
    ...props
  }: React.ComponentProps<TablerIcon>) {
    return <IconComponent size={size} stroke={stroke} className={className} {...props} />;
  };
}

export const AlertTriangle = createIcon(IconAlertTriangle);
export const ArrowRight = createIcon(IconArrowRight);
export const ArrowUpRight = createIcon(IconArrowUpRight);
export const Check = createIcon(IconCheck);
export const CheckCircle2 = createIcon(IconCircleCheck);
export const ChevronDown = createIcon(IconChevronDown);
export const ChevronUp = createIcon(IconChevronUp);
export const Clock = createIcon(IconClock);
export const Compass = createIcon(IconCompass);
export const CreditCard = createIcon(IconCreditCard);
export const Edit2 = createIcon(IconEdit);
export const ExternalLink = createIcon(IconExternalLink);
export const Heart = createIcon(IconHeart);
export const LayoutDashboard = createIcon(IconLayoutDashboard);
export const Lock = createIcon(IconLock);
export const LogOut = createIcon(IconLogout);
export const Mail = createIcon(IconMail);
export const MapPin = createIcon(IconMapPin);
export const Menu = createIcon(IconMenu2);
export const Minus = createIcon(IconMinus);
export const Package = createIcon(IconPackage);
export const Phone = createIcon(IconPhone);
export const Plus = createIcon(IconPlus);
export const Power = createIcon(IconPower);
export const RefreshCw = createIcon(IconRefresh);
export const RotateCcw = createIcon(IconRotateClockwise);
export const Save = createIcon(IconDeviceFloppy);
export const Search = createIcon(IconSearch);
export const Settings = createIcon(IconSettings);
export const ShieldCheck = createIcon(IconShieldCheck);
export const ShoppingBag = createIcon(IconShoppingBag);
export const SlidersHorizontal = createIcon(IconAdjustmentsHorizontal);
export const Sparkles = createIcon(IconSparkles);
export const Store = createIcon(IconBuildingStore);
export const Tag = createIcon(IconTag);
export const Trash2 = createIcon(IconTrash);
export const TrendingUp = createIcon(IconTrendingUp);
export const Truck = createIcon(IconTruck);
export const User = createIcon(IconUser);
export const Users = createIcon(IconUsers);
export const X = createIcon(IconX);
export const XCircle = createIcon(IconCircleX);

export default {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  CreditCard,
  Edit2,
  ExternalLink,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  User,
  Users,
  X,
  XCircle,
};
