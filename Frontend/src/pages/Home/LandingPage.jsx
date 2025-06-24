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
import { SmoothCursor } from "../../components/Magic UI/SmoothScroll";

function LandingPage() {
  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 ">
        <SmoothCursor />
        <Header />
        <LogoCloud />

        <section className="relative py-16 overflow-hidden">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern2"></div>

          {/* Main content container */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-heading1 font-bold mb-10 text-center text-indigo-500">
              Featured Hackathons
            </h2>

            <FeaturedHackCards />
          </div>
        </section>

        {/* Join Community with Grid Background */}
        <section className="relative pt-16 pb-2 overflow-hidden">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern2"></div>

          <div className="relative z-10">
            <MilestoneStats />
            <JoinCommunity />
            <CtaSection />
            <Footer />
          </div>
        </section>
      </section>
    </>
  );
}

export default LandingPage;
