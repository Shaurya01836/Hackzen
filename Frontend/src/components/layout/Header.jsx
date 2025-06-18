import React from "react";
import {
  GitCommitVerticalIcon,
  Code2,
  Terminal,
  Users,
  Laptop,
  GitPullRequest,
} from "lucide-react";

function Header() {
  return (
    <section className="relative max-h-[91vh] flex items-center justify-center px-6 py-20 text-center overflow-hidden bg-gradient-to-b from-[#1b0c3f] to-[#0d061f]">
      {/* Ambient gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-700 opacity-20 blur-3xl pointer-events-none z-0" />

     

      {/* Main Card */}
      <div className=" rounded-3xl p-10 sm:p-14 md:p-20 max-w-4xl w-full space-y-10 text-white shadow-xl z-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading1 leading-tight md:leading-[95px]">
          Empowering Hackers to Build the{" "}
          <span className="text-yellow-400">TOP 1%</span> Projects of Tomorrow
        </h1>

        <div className="flex flex-col gap-6">
          <div className="flex items-start sm:items-center gap-3">
            <GitCommitVerticalIcon className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-400 hover:rotate-90 transition-all duration-200 ease-in-out" />
            <p className="text-base sm:text-lg font-semibold">
              From registrations to real-time judging — we’ve powered developer
              communities with beautiful, reliable infrastructure.
            </p>
          </div>

          <button className="w-full bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition shadow-md text-center">
            ⚡ Explore Hackathons
          </button>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="absolute bottom-8 w-full text-sm text-white text-center opacity-70 z-10">
        💻 1000+ developers joined | 🧠 200+ projects built | ⚖ Real-time
        judging supported
      </div>
    </section>
  );
}

export default Header;
