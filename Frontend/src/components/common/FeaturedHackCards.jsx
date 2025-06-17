import React from "react";

function FeaturedHackCards({ hackathons }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map((hackathon, i) => (
        <div
          key={i}
          className="bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white p-6 rounded-2xl shadow-xl border border-[#2a1a4d] transition-transform hover:-translate-y-2 duration-300"
        >
          {/* Image thumbnail */}
          {hackathon.image && (
            <img
              src={hackathon.image}
              alt={hackathon.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{hackathon.name}</h3>
            {hackathon.sponsored && (
              <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                Sponsored
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 mb-4">{hackathon.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
            <span>🗓️ {hackathon.date}</span>
            <span>🌐 {hackathon.location}</span>
          </div>

          <button className="mt-6 w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-300 transition">
            {hackathon.buttonText || "Apply Now"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default FeaturedHackCards;
