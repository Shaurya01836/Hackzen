import React, { useState } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/users/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/api/users/github";
  };

  return (
    <div className="bg-white px-6 py-8 rounded-2xl shadow-xl w-full max-w-lg text-black space-y-6">
      <h2 className="text-2xl font-bold text-center">Welcome Back 👋</h2>
      <p className="text-center text-sm text-gray-600">Login to continue</p>

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
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-[#1b0c3f] font-medium hover:underline"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export default Login;