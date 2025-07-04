import React, { useState, useEffect } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Make sure this path is correct

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // ✅ From context

  // Get redirectTo from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setTwoFAError("");
    setShow2FA(false);
    setTwoFACode("");
    setTwoFAUserId("");

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      if (res.data.require2FA) {
        setShow2FA(true);
        setTwoFAUserId(res.data.userId);
        return;
      }

      // ✅ Save using context
      login(res.data.user, res.data.token);

      // ✅ Redirect by role or to redirectTo if specified
      const role = res.data.user.role;
      if (onClose) onClose();
      if (redirectTo) {
        navigate(redirectTo);
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setTwoFAError("");
    try {
      const res = await axios.post("http://localhost:3000/api/users/2fa/login", {
        userId: twoFAUserId,
        token: twoFACode,
      });
      // You may want to issue JWT here in backend and return it
      login(res.data.user, res.data.token);
      if (onClose) onClose();
      if (redirectTo) {
        navigate(redirectTo);
      } else if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setTwoFAError(err.response?.data?.message || "Invalid 2FA code");
    }
  };

  const handleGoogleLogin = () => {
    // Add redirectTo to Google OAuth URL if present
    const googleUrl = redirectTo 
      ? `http://localhost:3000/api/users/google?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/google";
    window.location.href = googleUrl;
  };

  const handleGithubLogin = () => {
    // Add redirectTo to GitHub OAuth URL if present
    const githubUrl = redirectTo 
      ? `http://localhost:3000/api/users/github?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/github";
    window.location.href = githubUrl;
  };

  return (
    <div className="bg-white px-6 py-8 rounded-2xl shadow-xl w-full max-w-lg text-black space-y-6">
      <h2 className="text-2xl font-bold text-center">Welcome Back 👋</h2>
      <p className="text-center text-sm text-gray-600">Login to continue</p>

      {show2FA ? (
        <form onSubmit={handle2FASubmit} className="space-y-4">
          <div className="text-center text-gray-700 text-sm mb-2">Enter the 6-digit code from your authenticator app</div>
          {twoFAError && <div className="text-red-600 text-sm font-medium">{twoFAError}</div>}
          <input
            type="text"
            value={twoFACode}
            onChange={e => setTwoFACode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f] text-center text-lg tracking-widest"
            placeholder="123 456"
            maxLength={6}
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition"
          >
            Verify 2FA
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
            >
              <GoogleIcon className="w-6 h-6" />
              <span className="font-medium">Continue with Google</span>
            </button>

            <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
            >
              <Github className="w-6 h-6" />
              <span className="font-medium">Continue with GitHub</span>
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm">
            — or login with email —
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="text-red-600 text-sm font-medium">{errorMsg}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a
              href={redirectTo ? `/register?redirectTo=${encodeURIComponent(redirectTo)}` : "/register"}
              className="text-[#1b0c3f] font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </>
      )}
    </div>
  );
}

export default Login;
