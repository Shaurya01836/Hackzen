import React from "react";

function FeaturedHackCards({ hackathons }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
      {hackathons.map((hackathon, i) => (
        <div key={i} className="relative max-w-4xl mx-auto">

          {/* Tilted background */}
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] rotate-3 z-0"></div>

          {/* Foreground card */}
          <div className="relative z-10 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-6 border border-gray-200 -rotate-0 hover:-rotate-3 hover:scale-105 transition-all duration-150 ease-in-out">
            {/* Image */}
            <div className="w-full sm:w-1/3">
              <img
                src={hackathon.image}
                alt={hackathon.name}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            {/* Info */}
            <div className="w-full sm:w-2/3 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">{hackathon.name}</h3>
                <div className="flex gap-2">
                  {hackathon.sponsored && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Sponsored
                    </span>
                  )}
                  {hackathon.top && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2">{hackathon.description}</p>

              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>🗓️ {hackathon.date}</span>
                <span>📍 {hackathon.location}</span>
              </div>

              <button className="mt-4 w-full sm:w-fit bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition">
                {hackathon.buttonText || "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturedHackCards;
