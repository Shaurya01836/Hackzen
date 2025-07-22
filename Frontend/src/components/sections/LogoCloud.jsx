import React from "react";

const logos = [
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-google-787fe6abad1dd82c9649d3df3bd69dd57f809a9e0ed03f50d34bd7fe99c65149.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-microsoft-f031e14cee2eed463f96ffb0dfb12c1673c267b26c121a8eeb84b7d73167aad6.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-meta-4dc0e3e51b1a51daf337cce5b8bf88248e03de5f091c71b19aa5bab51d300a13.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-aws-b50597147463829bfe074684f7f08ce234a9533f8b6c664302bef1639976ff68.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-okta-cd6c1ec184b5bf1dfc7de72c477f0a251730b4047e5469430437220edb683b69.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-square-1b9e7550415fc4bbb5c2c8fcf3b4c3dfc79f88756ff7f5c2a4031914d7410c67.svg",
  "https://d2dmyh35ffsxbl.cloudfront.net/assets/home/homepage/header/brands/logo-atlassian-22de2f366987d618efd24409efd6d7e5512ba2ad70bc9179647912bd4827268b.svg",
];

function LogoCloud() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 text-sm md:text-base mb-6 font-semibold">
          Trusted by the world's leading organizations
        </p>

        <div className="border border-gray-300 rounded-3xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`logo-${index}`}
              className="h-16 sm:h-16 md:h-28 object-contain hover:scale-110 transition-transform duration-150 ease-in-out"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoCloud;
