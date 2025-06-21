import React from "react";
import Navbar from "../../components/layout/Navbar";

const team = [
  {
    name: "Shaurya Upadhyay",
    role: "Frontend Developer",
    description:
      "Leads the UI development using React and Tailwind, ensuring a smooth user experience.",
  },
  {
    name: "Nitin Jain",
    role: "Backend Developer",
    description:
      "Built APIs and handled database operations, authentication, and server logic.",
  },
  {
    name: "Dhruv Pancholi",
    role: "UI/UX Designer",
    description:
      "Designed user-friendly layouts, color schemes, and ensured accessibility across the platform.",
  },
  {
    name: "Gaurav Jain",
    role: "Project Manager & QA",
    description:
      "Managed the project workflow, ensured timely completion and tested the application thoroughly.",
  },
];

function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#0d0d2b] to-[#1b0c3f] text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 font-heading1">
            About the Project
          </h1>
          <p className="text-center text-gray-300 mb-10 text-lg">
            Our Hackathon Management System is a full-featured platform built to
            simplify the organization, registration, and tracking of hackathon
            events. From managing participants to judging and final results —
            everything is streamlined, automated, and intuitive.
          </p>

          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {team.map((member, idx) => (
                <a
                  key={idx}
                  href={`https://stpitasks.vercel.app/logs?user=${encodeURIComponent(member.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10 hover:scale-[1.02] transition-all block hover:border-yellow-400"
                >
                  <h3 className="text-xl font-semibold text-yellow-400 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-indigo-300 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-200">{member.description}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold mb-2 text-purple-300">
              Vision
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              We aim to make hackathon management effortless for both organizers
              and participants. Our platform is scalable, secure, and built with
              modern technologies to ensure a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
