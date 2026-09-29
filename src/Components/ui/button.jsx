/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:brightness-110 border-0",
        destructive:
          "bg-red-950/80 text-red-200 border border-red-800/60 hover:bg-red-900/80 hover:text-white shadow-sm",
        outline:
          "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-zinc-300 shadow-sm backdrop-blur-sm",
        secondary:
          "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 border border-white/5",
        ghost:
          "hover:bg-white/[0.06] hover:text-white text-zinc-400",
        link:
          "text-amber-400 underline-offset-4 hover:underline",
        amberGlow:
          "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 shadow-sm shadow-amber-500/10",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
