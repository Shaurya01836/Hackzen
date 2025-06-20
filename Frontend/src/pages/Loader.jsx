import React, { useEffect, useState } from "react";
import { InteractiveGridPattern } from "../components/Magic UI/InteractiveGridPattern";
import { cn } from "../pages/Dashboard/AdimPage/components/lib/utils";

const HackZenLoader = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "HackZen";

  useEffect(() => {
    let index = 0;
    let direction = 1; // 1 for typing, -1 for deleting
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));

      index += direction;

      if (index > fullText.length) {
        direction = -1;
        index = fullText.length;
        setTimeout(() => {}, 1000); // pause before deleting
      } else if (index < 0) {
        direction = 1;
        index = 0;
        setTimeout(() => {}, 500); // pause before typing again
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Grid Background */}
      <InteractiveGridPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
        )}
        width={40}
        height={40}
        squares={[80, 80]}
        squaresClassName="hover:fill-primary"
      />

      {/* Centered Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-black text-black font-mono tracking-wide">
          {displayedText}
          <span className="animate-blink">|</span>
        </h1>

      </div>
    </div>
  );
};

export default HackZenLoader;
