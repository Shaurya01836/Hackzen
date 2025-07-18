import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export const InteractiveHoverButton = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-auto overflow-hidden rounded-full bg-[#1b0c3f] text-white px-6 py-2 text-center font-semibold border-2 border-[#1b0c3f] ",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8] " />

          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-hover:text-black">
            {children}
          </span>
        </div>

        <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
          <span className="group-hover:text-black">{children}</span>
          <ArrowRight className="text-black" />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";
