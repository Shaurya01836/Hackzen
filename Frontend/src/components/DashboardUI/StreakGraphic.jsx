import React from "react";
import dayjs from "dayjs";

// Color levels (0 = no activity, 1-3 = light to dark)
const activityLevels = [
  "bg-[#1b0c3f]", 
  "bg-[#2a1c4f]", 
  "bg-[#3c2d66]", 
  "bg-[#503f80]"
];

// Get intensity by frequency (for now 1 = visited)
const getActivityLevel = (count) => {
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
};

const months = [
  "Jul, 2025", "Aug, 2025", "Sep, 2025", "Oct, 2025", "Nov, 2025", "Dec, 2025"
];

// 📅 Helper to check if date belongs to a given month (by index)
const getMonthRange = (monthIndex) => {
  const start = dayjs(`2025-${monthIndex + 7}-01`);
  const end = start.endOf("month");
  return { start, end };
};

const StreakGraphic = ({ data = [], current = 0, max = 0 }) => {
  // Convert array of Date strings into a frequency map
  const activityMap = {};
  data.forEach((date) => {
    const day = dayjs(date).format("YYYY-MM-DD");
    activityMap[day] = (activityMap[day] || 0) + 1;
  });

  return (
    <div className="rounded-lg text-gray-900 py-6 px-6 md:px-24 ring-1 ring-indigo-300">
      <h2 className="text-2xl font-bold text-center mb-6">Streaks</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((monthLabel, index) => {
          const { start, end } = getMonthRange(index); // Jul = index 0 = 7

          // Collect days of this month
          const days = [];
          for (let date = start; date.isBefore(end); date = date.add(1, "day")) {
            const key = date.format("YYYY-MM-DD");
            const count = activityMap[key] || 0;
            days.push(getActivityLevel(count));
          }

          return (
            <div key={index}>
              <h3 className="text-sm font-semibold text-center mb-2">
                {monthLabel}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {days.map((level, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm border ${activityLevels[level]}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
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
          <strong>Current Streak:</strong> {current} Days
        </p>
        <p>
          <strong>Max Streak:</strong> {max} Days
        </p>
      </div>
    </div>
  );
};

export default StreakGraphic;
