import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  BrainCircuit,
  Network,
  FileText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [taglineText, setTaglineText] = useState("");
  const fullTagline = "Verixa AI — Intelligent Document Understanding";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Basic typing animation effect
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setTaglineText(fullTagline.slice(0, i));
      i++;
      if (i > fullTagline.length) {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await apiService.login({ email, password });
        login(data.user, data.token);
        navigate("/chat");
      } else {
        const data = await apiService.signup({ name, email, password });
        login(data.user, data.token);
        navigate("/chat");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row font-sans overflow-hidden">
      {/* LEFT SECTION - Brand & Animation */}
      <motion.div
        className="w-full md:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 md:p-16 flex flex-col justify-center relative overflow-hidden shrink-0 min-h-[40vh] md:min-h-screen"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Background Nodes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-[200%] h-[200%] max-w-[800px] max-h-[800px] rounded-full border border-indigo-500/30 border-dashed absolute"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-[150%] h-[150%] max-w-[600px] max-h-[600px] rounded-full border border-purple-500/20 border-dotted absolute"
          />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-center lg:pl-10">
          <div className="mb-12 relative flex justify-center md:justify-start">
            {/* Glowing Brain Element */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.4)",
                  "0 0 40px rgba(168, 85, 247, 0.6)",
                  "0 0 20px rgba(99, 102, 241, 0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-2xl bg-indigo-600/20 border border-indigo-500/50 backdrop-blur-xl flex items-center justify-center relative z-20"
            >
              <BrainCircuit className="w-12 h-12 text-indigo-400" />
            </motion.div>

            {/* Floating Documents */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-8 w-16 h-16 rounded-xl bg-purple-600/20 border border-purple-500/30 backdrop-blur-md flex items-center justify-center"
            >
              <FileText className="w-8 h-8 text-purple-400" />
            </motion.div>

            {/* Sub-nodes */}
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-6 bottom-0 w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md flex items-center justify-center"
            >
              <Network className="w-6 h-6 text-blue-400" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight text-center md:text-left">
            Unlock the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Power of Knowledge
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-mono h-16 text-center md:text-left">
            {taglineText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 bg-indigo-500 ml-1 h-5 align-middle"
            />
          </p>
        </div>
      </motion.div>

      {/* RIGHT SECTION - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 bg-white/60 backdrop-blur-3xl shrink-0 h-full min-h-screen">
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Toggle Pills */}
          <div className="flex bg-slate-100 p-1 rounded-full mb-8 relative">
            <motion.div
              className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
              animate={{ left: isLogin ? "4px" : "calc(50%)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => {
                setIsLogin(true);
                navigate("/login");
              }}
              className={`w-1/2 py-2.5 text-sm font-semibold rounded-full relative z-10 transition-colors ${
                isLogin
                  ? "text-indigo-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              type="button"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                navigate("/signup");
              }}
              className={`w-1/2 py-2.5 text-sm font-semibold rounded-full relative z-10 transition-colors ${
                !isLogin
                  ? "text-indigo-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              type="button"
            >
              Create Account
            </button>
          </div>

          {/* Form Content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {isLogin ? "Welcome back" : "Join Verixa AI"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin
                ? "Enter your credentials to access your workspace."
                : "Create an account to start analyzing documents."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl py-3 shadow-lg shadow-indigo-500/30 flex justify-center items-center group transition-all disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-slate-200" />
            <span className="z-10 bg-white dark:bg-slate-900 px-4 text-sm text-slate-400">
              Or continue with
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              disabled
              onClick={() =>
                (window.location.href =
                  "https://enterprise-project-saas-production.up.railway.app/api/auth/google/callback")
              }
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            <button
              disabled
              onClick={() =>
                (window.location.href =
                  "https://enterprise-project-saas-production.up.railway.app/api/auth/github/callback")
              }
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
