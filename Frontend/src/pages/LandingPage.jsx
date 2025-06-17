import React from "react";
import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import LogoCloud from "../components/sections/LogoCloud";
import CtaSection from "../components/sections/CtaSection";
import FeaturedHackCards from "../components/common/FeaturedHackCards";
import Footer from "../components/layout/Footer";
import MilestoneStats from "../components/sections/MilestoneStats";

// const hackathonData = [
//   {
//     name: "HackVerse 2025",
//     image: "https://deerhack-25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fba9cde4f36b4400f8772bc30edaee5ee%2Fassets%2Fcover%2F777.png&w=1440&q=100",
//     description: "Innovate, compete and win prizes worth $10,000.",
//     date: "July 15 - 17",
//     location: "Online",
//     sponsored: true,
//   },
//   {
//     name: "DevSprint 2.0",
//     image: "https://deerhack-25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fba9cde4f36b4400f8772bc30edaee5ee%2Fassets%2Fcover%2F777.png&w=1440&q=100",
//     description: "36 hours of intense coding with real-world problems.",
//     date: "Aug 5 - 7",
//     location: "Bangalore",
//     sponsored: false,
//   },
//   {
//     name: "TechTrek 3.0",
//     image: "https://deerhack-25.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fba9cde4f36b4400f8772bc30edaee5ee%2Fassets%2Fcover%2F777.png&w=1440&q=100",
//     description: "Code your way through AI, Blockchain, and more.",
//     date: "Sep 12 - 14",
//     location: "Mumbai",
//     sponsored: true,
//   },
// ];

function LandingPage() {
  return (
    <>
      <Navbar />
      <Header />
      <LogoCloud />
      <MilestoneStats />
      <CtaSection />

      {/*     
      <section className="py-16 ">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-heading1 font-bold mb-10 text-center">
            Featured Hackathons
          </h2>
          <FeaturedHackCards hackathons={hackathonData} />
        </div>
      </section> */}

      <Footer />
    </>
  );
}

export default LandingPage;
