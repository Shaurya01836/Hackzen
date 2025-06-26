"use client";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  GitGraphIcon,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import { InteractiveHoverButton } from "../Magic UI/HoverButton";
import { AnimatedList } from "../Magic UI/AnimatedList";
import SignOutModal from "../SignOutModal";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const [profileTimeout, setProfileTimeout] = useState(null);

  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const { user, logout } = useAuth(); // Add logout from useAuth

  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  // Sign out handler
  const handleSignOut = () => {
    logout(); // Clear auth context
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false); // Close dropdown
    setShowSignOutConfirm(false); // Close confirmation modal
    navigate("/"); // Redirect to home
  };

  // Show sign out confirmation
  const showSignOutConfirmation = () => {
    setShowSignOutConfirm(true);
    setIsOpen(false); // Close profile dropdown
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
      {(showLogin || showRegister || showSignOutConfirm) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30"></div>
      )}

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />

      <nav className="px-6 pt-0">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitGraphIcon className="w-6 h-6 text-[#1b0c3f] hover:rotate-90 transition-all duration-200 ease-in-out" />
            <h1 className="text-2xl font-bold font-heading1 text-[#1b0c3f]">
              HackZen
            </h1>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              to="/"
              className="text-[#1b0c3f] hover:text-primary font-medium transition-all duration-150 ease-in-out hover:rotate-3"
            >
              Home
            </Link>

            <Link
              to="/community"
              className="text-[#1b0c3f] hover:text-primary font-medium transition-all duration-150 ease-in-out hover:rotate-3"
            >
              Community
            </Link>
            <Link
              to="/more"
              className="text-[#1b0c3f] hover:text-primary font-medium transition-all duration-150 ease-in-out hover:rotate-3"
            >
              More
            </Link>
            <Link
              to="/about"
              className="text-[#1b0c3f] hover:text-primary font-medium transition-all duration-150 ease-in-out hover:rotate-3"
            >
              About
            </Link>
          </div>

          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          {showRegister && (
            <RegisterModal onClose={() => setShowRegister(false)} />
          )}

          {/* Icons + Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notification Bell */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (notificationTimeout) clearTimeout(notificationTimeout);
                setShowNotificationDropdown(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowNotificationDropdown(false);
                }, 200); // 200ms delay
                setNotificationTimeout(timeout);
              }}
            >
              <button>
                <BellIcon className="w-6 h-6 text-[#1b0c3f]" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 border border-gray-200 bg-white/20 backdrop-blur-lg text-sm overflow-hidden">
                  <div className="p-4 border-b border-black/10 font-semibold text-lg">
                    Notifications
                  </div>
                  <div className="max-h-80 min-h-80 overflow-y-auto px-2 py-1 scrollbar-hide">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-300">
                        No new notifications
                      </div>
                    ) : (
                      <AnimatedList>
                        {[...notifications].reverse().map((n) => (
                          <div
                            key={n._id}
                            className="group transition-all duration-200 ease-in-out hover:scale-[101%] 
                                     bg-white/30 backdrop-blur-lg rounded-lg px-4 py-3 mb-2 
                                      border border-black/10 "
                          >
                            <div className="font-medium text-black group-hover:text-indigo-600">
                              {n.message}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
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
              <div
                className="relative"
                onMouseEnter={() => {
                  if (profileTimeout) clearTimeout(profileTimeout);
                  setIsOpen(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setIsOpen(false);
                  }, 200); // You can adjust this timeout
                  setProfileTimeout(timeout);
                }}
              >
                <div
                  className="cursor-pointer w-10 h-10 rounded-full bg-[#1b0c3f] overflow-hidden text-white flex items-center justify-center font-semibold text-sm uppercase"
                  onClick={() => setIsOpen((prev) => !prev)}
                  title={user?.name || user?.email}
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.name
                        ? user.name.charAt(0)
                        : user?.email?.charAt(0)}
                    </span>
                  )}
                </div>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 text-sm overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}

                    {user?.role === "organizer" && (
                      <Link
                        to="/dashboard?view=organizer-tools"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Organizer Tools
                      </Link>
                    )}
                    <Link
                      to="/profile/account-settings"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>

                    {/* Sign Out Option */}
                    <button
                      onClick={showSignOutConfirmation}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
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
              to="/dashboard?view=explore-hackathons"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Explore Hackathons
            </Link>
            <Link
              to="/dashboard?view=my-hackathons"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              My Hackathons
            </Link>
            <Link
              to="/community"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Community
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
              <>
                <button
                  onClick={handleDashboard}
                  className="text-left text-indigo-600 font-medium"
                >
                  Dashboard
                </button>
                {/* Mobile Sign Out */}
                <button
                  onClick={showSignOutConfirmation}
                  className="text-left text-red-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
