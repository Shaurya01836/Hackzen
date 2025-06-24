import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <>
    <div
      ref={ref}
      className={cn(
        "relative group cursor-none overflow-hidden",
        "ring-1 ring-indigo-300 rounded-2xl border border-white/20",
        "bg-gradient-to-br from-white/10 to-indigo-200/10 backdrop-blur-lg",
        "shadow-sm shadow-indigo-300 text-gray-900",
        "transition-all duration-200 ease-out",
        "hover:shadow-sm hover:shadow-indigo-400/30",
        "hover:ring-2 hover:ring-indigo-400",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:translate-x-[-100%] before:transition-transform before:duration-1000",
        "hover:before:translate-x-[100%]",
        className
      )}
      {...props}
    />
  </>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b border-gray-100",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t border-gray-100",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
