"use client";
import { cn } from "../../../../../../lib/utils";
import { Button } from "../../../../../../components/CommonUI/button";

export default function HorizontalTabNav({
  sections = [],
  activeSection = "",
  onSectionClick = () => {},
  isFixed = false,
  isRegistered,
  onRegisterClick,
}) {
  return (
    <>
     
      <div
        className={cn(
          "w-full z-30 border-b bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50",
          // When fixed, apply the animation and a shadow
          isFixed && "fixed top-0 right-0 left-0 lg:left-[255px] border-b "
        )}
      >
        <div className="max-w-6xl px-4 flex items-center justify-between">
          <nav className="flex flex-wrap gap-4 py-3 text-sm sm:text-base font-medium">
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

          {isFixed && (
            <div className="pl-4">
              <Button
                size="sm"
                onClick={() => onRegisterClick(isRegistered)}
                className={isRegistered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
              >
                {isRegistered ? "View Details" : "Register"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}