import {
  Smartphone, Tablet, Laptop, Tv, Headphones, Camera, Cable, Monitor,
  Keyboard, Mouse, Sofa, CookingPot, Lamp, Refrigerator, Shirt, Footprints,
  ShoppingBag, Watch, Baby, Glasses, Sparkles, FlaskConical, Trees, Hammer,
  Flame, Dumbbell, CircleDot, BookOpen, Puzzle, Gamepad2, Wrench, PawPrint,
  Archive, Projector, HeartPulse, Gem, Music, Backpack, Pencil, LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Smartphone, Tablet, Laptop, Tv, Headphones, Camera, Cable, Monitor,
  Keyboard, Mouse, Sofa, CookingPot, Lamp, Refrigerator, Shirt, Footprints,
  ShoppingBag, Watch, Baby, Glasses, Sparkles, FlaskConical, Trees, Hammer,
  Flame, Dumbbell, CircleDot, BookOpen, Puzzle, Gamepad2, Wrench, PawPrint,
  Archive, Projector, HeartPulse, Gem, Music, Backpack, Pencil, LayoutGrid,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? ShoppingBag;
}
