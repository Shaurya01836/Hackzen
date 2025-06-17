import React from "react";

const milestones = [
  { value: "8,98,884", label: "Participating Students" },
  { value: "6000+", label: "HackZen Alumni Network" },
  { value: "3897", label: "Participating Institutes" },
  { value: "2633", label: "Total Problem Statements" },
  { value: "100+", label: "Registered Startups" },
];

function MilestoneStats() {
  return (
    <section className=" py-12 px-4 sm:px-6 md:px-12 text-[#1b0c3f] shadow-md">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-gray-600 text-sm md:text-base mb-6 font-semibold">
          HackZen Milestones
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center border-2 py-4 rounded-3xl">
          {milestones.map((milestone, i) => (
            <div
              className="hover:skew-x-12 transition-all duration-150 ease-in-out"
              key={i}
            >
              <h3 className="text-2xl sm:text-3xl font-bold ">
                {milestone.value}
              </h3>
              <p className="text-sm sm:text-base mt-2 ">{milestone.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MilestoneStats;
