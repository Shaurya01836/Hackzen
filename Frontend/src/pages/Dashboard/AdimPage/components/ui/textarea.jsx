import * as React from "react";
import { cn } from "../lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[100px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 ring-1 ring-indigo-300",
      "placeholder:text-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
      "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
      "transition-shadow duration-150 ease-in-out",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export { Textarea };
