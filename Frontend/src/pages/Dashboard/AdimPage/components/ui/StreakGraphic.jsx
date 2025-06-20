import React from "react";

// Custom color levels (0 = no activity, 1-3 = light to heavy)
const activityLevels = [
  "bg-[#1b0c3f]", 
  "bg-[#2a1c4f]", 
  "bg-[#3c2d66]", 
  "bg-[#503f80]"  
];

// 12 months (like GitHub grid)
const months = [
  "Jul, 2024", "Aug, 2024", "Sep, 2024", "Oct, 2024",
  "Nov, 2024", "Dec, 2024", "Jan, 2025", "Feb, 2025",
  "Mar, 2025", "Apr, 2025", "May, 2025", "Jun, 2025"
];

// Static sample data (0–3 contribution level)
const sampleStreakData = Array.from({ length: 12 }, () =>
  Array.from({ length: 28 }, () => Math.floor(Math.random() * 4))
);

const StreakGraphic = () => {
  return (
    <div className="rounded-lg border-2 border-[#e0d8fa] bg-white text-gray-900 py-6 px-40 ">
      <h2 className="text-2xl font-bold text-center mb-6">Streaks</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((month, monthIndex) => (
          <div key={monthIndex}>
            <h3 className="text-sm font-semibold text-center mb-2">{month}</h3>
            <div className="grid grid-cols-7 gap-1">
              {sampleStreakData[monthIndex].map((level, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3.5 h-3.5 rounded-sm border ${activityLevels[level]}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
        <span>Activity:</span>
        {activityLevels.map((bg, i) => (
          <div
            key={i}
            className={`w-4 h-4 ${bg} rounded-sm border border-gray-300`}
          />
        ))}
      </div>

      {/* Streak Summary */}
      <div className="mt-4 text-center text-sm">
        <p>
          <strong>Current Streak:</strong> 2 Days
        </p>
        <p>
          <strong>Max Streak:</strong> 6 Days
        </p>
      </div>
    </div>
  );
};

export default StreakGraphic;
