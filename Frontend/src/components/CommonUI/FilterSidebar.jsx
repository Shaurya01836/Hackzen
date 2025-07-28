"use client";
import React from "react";
import { X, Filter } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "../../lib/utils";

export function FilterSidebar({
  isOpen,
  onClose,
  title = "Filters",
  children,
  hasActiveFilters = false,
  onClearAll,
  showApplyButton = true,
  className = ""
}) {
  return (
    <>
      {/* Filter Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        !isOpen && "invisible",
        className
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClearAll}
                disabled={!hasActiveFilters}
              >
                Clear All
              </Button>
              {showApplyButton && (
                <Button className="flex-1" onClick={onClose}>
                  Apply Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 !mt-0"
          onClick={onClose}
        />
      )}
    </>
  );
}

// Filter Field Component
export function FilterField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}

// Filter Toggle Button Component
export function FilterToggleButton({ 
  onClick, 
  hasActiveFilters = false, 
  activeFiltersCount = 0,
  className = "",
  children = "Filters"
}) {
  return (
    <Button
      onClick={onClick}
      className={cn("flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 h-12 px-6", className)}
    >
      <Filter className="w-4 h-4" />
      {children}
      {hasActiveFilters && activeFiltersCount > 0 && (
        <Badge className="bg-red-500 text-white ml-1 px-1.5 py-0.5 text-xs">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
}
