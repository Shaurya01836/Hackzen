"use client"
import { cn } from "../../lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useMemo, useState } from "react"

export function AnimatedListItem({ children, index }) {
  const animations = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: index * 0.1
    }
  }

  return (
    <motion.div {...animations} layout className="w-full">
      {children}
    </motion.div>
  )
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 750, ...props }) => {
    const [visibleCount, setVisibleCount] = useState(0)
    const childrenArray = useMemo(() => React.Children.toArray(children), [
      children
    ])

    useEffect(() => {
      // Reset when children change
      setVisibleCount(0)

      if (childrenArray.length > 0) {
        const timer = setTimeout(() => {
          setVisibleCount(childrenArray.length)
        }, 100)

        return () => clearTimeout(timer)
      }
    }, [childrenArray.length])

    const visibleItems = useMemo(() => {
      return childrenArray.slice(0, visibleCount)
    }, [childrenArray, visibleCount])

    return (
      <div
        className={cn(`flex flex-col gap-2`, className)}
        {...props}
      >
        <AnimatePresence>
          {visibleItems.map((item, index) => (
            <AnimatedListItem key={item.key || index} index={index}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
