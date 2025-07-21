import React, { useState, useEffect } from "react";
import { MessageCircle, Users, Zap, Calendar, Target } from "lucide-react";

function JoinCommunity() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("join-community-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const features = [
    {
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      text: "Get real-time updates on ongoing and upcoming hackathons",
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      text: "Access mentor rooms and join Q&A discussions live",
    },
    {
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      text: "Connect with developers, teams & organizers across India",
    },
  ];

  return (
    <section
      id="join-community-section"
      className="relative w-full py-16"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-4 text-indigo-600">
            Become a Part of HackZen
          </h2>
          <div className="w-32 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div
          className={`relative group transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
          onMouseMove={handleMouseMove}
          style={{ transitionDelay: "0.3s" }}
        >
          <div
            className="absolute -inset-1 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), rgba(147, 197, 253, 0.05))`,
            }}
          ></div>

          <div className="relative bg-white/20 rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-500">
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-200 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-purple-200 rounded-bl-lg"></div>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2 text-indigo-700">
                  Join the HackZen Community!
                </h3>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Active Community
                  </span>
                </div>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Stay in sync with all things{" "}
              <span className="font-bold text-indigo-600">HackZen</span> — from
              upcoming hackathons to project deadlines, mentor sessions, and
              platform upgrades.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-gray-200 transition-all duration-75 hover:border-indigo-300 hover:bg-indigo-50 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${0 + index * 0.1}s` }}
                >
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center sm:justify-start">
              <button className="group relative inline-flex items-center gap-3 bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-indigo-700 shadow-lg">
                <MessageCircle className="w-6 h-6" />
                <span>Join Our Community</span>
                <svg
                  className="w-6 h-6 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinCommunity;
