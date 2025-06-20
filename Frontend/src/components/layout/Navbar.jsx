"use client";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, GitGraphIcon, Menu, X, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Make sure this is active
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import { InteractiveHoverButton } from "../Magic UI/HoverButton";
import { AnimatedList } from "../Magic UI/AnimatedList";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth(); // ✅ Use 'user' only

  const navigate = useNavigate(); // ✅ For navigation

  const handleDashboard = () => {
    navigate("/dashboard"); // ✅ Redirect to dashboard
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/notifications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data) {
        setNotifications(data.filter((n) => !n.read));
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  return (
    <div className="relative">
      {(showLogin || showRegister) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30"></div>
      )}

      <nav className="px-6 pt-0">
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

          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          {showRegister && (
            <RegisterModal onClose={() => setShowRegister(false)} />
          )}

          <div className="hidden md:flex items-center gap-4">
            {/* ✅ Icons Row */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  <BellIcon className="w-6 h-6 text-[#1b0c3f]" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 border border-white/10  bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] backdrop-blur-lg text-sm overflow-hidden">
                    <div className="p-4 border-b border-white/10 font-semibold text-white text-lg">
                      Notifications
                    </div>
                    <div className="max-h-80 min-h-80 overflow-y-auto px-2 py-1 scrollbar-hide">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-300">
                          No new notifications
                        </div>
                      ) : (
                        <AnimatedList>
                          {notifications.map((n) => (
                            <div
                              key={n._id}
                              className="group transition-all duration-200 ease-in-out hover:scale-[101%] bg-white/5 backdrop-blur-md rounded-lg px-4 py-3 mb-2 border border-white/10 shadow-sm hover:shadow-md"
                            >
                              <div className="font-medium text-white group-hover:text-yellow-400">
                                {n.message}
                              </div>
                              <div className="text-xs text-gray-300 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </AnimatedList>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <InteractiveHoverButton onClick={() => setShowLogin(true)}>
                  Login
                </InteractiveHoverButton>
                <InteractiveHoverButton onClick={() => setShowRegister(true)}>
                  Register
                </InteractiveHoverButton>
              </>
            ) : (
              <button
                onClick={handleDashboard}
                className="px-4 py-2 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] text-white rounded-3xl font-semibold flex gap-3 items-center"
              >
                Dashboard <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
          </div>

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

        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4">
            {["Home", "Hackathons", "More", "About"].map((text, index) => (
              <Link
                key={index}
                to={`/${text.toLowerCase()}`}
                className="text-gray-800 hover:text-indigo-600 font-medium"
              >
                {text}
              </Link>
            ))}
            {!user ? (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-left text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-left text-indigo-600"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={handleDashboard}
                className="text-left text-red-600 font-medium"
              >
                Dashboard
              </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
