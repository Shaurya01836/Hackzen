"use client";
import { cn } from "../../pages/Dashboard/AdimPage/components/lib/utils";
import React from "react";

export const Button = React.forwardRef(
  (
    {
      className,
      children,
      variant = "default", // 'default', 'outline', 'ghost', 'yellow'
      size = "default", // 'default', 'sm', 'lg', 'icon'
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-[#5046e6] text-white hover:bg-[#3f3ad1]",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "bg-transparent hover:bg-muted",
      yellow: "bg-black text-yellow-400 hover:text-yellow-300 border border-yellow-400"
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-sm",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
