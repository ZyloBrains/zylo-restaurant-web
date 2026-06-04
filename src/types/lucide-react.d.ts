declare module "lucide-react" {
  import type { FC, SVGProps } from "react";
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type Icon = FC<LucideProps>;

  export const ArrowLeft: Icon;
  export const Bike: Icon;
  export const CheckCircle2: Icon;
  export const ChevronDown: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const ChevronUp: Icon;
  export const Clock: Icon;
  export const DollarSign: Icon;
  export const ExternalLink: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const Info: Icon;
  export const Loader2: Icon;
  export const Lock: Icon;
  export const Mail: Icon;
  export const MapPin: Icon;
  export const Menu: Icon;
  export const MessageCircle: Icon;
  export const Minus: Icon;
  export const Moon: Icon;
  export const PackageCheck: Icon;
  export const Phone: Icon;
  export const PhoneCall: Icon;
  export const Plus: Icon;
  export const RotateCcw: Icon;
  export const ShoppingCart: Icon;
  export const Star: Icon;
  export const Sun: Icon;
  export const Trees: Icon;
  export const Trash2: Icon;
  export const User: Icon;
  export const UtensilsCrossed: Icon;
  export const Wallet: Icon;
  export const X: Icon;
  export const XCircle: Icon;
}
