import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/CommonUI/card";
import React from "react";
import Navbar from "../../components/layout/Navbar";

const team = [
  {
    name: "Nitin Jain",
    role: "Frontend Dev + Backend Integration",
    image: "https://avatars.githubusercontent.com/u/156602031?v=4",

    skills: ["React", "APIs", "MongoDB"],
  },
  {
    name: "Dhruv Pancholi",
    role: "Backend Dev",
    image: "https://avatars.githubusercontent.com/u/160162577?v=4",

    skills: ["Node.js", "Express", "DB Design"],
  },
  {
    name: "Gaurav Jain",
    role: "Backend Developer",
    image: "https://avatars.githubusercontent.com/u/170131884?v=4",

    skills: ["Server Logic", "Testing", "Security"],
  },
  {
    name: "Shaurya Upadhyay",
    role: "UI/UX Designer",
    image: "https://avatars.githubusercontent.com/u/153098108?v=4",

    skills: ["React", "Tailwind", "Figma"],
  },
];

export default function TeamCards() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 text-gray-800">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600 font-heading1">
            About the Project
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg max-w-3xl mx-auto">
            Our Hackathon Management System is a full-featured platform built to
            simplify the organization, registration, and tracking of hackathon
            events. From managing participants to judging and final results —
            everything is streamlined, automated, and intuitive.
          </p>

          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-500">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-10">
              {team.map((member, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:scale-[1.02] transition-all duration-200"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-44 w-full object-cover border-b border-white/20"
                  />
                  <CardHeader className="items-center text-center">
                    <CardTitle className="text-indigo-700">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">
              Vision
            </h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
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
