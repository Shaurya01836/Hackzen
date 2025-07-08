import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Lightbulb,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

const faqsLeft = [
  {
    q: "How do I register for a hackathon?",
    a: "You can register directly on the platform by visiting the Hackathons page and selecting the event you're interested in.",
  },
  {
    q: "Can I participate solo or need a team?",
    a: "Both options are available! You can join as a solo participant or form a team using our team-matching feature.",
  },
  {
    q: "How do I submit my project?",
    a: "Once your project is ready, go to the dashboard and click on 'Submit Project'. Make sure to include your GitHub link and demo video.",
  },
  {
    q: "What is the daily log system?",
    a: "The daily log helps teams document their progress each day. It's visible to mentors and judges during evaluation.",
  },
  {
    q: "Is there a project tracking feature?",
    a: "Yes, our live dashboard shows your progress, deadlines, and submission status in real time.",
  },
];

const faqsRight = [
  {
    q: "Are learning resources provided?",
    a: "Yes! We provide curated resources, tech stack guides, and API documentation for every hackathon.",
  },
  {
    q: "How do I get help from mentors?",
    a: "You can book mentor slots through the mentor portal or ask questions in the mentor Q&A section.",
  },
  {
    q: "Where can I get technical help?",
    a: "Our live community chat and Q&A forums are available 24/7 for technical and non-technical help.",
  },
  {
    q: "Can I integrate external APIs in my project?",
    a: "Absolutely! You're encouraged to use APIs, SDKs, and dev tools to enhance your hackathon project.",
  },
  {
    q: "How do judges provide feedback?",
    a: "Judges review your final submission and provide structured feedback which you can view on your dashboard.",
  },
];

const FAQCard = ({ title, icon: Icon, data, delay = 0 }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative bg-white/20 border border-indigo-200 rounded-3xl p-8 shadow-xl hover:shadow-indigo-300/40 transition-all duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800">{title}</h2>
            <div className="w-16 h-1 bg-indigo-500 rounded-full mt-2"></div>
          </div>
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <Icon className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={i}>
              <div
                className="flex justify-between items-start p-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-200"
                onClick={() => toggle(i)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-indigo-900">
                    {item.q}
                  </p>
                  {openIndex === i && (
                    <div className="mt-4">
                      <p className="text-slate-600">{item.a}</p>
                    </div>
                  )}
                </div>
                <div className="ml-4 p-2 rounded-lg bg-indigo-100">
                  {openIndex === i ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("cta-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta-section"
      className="relative px-6 py-20 text-slate-800"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-indigo-900 leading-tight">
            From <span className="text-indigo-700">nothing</span>
            <br />
            to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-400">
              next-level
            </span>
          </h1>
      
        </div>

        {/* FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <FAQCard title="General FAQs" icon={MessageCircle} data={faqsLeft} delay={200} />
          <FAQCard title="Learning & Support" icon={Lightbulb} data={faqsRight} delay={400} />
        </div>

        {/* CTA Box */}
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          <div className="bg-white/20 border border-indigo-200 rounded-3xl p-8 shadow-sm hover:shadow-indigo-300 transition-all">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-2xl">
                    <Zap className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-700">Ready to Level Up?</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 text-sm">Join 8,98,884+ developers</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-slate-700">
                  Need bold design or reliable code or both? You're in the right place.
                  Get personalized guidance from industry experts.
                </p>
              </div>

              <div className="flex-shrink-0">
                <button className=" relative inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300">
                  <MessageCircle className="w-6 h-6" />
                  <span>Chat With Mentor</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
