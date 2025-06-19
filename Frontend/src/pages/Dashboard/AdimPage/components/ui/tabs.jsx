"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

// Root component
const Tabs = TabsPrimitive.Root;

// Tabs List – Dark Background
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-auto gap-2 items-center justify-center p-2 rounded-lg",
      className
    )}
    {...props}
  />
));

TabsList.displayName = "TabsList";

// Tabs Trigger – Gradient Background on Active
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 border",
      "bg-white text-[#1b0c3f]", // Default: white bg, dark text
      "hover:bg-gray-100",
      "data-[state=active]:bg-[#1b0c3f] data-[state=active]:text-white data-[state=active]:shadow-md",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));



TabsTrigger.displayName = "TabsTrigger";

// Tabs Content (optional tweak for readability)
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background text-white",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
