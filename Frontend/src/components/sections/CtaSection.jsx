import React from "react";

function CtaSection() {
  return (
    <section className="px-6 py-16 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white">
    
      <h1 className="text-center text-5xl md:text-7xl font-extrabold mb-16 leading-tight font-heading1">
        From nothing
        <br />
        <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
          to next-level
        </span>
      </h1>

    {/* Services Grid */}
<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
 
  <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Team & Project</h2>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
        ↗
      </div>
    </div>
    <ul className="space-y-3">
      {[
        "Create or join a team",
        "Track project progress",
        "Daily work logs",
        "Team collaboration tools",
        "Final project submission",
      ].map((item, i) => (
        <li
          key={i}
          className="flex justify-between items-center border-b py-2"
        >
          {item}
          <span>↗</span>
        </li>
      ))}
    </ul>
  </div>

  
  <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Resources & Support</h2>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
        ↗
      </div>
    </div>
    <ul className="space-y-3">
      {[
        "Tech stack guides",
        "Mentor Q&A sessions",
        "API integrations",
        "Real-time chat support",
        "Judging & feedback tools",
      ].map((item, i) => (
        <li
          key={i}
          className="flex justify-between items-center border-b py-2"
        >
          {item}
          <span>↗</span>
        </li>
      ))}
    </ul>
  </div>
</div>


     
      <div className="bg-[#1a1234] border border-purple-800/60 rounded-2xl px-8 py-6 flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto shadow-lg">
        <div className="text-lg font-medium mb-4 md:mb-0">
          <span className="mr-2">⚡</span>
          Need bold design or reliable code or both? You’re in the right place.
        </div>
        <button className="bg-yellow-400 text-black px-6 py-3 font-bold rounded-xl hover:bg-yellow-300 transition">
        Chat With Mentor
        </button>
      </div>
    </section>
  );
}

export default CtaSection;

