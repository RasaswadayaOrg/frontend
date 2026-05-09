"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Primary violet CTA */
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        /** Destructive action */
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        /** Outlined – secondary action */
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        /** Muted background – tertiary action */
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        /** No background – subtle action */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /** Text link */
        link: "text-primary underline-offset-4 hover:underline",
        /* ── Rasaswadaya brand variants ── */
        /** Violet filled with glow shadow */
        violet:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90",
        /** Violet outline */
        "violet-outline":
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        /** Violet ghost */
        "violet-ghost": "text-primary hover:bg-primary/10",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
