import React from "react";
import { MessageCircle } from "lucide-react";

function JoinCommunity() {
  return (
    <section className="w-full py-20 text-white overflow-hidden">
  {/* Heading */}
  <h2 className="text-center text-3xl sm:text-5xl font-bold mb-12 relative z-10 font-heading1 text-gray-900">
    Become a Part of HackZen
  </h2>

  {/* Tilted Card Section */}
  <div className="relative max-w-4xl mx-auto px-6 sm:px-0">
    {/* Purple Tilt Background */}
    <div className="absolute inset-0 rotate-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl z-0" />

    {/* Main Content Card */}
    <div className="relative z-10 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] rounded-2xl px-8 py-10 sm:px-12 shadow-2xl hover:-rotate-3 hover:scale-105 transition-all duration-150 ease-in-out">
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-yellow-300">
        Join the HackZen Community!
      </h3>

      <p className="text-md sm:text-lg text-blue-100 mb-6">
        Stay in sync with all things <span className="font-bold text-yellow-300">HackZen</span> — from
        upcoming hackathons to project deadlines, mentor sessions, and platform upgrades.
      </p>

      <ul className="list-disc list-inside space-y-2 text-purple-200 font-medium">
        <li>Get real-time updates on ongoing and upcoming hackathons.</li>
        <li>Access mentor rooms and join Q&A discussions live.</li>
        <li>Connect with developers, teams & organizers across India.</li>
      </ul>

      <button className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold px-6 py-3 rounded-full transition hover:scale-105">
        {/* Replace icon with your own if needed */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 6H7a2 2 0 01-2-2V6a2 2 0 012-2h2l2-2h2l2 2h2a2 2 0 012 2v14a2 2 0 01-2 2z"
          />
        </svg>
        Join Our Server
      </button>
    </div>
  </div>
</section>

  );
}

export default JoinCommunity;
