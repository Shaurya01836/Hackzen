"use client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BellIcon,
  GitGraphIcon,
  Menu,
  X,
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
import useDropdownTimeout from "../../hooks/useDropdownTimeout";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHackathonDropdown, setShowHackathonDropdown] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL search parameters for modal state
  const searchParams = new URLSearchParams(location.search);
  const showLogin = searchParams.get("modal") === "login";
  const showRegister = searchParams.get("modal") === "register";

  const { handleMouseEnter: notifEnter, handleMouseLeave: notifLeave } =
    useDropdownTimeout(setShowNotificationDropdown);
  const { handleMouseEnter: profileEnter, handleMouseLeave: profileLeave } =
    useDropdownTimeout(setShowProfileDropdown);
  const { handleMouseEnter: hackathonEnter, handleMouseLeave: hackathonLeave } =
    useDropdownTimeout(setShowHackathonDropdown);
  const { handleMouseEnter: resourceEnter, handleMouseLeave: resourceLeave } =
    useDropdownTimeout(setShowResourceDropdown);

  const handleDashboard = () => navigate("/dashboard");

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowProfileDropdown(false);
    setShowSignOutConfirm(false);
    navigate("/");
  };

  const showSignOutConfirmation = () => {
    setShowSignOutConfirm(true);
    setShowProfileDropdown(false);
  };

  const handleLoginClick = () => {
    navigate("/?modal=login");
  };

  const handleRegisterClick = () => {
    navigate("/?modal=register");
  };

  const handleCloseAuthModal = () => {
    navigate("/");
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
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30"></div>
      )}

      <SignOutModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />

      {/* Auth Modals */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30">
          <LoginModal onClose={handleCloseAuthModal} />
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30">
          <RegisterModal onClose={handleCloseAuthModal} />
        </div>
      )}

      <nav className="px-6 pt-0">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dg2q2tzbv/image/upload/v1751960561/logo_bg_yvh9hq.png"
                alt="HackZen Logo"
                className="w-10 h-10 object-contain border rounded-full"
              />
              <h1 className="text-2xl font-bold font-heading1 text-[#1b0c3f]">
                HackZen
              </h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              to="/"
              className="text-[#1b0c3f] hover:text-primary font-medium hover:rotate-3"
            >
              Home
            </Link>

            {/* Hackathons Dropdown */}
            <div
              className="relative"
              onMouseEnter={hackathonEnter}
              onMouseLeave={hackathonLeave}
            >
              <button className="text-[#1b0c3f] hover:text-primary font-medium flex items-center gap-1">
                Hackathons <ChevronDown className="w-4 h-4" />
              </button>
              {showHackathonDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-white/30 border border-gray-200 rounded-xl shadow-lg w-56 z-50 py-2">
                  <Link
                    to="/dashboard/explore-hackathons"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Explore Hackathons
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/dashboard/my-hackathons"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Hackathons
                      </Link>
                      <Link
                        to="/dashboard/my-submissions"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Submissions
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/dashboard/organization-hub"
              className="text-[#1b0c3f] hover:text-primary font-medium hover:rotate-3"
            >
              Organisation Hub
            </Link>
            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={resourceEnter}
              onMouseLeave={resourceLeave}
            >
              <button className="text-[#1b0c3f] hover:text-primary font-medium flex items-center gap-1">
                Resources <ChevronDown className="w-4 h-4" />
              </button>
              {showResourceDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-white/30 border border-gray-200 rounded-xl shadow-lg w-56 z-50 py-2">
                  <Link
                    to="/dashboard/project-archive"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Project Archive
                  </Link>
                  <Link
                    to="/dashboard/blogs"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Blogs
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/about"
              className="text-[#1b0c3f] hover:text-primary font-medium hover:rotate-3"
            >
              About
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications */}
            <div
              className="relative"
              onMouseEnter={notifEnter}
              onMouseLeave={notifLeave}
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
                        {[...notifications].map((n) => (
                          <div
                            key={n._id}
                            className="group bg-white/30 rounded-lg px-4 py-3 mb-2 border border-black/10 transition hover:scale-[101%]"
                          >
                            <div className="font-medium text-black ">
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
                <InteractiveHoverButton onClick={handleLoginClick}>
                  Login
                </InteractiveHoverButton>
                <InteractiveHoverButton onClick={handleRegisterClick}>
                  Register
                </InteractiveHoverButton>
              </>
            ) : (
              <div
                className="relative"
                onMouseEnter={profileEnter}
                onMouseLeave={profileLeave}
              >
                <div
                  className="cursor-pointer w-10 h-10 rounded-full bg-[#1b0c3f] text-white flex items-center justify-center font-semibold text-sm uppercase overflow-hidden"
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
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  )}
                </div>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 text-sm overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                    >
                      Profile
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === "organizer" && (
                      <Link
                        to="/dashboard/organizer-tools"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                      >
                        Organizer Tools
                      </Link>
                    )}
                    <Link
                      to="/dashboard/profile/privacy-security"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={showSignOutConfirmation}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
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

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4">
            <Link
              to="/"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/dashboard/explore-hackathons"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Explore Hackathons
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard/my-hackathons"
                  className="text-gray-800 hover:text-indigo-600 font-medium"
                >
                  My Hackathons
                </Link>
                <Link
                  to="/dashboard/my-submissions"
                  className="text-gray-800 hover:text-indigo-600 font-medium"
                >
                  My Submissions
                </Link>
              </>
            )}

            <Link
              to="/dashboard/project-archive"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Project Archive
            </Link>
            <Link
              to="/dashboard/blogs"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Blogs
            </Link>
            <Link
              to="/dashboard/organization-hub"
              className="text-gray-800 hover:text-indigo-600 font-medium"
            >
              Organisation Hub
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
                  onClick={handleLoginClick}
                  className="text-left text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
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
                <button
                  onClick={showSignOutConfirmation}
                  className="text-left text-red-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
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
