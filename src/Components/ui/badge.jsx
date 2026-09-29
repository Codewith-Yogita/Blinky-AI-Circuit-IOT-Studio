/* eslint-disable react-refresh/only-export-components */
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/40",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-500/15 text-amber-300 border-amber-500/30",
        secondary:
          "border-transparent bg-zinc-800 text-zinc-300 border-white/5",
        destructive:
          "border-red-900/50 bg-red-950/40 text-red-300",
        outline:
          "text-zinc-400 border-white/10 bg-transparent",
        amber:
          "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-xs shadow-amber-500/10",
        red:
          "bg-red-500/15 text-red-300 border-red-500/30 shadow-xs shadow-red-500/10",
        green:
          "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
