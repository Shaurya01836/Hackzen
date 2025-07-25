"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Header from "../../components/layout/Header";
import LogoCloud from "../../components/sections/LogoCloud";
import CtaSection from "../../components/sections/CtaSection";
import FeaturedHackCards from "../../components/common/FeaturedHackCards";
import Footer from "../../components/layout/Footer";
import MilestoneStats from "../../components/sections/MilestoneStats";
import JoinCommunity from "../../components/sections/JoinCommunity";
import { useAuth } from "../../context/AuthContext";

function LandingPage() {
  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 ">
        <Header />
        <LogoCloud />
        {/* Join Community with Grid Background */}
        <section className="relative pb-2 overflow-hidden">
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
