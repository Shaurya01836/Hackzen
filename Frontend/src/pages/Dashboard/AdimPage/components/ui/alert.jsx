import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 pl-11 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-500",
        destructive:
          "bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-500",
        success:
          "bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-500",
        warning:
          "bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      alertVariants({ variant }),
      "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-tight text-sm", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-relaxed text-gray-700", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
