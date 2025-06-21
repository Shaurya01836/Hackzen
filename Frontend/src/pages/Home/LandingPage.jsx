"use client";
import React from "react";
import Navbar from "../../components/layout/Navbar";
import Header from "../../components/layout/Header";
import LogoCloud from "../../components/sections/LogoCloud";
import CtaSection from "../../components/sections/CtaSection";
import FeaturedHackCards from "../../components/common/FeaturedHackCards";
import Footer from "../../components/layout/Footer";
import MilestoneStats from "../../components/sections/MilestoneStats";
import JoinCommunity from "../../components/sections/JoinCommunity";
import { InteractiveGridPattern } from "../../components/Magic UI/InteractiveGridPattern";
import { cn } from "../../lib/utils";


const hackathonData = [
  {
    name: "DevSprint 2.0",
    image:
      "https://wwdc25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fb256802eda714e8f8603db20d8cd7860%2Fassets%2Fcover%2F54.png&w=1440&q=100",
    description: "36 hours of intense coding with real-world problems.",
    date: "Aug 5 - 7",
    location: "Bangalore",
    sponsored: false,
  },
  {
    name: "HackVerse 2025",
    image:
      "https://hackverse2025.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F25faa754a83d4170985ab5cd7a88f8e7%2Fassets%2Fcover%2F152.png&w=1440&q=100",
    description: "Innovate, compete and win prizes worth $10,000.",
    date: "July 15 - 17",
    location: "Online",
    sponsored: true,
    top: true,
  },
  {
    name: "DevSprint 2.0",
    image:
      "https://wwdc25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fb256802eda714e8f8603db20d8cd7860%2Fassets%2Fcover%2F54.png&w=1440&q=100",
    description: "36 hours of intense coding with real-world problems.",
    date: "Aug 5 - 7",
    location: "Bangalore",
    sponsored: false,
  },
];

function LandingPage() {
  return (
    <>
   
      <Navbar />

      <section className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <Header />
        <LogoCloud />

        <section className="relative pt-16 pb-4 overflow-hidden">
          {/* Animated grid pattern background */}
          <InteractiveGridPattern
            className={cn(
              "absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
            )}
            width={40}
            height={40}
            squares={[80, 80]}
            squaresClassName="hover:fill-primary"
          />

          {/* Main content container */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-heading1 font-bold mb-10 text-center">
              Featured Hackathons
            </h2>

            <FeaturedHackCards hackathons={hackathonData} />
          </div>
        </section>

        <MilestoneStats />
        
     {/* Join Community with Grid Background */}
<section className="relative pt-16 pb-20 overflow-hidden">
  <InteractiveGridPattern
    className={cn(
      "absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
    )}
    width={40}
    height={40}
    squares={[80, 80]}
    squaresClassName="hover:fill-primary"
  />

  <div className="relative z-10">
    <JoinCommunity />
  </div>
</section>
      </section>

      <CtaSection />

      <Footer />
    </>
  );
}

export default LandingPage;
