import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-xl animate-fadeInUp">
        {/* Big Gradient 404 */}
        <h1 className="text-[110px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] drop-shadow-xl">
          404
        </h1>

        {/* Subheading */}
        <p className="text-3xl font-semibold text-gray-800 mt-2">
          Page Not Found
        </p>
        <p className="text-gray-500 mt-3 text-base">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-6 inline-block bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
        >
          Go Back Home
        </Link>   
      </div>
    </div>
  );
}; 

export default NotFound;
