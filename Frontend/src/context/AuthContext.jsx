import { createContext, useContext, useEffect, useState } from "react";
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

  // ✅ Login helper
  const login = (userData, tokenData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
    setUser(userData);
    setToken(tokenData);
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
  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const oauthToken = url.get("token");
    const name = url.get("name");
    const email = url.get("email");

    if (oauthToken && name && email) {
      const userData = { name, email };
      login(userData, oauthToken);
      navigate("/dashboard");
    }
  }, [location]);

  // ✅ Sync across tabs
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
