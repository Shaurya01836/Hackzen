import React, { useState } from "react";
import { ChevronDown, ChevronUp, BowArrow } from "lucide-react";

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

const FAQCard = ({ title, icon: Icon, data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Icon className="w-12 h-12 p-2 border-2 border-gray-500 rounded-full hover:rotate-45 hover:bg-black hover:text-white transition-all duration-300 ease-in-out" />
      </div>
      <ul className="space-y-4">
        {data.map((item, i) => (
          <li key={i} className="border-b pb-3 cursor-pointer">
            <div
              className="flex justify-between items-center"
              onClick={() => toggle(i)}
            >
              <p className="font-semibold text-lg">{item.q}</p>
              {openIndex === i ? (
                <ChevronUp className="w-6 h-6 transition-all duration-300 ease-in-out" />
              ) : (
                <ChevronDown className="w-6 h-6 transition-all duration-300 ease-in-out" />
              )}
            </div>
            {openIndex === i && (
              <p className="text-gray-600 mt-2 text-sm">{item.a}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

function CtaSection() {
  return (
    <section className="px-6 py-16 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white">
      <h1 className="text-center text-5xl md:text-7xl font-extrabold mb-16 leading-tight font-heading1">
        From nothing
        <br />
        <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
          to next-level
        </span>
      </h1>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <FAQCard title="General FAQs" icon={BowArrow} data={faqsLeft} />
        <FAQCard title="Learning & Support" icon={BowArrow} data={faqsRight} />
      </div>

      <div className="bg-[#1a1234] border border-purple-800/60 rounded-2xl px-8 py-6 flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto shadow-lg">
        <div className="text-lg font-medium mb-4 md:mb-0">
          <span className="mr-2">⚡</span>
          Need bold design or reliable code or both? You’re in the right place.
        </div>
        <button className="bg-yellow-400 text-black px-6 py-3 font-bold rounded-xl hover:bg-yellow-300 transition">
          Chat With Mentor
        </button>
      </div>
    </section>
  );
}

export default CtaSection;
