import React, { useState } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [emailForCode, setEmailForCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirectTo from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      setStep(2);
      setEmailForCode(form.email);
      setSuccessMsg(res.data.message || "Verification code sent to your email.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axios.post("http://localhost:3000/api/users/verify-registration", {
        email: emailForCode,
        code
      });
      login(res.data.user, res.data.token);
      if (onClose) onClose();
      if (!res.data.user.profileCompleted) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };
  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post("http://localhost:3000/api/users/register", {
        name: form.name,
        email: emailForCode,
        password: form.password
      });
      setSuccessMsg("Verification code resent to your email.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to resend code.");
    }
  };

  const handleGoogleSignup = () => {
    // Add redirectTo to Google OAuth URL if present
    const googleUrl = redirectTo 
      ? `http://localhost:3000/api/users/google?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/google";
    window.location.href = googleUrl;
  };

  const handleGithubSignup = () => {
    // Add redirectTo to GitHub OAuth URL if present
    const githubUrl = redirectTo 
      ? `http://localhost:3000/api/users/github?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/github";
    window.location.href = githubUrl;
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      // Fallback to direct navigation if smooth transition not available
      const loginUrl = redirectTo 
        ? `/?modal=login&redirectTo=${encodeURIComponent(redirectTo)}`
        : "/?modal=login";
      navigate(loginUrl);
    }
  };

  return (
    <div className="bg-white px-10 py-10 rounded-2xl shadow-xl w-full max-w-2xl text-black space-y-6 max-h-[90vh] overflow-y-auto scroll-container">
      <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
      <p className="text-center text-sm text-gray-600">Join the community</p>
      {/* Auth Buttons */}
      {step === 1 && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleGoogleSignup} className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full">
              <GoogleIcon className="w-6 h-6" />
              <span className="font-medium">Sign up with Google</span>
            </button>
            <button onClick={handleGithubSignup} className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full">
              <Github className="w-6 h-6" />
              <span className="font-medium">Sign up with GitHub</span>
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm">— or sign up with email —</div>
          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && <div className="text-red-600 text-sm font-medium">{errorMsg}</div>}
            {successMsg && <div className="text-green-600 text-sm font-medium">{successMsg}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Name*</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password*</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="********" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]" />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Enter Verification Code</h3>
            <p className="text-gray-600 text-sm mb-4">A 6-digit code was sent to <b>{emailForCode}</b>. Please enter it below.</p>
          </div>
          {errorMsg && <div className="text-red-600 text-sm font-medium">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 text-sm font-medium">{successMsg}</div>}
          <div>
            <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f] text-center text-lg tracking-widest font-mono" />
          </div>
          <button type="submit" className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition">Verify & Create Account</button>
          <div className="flex flex-col items-center gap-2 mt-2">
            <button type="button" onClick={handleResend} className="text-[#1b0c3f] font-medium hover:underline">Resend Code</button>
            <button type="button" onClick={() => { setStep(1); setErrorMsg(""); setSuccessMsg(""); setCode(""); }} className="text-gray-600 hover:underline text-sm">Back to Registration</button>
          </div>
        </form>
      )}
      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <a href="#" onClick={handleSwitchToLogin} className="text-[#1b0c3f] font-medium hover:underline">Login</a>
      </p>
    </div>
  );
}

export default Register;