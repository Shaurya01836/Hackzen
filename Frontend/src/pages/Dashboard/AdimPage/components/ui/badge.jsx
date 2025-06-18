import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600 border-transparent",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent",
        destructive: "bg-red-500 text-white hover:bg-red-600 border-transparent",
        outline: "border-gray-300 text-gray-800 hover:bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
