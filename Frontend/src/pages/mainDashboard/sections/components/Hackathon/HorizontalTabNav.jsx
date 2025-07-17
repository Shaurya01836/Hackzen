"use client";
import { cn } from "../../../../../lib/utils";

export default function HorizontalTabNav({
  sections = [],
  activeSection = "",
  onSectionClick = () => {},
}) {
  return (
    <div className="w-full z-30 border-b">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex gap-4 overflow-x-auto no-scrollbar py-3 text-sm sm:text-base font-medium">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              aria-selected={activeSection === section.id}
              className={cn(
                "whitespace-nowrap px-4 py-2 border-b-2 transition-colors duration-200 rounded-t",
                activeSection === section.id
                  ? "border-indigo-600 text-indigo-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
