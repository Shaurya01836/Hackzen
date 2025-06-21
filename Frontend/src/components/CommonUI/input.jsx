import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 ring-1 ring-indigo-300",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-200",
        "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "transition-shadow duration-150 ease-in-out",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
