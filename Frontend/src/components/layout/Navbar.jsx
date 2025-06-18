import { Link } from "react-router-dom";
import {
  BellIcon,
  User2Icon,
  GitGraphIcon,
  Menu,
  X,
  LogIn, UserPlus
} from "lucide-react";
import { useState } from "react";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="relative">
      {/* Blur overlay when modal is open */}
      {(showLogin || showRegister) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30"></div>
      )}

      <nav className=" bg-white px-6 py-4">
        <div className="w-full px-6 py-4 flex items-center justify-between border-y-2">
          <div className="flex items-center gap-2">
            <GitGraphIcon className="w-6 h-6 text-[#1b0c3f] hover:rotate-90 transition-all duration-200 ease-in-out" />
            <h1 className="text-2xl font-bold font-heading1 text-[#1b0c3f]">
              HackZen
            </h1>
          </div>

          <div className="hidden md:flex gap-6">
            {["Home", "Hackathons", "More", "About"].map((text, index) => (
              <Link
                key={index}
                to={`/${text.toLowerCase()}`}
                className="text-[#1b0c3f] hover:text-primary font-medium transition-all duration-150 ease-in-out hover:rotate-3"
              >
                {text}
              </Link>
            ))}
          </div>

          {/* Login & Register Modals */}
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          {showRegister && (
            <RegisterModal onClose={() => setShowRegister(false)} />
          )}

          {/* Right-side buttons */}
          <div className="hidden md:flex gap-4 items-center">
            <BellIcon className="w-6 h-6 text-[#1b0c3f] hover:bg-[#1b0c3f] hover:text-white transition-all duration-150 ease-in-out hover:rounded-xl hover:p-1 hover:scale-150" />
            <User2Icon className="w-6 h-6 text-[#1b0c3f] hover:bg-[#1b0c3f] hover:text-white transition-all duration-150 ease-in-out hover:rounded-xl hover:p-1 hover:scale-150" />
{/* Login Button */}
<button
  onClick={() => setShowLogin(true)}
  className="px-4 py-2 bg-[#1b0c3f] text-white rounded-3xl font-semibold flex gap-3 items-center hover:skew-x-6 hover:scale-105 transition-all duration-200 ease-in-out"
>
  Login
  <LogIn className="w-6 h-6 bg-white rounded-full text-[#1b0c3f] p-1 hover:bg-[#1b0c3f] hover:text-white hover:border-2 transition-all duration-200" />
</button>

{/* Register Button */}
<button
  onClick={() => setShowRegister(true)}
  className="px-4 py-2 bg-[#1b0c3f] text-white rounded-3xl font-semibold flex gap-3 items-center hover:skew-x-6 hover:scale-105 transition-all duration-200 ease-in-out"
>
  Register
  <UserPlus className="w-6 h-6 bg-white rounded-full text-[#1b0c3f] p-1 hover:bg-[#1b0c3f] hover:text-white hover:border-2 transition-all duration-200" />
</button>

          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="w-6 h-6 text-indigo-600" />
              ) : (
                <Menu className="w-6 h-6 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4">
            <Link
              to="/"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/hackathons"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Hackathons
            </Link>
            <Link
              to="/more"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              More
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              About
            </Link>
            <div>
              <BellIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
