import React, { useState, useEffect } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
    setLoading(true);

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

      // Save using context
      login(res.data.user, res.data.token);

      // Redirect by role or to redirectTo if specified
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
      console.error("Login error:", err);
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setTwoFAError("");
    setTwoFALoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/users/2fa/login", {
        userId: twoFAUserId,
        token: twoFACode,
      });

      if (res.data.success) {
        // Save using context
        login(res.data.user, res.data.token);
        
        if (onClose) onClose();
        if (redirectTo) {
          navigate(redirectTo);
        } else if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setTwoFAError("Invalid 2FA code");
      }
    } catch (err) {
      console.error("2FA login error:", err);
      setTwoFAError(err.response?.data?.message || "Invalid 2FA code");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTwoFACode(value);
    if (twoFAError) setTwoFAError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && twoFACode.length === 6) {
      handle2FASubmit(e);
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
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          
          {twoFAError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{twoFAError}</p>
            </div>
          )}
          
          <div>
            <input
              type="text"
              value={twoFACode}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f] text-center text-lg tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={twoFALoading || twoFACode.length !== 6}
            className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
          >
            {twoFALoading ? "Verifying..." : "Verify 2FA"}
          </button>
          
          <button
            type="button"
            onClick={() => setShow2FA(false)}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Login
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMsg}</p>
              </div>
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
              disabled={loading}
              className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
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
