import React, { useEffect, useState } from "react";
import { InteractiveGridPattern } from "../components/Magic UI/InteractiveGridPattern";

import { cn } from "../pages/Dashboard/AdimPage/components/lib/utils";
const HackZenLoader = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "HackZen";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Force grid to full screen */}
       {/* Animated grid pattern background */}
                <InteractiveGridPattern
                  className={cn(
                    "absolute inset-0 z-0 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
                  )}
                  width={40}
                  height={40}
                  squares={[80, 80]}
                  squaresClassName="hover:fill-primary"
                />

      {/* Centered loading text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-black font-mono tracking-wide">
            {displayedText}
            <span className="animate-blink">|</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HackZenLoader;
