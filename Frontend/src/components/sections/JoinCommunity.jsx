import React from "react";
import { MessageCircle } from "lucide-react";

function JoinCommunity() {
  return (
    <section className=" w-full py-20 text-white overflow-hidden border-t-2 ">
      {/* Heading */}
      <h2 className="text-center text-3xl sm:text-5xl font-bold mb-12 relative z-10 font-heading1 text-gray-900">
        Join our Community
      </h2>

      {/* Tilted Card Section */}
      <div className="relative max-w-4xl mx-auto px-6 sm:px-0">
        {/* Red Tilt Background */}
        <div className="absolute inset-0 rotate-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl z-0" />

        {/* Main Content Card */}
        <div className="relative z-10 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] rounded-2xl px-8 py-10 sm:px-12 shadow-2xl hover:-rotate-3 hover:scale-105 transition-all duration-150 ease-in-out">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Join our Discord Server!
          </h3>

          <p className="text-md sm:text-lg text-yellow-300 mb-6">
            To stay up-to-date with <span className="font-bold text-white">HackByte 4.0</span>,
            consider joining our Discord. It helps us share important updates right away with
            hackers and enthusiasts alike!
          </p>

          <ul className="list-disc list-inside space-y-2 text-yellow-200 font-medium">
            <li>Get the latest news and announcements.</li>
            <li>Get notified for exciting events!</li>
            <li>Connect with like-minded individuals.</li>
          </ul>

          <button className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white text-lg font-semibold px-6 py-3 rounded-full transition">
            <MessageCircle className="w-5 h-5" />
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default JoinCommunity;
