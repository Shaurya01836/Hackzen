import React from "react";
import {
  Instagram,
  Linkedin,
  Github,
  Dribbble,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white py-12 px-6 bg-[#0b0b1f]">
      <div className="flex flex-col md:flex-row justify-between gap-12 items-start p-10">
        {/* Newsletter Column */}
        <div className="w-full md:w-1/3">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
            Subscribe to our newsletter to <br /> stay in touch with the latest.
          </h3>

          <div className="relative w-full">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-6 py-3 pr-14 text-sm text-white bg-transparent border border-gray-500 rounded-full outline-none placeholder:text-gray-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gray-700 p-2 rounded-full">
              <Mail size={18} />
            </span>
          </div>

          <p className="mt-8 mb-4 text-sm tracking-widest text-gray-400 font-medium">
            FOLLOW US HERE:
          </p>

          <div className="flex items-center gap-4">
            {[Dribbble, Instagram, Linkedin, Github].map((Icon, i) => (
              <span
                key={i}
                className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <Icon size={20} />
              </span>
            ))}
          </div>
        </div>

        {/* Links Column */}
        <div className="w-full md:w-1/3">
          <div className="grid gap-3">
            {[
              "Our Services",
              "Projects",
              "Dedicated team",
              "Open Source",
              "Referral Program",
              "Contacts",
              "Blog",
            ].map((item, i) => (
              <Link
                key={i}
                to="/"
                className="text-lg font-medium text-white hover:text-yellow-400 transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div className="w-full md:w-1/3">
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">DROP US A LINE</p>
            <p className="text-lg font-semibold text-white">inquiry@halo-lab.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">CALL US</p>
            <div className="flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              <p className="text-lg font-semibold text-white">+1 (213) 337-8573</p>
            </div>
          </div>
        </div>
      </div>
      <div>

       <p className="text-center border-y-2 py-4 border-gray-500 text-lg font-semibold text-white">© HackZen. All rights reserved</p>

      </div>
    </footer>
  );
}

export default Footer;
