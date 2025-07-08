import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  
  // Add refs to prevent excessive badge checks
  const lastBadgeCheckRef = useRef(0);
  const isCheckingBadgesRef = useRef(false);

  // Check for new badges after login with debouncing
  const checkForNewBadges = async (userId, force = false) => {
    if (!userId || isCheckingBadgesRef.current) return;
    
    const now = Date.now();
    const timeSinceLastCheck = now - lastBadgeCheckRef.current;
    
    // Debounce: only allow checks every 10 minutes unless forced
    if (!force && timeSinceLastCheck < 600000) {
      console.log(`[Auth] ⏱️ Skipping badge check (checked ${Math.round(timeSinceLastCheck/1000)}s ago)`);
      return;
    }
    
    try {
      isCheckingBadgesRef.current = true;
      lastBadgeCheckRef.current = now;
      
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.post(
        `http://localhost:3000/api/badges/check${force ? '?force=true' : ''}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('[Auth] ✅ Badge check completed after login');
    } catch (err) {
      console.error('Failed to check badges after login:', err);
    } finally {
      isCheckingBadgesRef.current = false;
    }
  };

  // ✅ Login helper
  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    
    // Check for new badges after login (forced check)
    await checkForNewBadges(userData._id, true);
  };

  // ✅ Logout handler
  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/api/users/logout", {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout error:", err.message);
    }

    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/");
  };

  // ✅ OAuth redirect handling (token in URL)
  // ✅ 1. Handle OAuth redirect from URL
  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const oauthToken = url.get("token");
    const name = url.get("name");
    const email = url.get("email");
    const id = url.get("id");

    if (oauthToken && name && email && id) {
      const userData = {
        _id: id,
        name,
        email,
      };
      login(userData, oauthToken);
      navigate("/dashboard");
    }
  }, [location]);

  // ✅ 2. Sync user/token from localStorage across tabs
  useEffect(() => {
    const sync = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setToken(storedToken || null);
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // ✅ Refresh user info from backend
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        // Check for new badges after user refresh (not forced)
        await checkForNewBadges(res.data._id, false);
      }
    } catch (err) {
      console.error("Failed to refresh user info:", err.message);
    }
  }, []);

  // Check for new badges when user changes (only on initial load)
  useEffect(() => {
    if (user?._id) {
      // Only check on initial load, not on every user change
      const hasCheckedBefore = lastBadgeCheckRef.current > 0;
      if (!hasCheckedBefore) {
        checkForNewBadges(user._id, false);
      }
    }
  }, [user?._id]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
