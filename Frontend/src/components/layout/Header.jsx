import React from "react";
import { GitCommitVerticalIcon } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const carouselImages = [
  "https://ideogram.ai/assets/image/lossless/response/oSco3y3BSzCcyzuWtAgubg",
  "https://ideogram.ai/assets/image/lossless/response/dDf5PRlRQ4iSFJ6siUZR4w",
  "https://ideogram.ai/assets/image/lossless/response/Vwv7PBHJTU-bulM7lScAHQ",
];

function Header() {
  return (
    <section className="text-white px-4 sm:px-6 py-10 flex items-center justify-center overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1440px] gap-12 ">
      <div className="flex-1 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] rounded-3xl p-6 sm:p-10 flex flex-col justify-between gap-10 w-full lg:min-w-[900px] shadow-2xl">

          <h1 className="text-3xl sm:text-5xl md:text-[82px] font-bold font-heading1 leading-tight md:leading-[95px]">
            Empowering Hackers to Build the{" "}
            <span className="text-yellow-400">TOP 1%</span> Projects of Tomorrow
          </h1>

          <div className="flex flex-col gap-6">
            <div className="flex items-start sm:items-center gap-3">
              <GitCommitVerticalIcon className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-400 hover:rotate-90 transition-all duration-200 ease-in-out" />
              <p className="text-base sm:text-lg font-semibold">
                From registrations to real-time judging — we’ve powered
                developer communities with beautiful, reliable infrastructure.
              </p>
            </div>

            <button className="w-full bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition shadow-md text-center">
              ⚡ Explore Hackathons
            </button>
          </div>
        </div>

        {/* Right Image Carousel */}
        <div className="flex-1 w-full h-[300px] sm:h-[400px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            className="h-full"
          >
            {carouselImages.map((img, index) => (
              <div key={index} className="h-full w-full">
                <img
                  src={img}
                  alt={`carousel-${index}`}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Header;
