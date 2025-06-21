import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full cursor-pointer border px-4 py-1 text-sm font-semibold transition-transform transition-opacity duration-300 ease-in-out transform hover:scale-105 animate-fade-in focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-green-500 text-white border-transparent",
        secondary: "bg-blue-600 text-white border-transparent",
        destructive: "bg-red-600 text-white border-transparent",
        outline: "bg-indigo-100 text-indigo-700 border-transparent",
        dark: "bg-[#1b0c3f] text-white border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
