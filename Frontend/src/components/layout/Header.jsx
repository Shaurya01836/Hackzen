"use client";
import React from "react";
import { BoxReveal } from "../Magic UI/BoxReveal";
import { InteractiveHoverButton } from "../Magic UI/HoverButton";
import { ScriptCopyBtn } from "../Magic UI/ScriptCopy";
import { Terminal, TypingAnimation, AnimatedSpan } from "../Magic UI/Terminal";
import { Link } from "react-router-dom";

function Header() {
  const customCommandMap = {
    npm: "🔥npm run add creativity",
    yarn: "⚙️yarn add vision",
    pnpm: "🚀pnpm dlx @latestBuilds",
    bun: "🍞bun x @latestStack",
  };

  return (
    <section className="min-h-[90vh] bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white px-6 flex items-center">
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 w-full gap-24 lg:gap-32 xl:gap-48">
        {/* Left Side: Headline & CTA */}
        <div className="w-full lg:w-3/4 flex flex-col space-y-10">
          <BoxReveal boxColor="#facc15" duration={0.5}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading1 leading-tight">
              Empowering Hackers to Build the{" "}
              <span className="text-yellow-400">TOP 1%</span> Projects of
              Tomorrow
            </h1>
          </BoxReveal>

          <BoxReveal boxColor="#facc15" duration={0.5}>
            <p className="text-lg sm:text-xl lg:text-2xl opacity-90 font-heading1">
              From registrations to real-time judging — we’ve powered developer
              communities with beautiful, reliable infrastructure.
            </p>
          </BoxReveal>

          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <Link to="/dashboard?view=explore-hackathons">
              <InteractiveHoverButton className="mt-2 bg-[#5046e6] hover:bg-[#403bb5] text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 w-fit">
                ⚡ Explore Hackathons
              </InteractiveHoverButton>
            </Link>
          </BoxReveal>
        </div>

        {/* Right Side: Script Copy + Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
          <ScriptCopyBtn
            showMultiplePackageOptions={true}
            codeLanguage="bash"
            lightTheme="github-light"
            darkTheme="vitesse-dark"
            commandMap={customCommandMap}
          />

          <Terminal className="w-full ">
            <TypingAnimation className="text-black">
              &gt; Initializing Hackathon Launch Sequence...
            </TypingAnimation>

            <AnimatedSpan delay={1500} className="text-green-500">
              <span>✔ Environment check passed.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={2000} className="text-green-500">
              <span>✔ Terminal connected to innovation engine.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={2500} className="text-green-500">
              <span>✔ Creativity modules online.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={3000} className="text-green-500">
              <span>✔ Team synergy optimized.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={3500} className="text-green-500">
              <span>✔ Innovation stack ready: React, Tailwind, Node, AI.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={4000} className="text-green-500">
              <span>✔ Compiling ideas...</span>
            </AnimatedSpan>
            <AnimatedSpan delay={4500} className="text-green-500">
              <span>✔ Deploying energy & excitement.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={5000} className="text-green-500">
              <span>✔ Engaging community protocols.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={5500} className="text-green-500">
              <span>✔ Awaiting final confirmation...</span>
            </AnimatedSpan>
            <AnimatedSpan delay={6000} className="text-blue-500">
              <span>ℹ Welcome to HackZen</span>
            </AnimatedSpan>
          </Terminal>
        </div>
      </div>
    </section>
  );
}

export default Header;
