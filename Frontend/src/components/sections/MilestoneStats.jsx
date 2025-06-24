import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Network,
  Building2,
  Lightbulb,
  Rocket,
} from "lucide-react";

const milestones = [
  {
    value: "8980+",
    label: "Participating Students",
    icon: <GraduationCap className="w-10 h-10" />,
  },
  {
    value: "6000+",
    label: "HackZen Alumni Network",
    icon: <Network className="w-10 h-10" />,
  },
  {
    value: "3897",
    label: "Participating Institutes",
    icon: <Building2 className="w-10 h-10" />,
  },
  {
    value: "2633",
    label: "Total Problem Statements",
    icon: <Lightbulb className="w-10 h-10" />,
  },
  {
    value: "100+",
    label: "Registered Startups",
    icon: <Rocket className="w-10 h-10" />,
  },
];

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("milestone-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const numericTarget = parseInt(target.replace(/[^\d]/g, ""));
    if (isNaN(numericTarget)) return;

    let start = 0;
    const increment = numericTarget / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, isVisible]);

  const formatCount = (num) => {
    if (target.includes("+")) return `${num.toLocaleString()}+`;
    if (target.includes(",")) return num.toLocaleString();
    return num.toString();
  };

  return <span>{formatCount(count)}</span>;
}

function MilestoneStats() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      id="milestone-section"
      className="relative py-20 px-4 sm:px-6 md:px-12 overflow-hidden "
    >
      
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <div className="mb-16">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 text-xl font-bold tracking-wide uppercase">
            HackZen Milestones
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {milestones.map((milestone, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl border shadow transition-all duration-300 ease-out
                ${
                  hoveredIndex === i
                    ? "bg-indigo-50 border-indigo-300 scale-105 shadow-md"
                    : "bg-white/20 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-indigo-600 mb-4 transition-transform duration-300 group-hover:scale-125">
                {milestone.icon}
              </div>

              <h3 className="text-4xl sm:text-5xl font-extrabold mb-2 text-gray-900">
                <AnimatedCounter target={milestone.value} />
              </h3>

              <p className="text-gray-600 text-sm sm:text-base font-medium leading-tight">
                {milestone.label}
              </p>

              <div
                className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-300 rounded-b-full ${
                  hoveredIndex === i ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center space-x-2">
          {milestones.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                hoveredIndex === i ? "bg-indigo-500 w-8" : "bg-indigo-200"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MilestoneStats;
