import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "../services/api";
import { toast, Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid password reset link");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength check (basic)
  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 8
          ? 2
          : password.match(/[0-9]/) &&
              password.match(/[a-zA-Z]/) &&
              password.match(/[^a-zA-Z0-9]/)
            ? 4
            : 3;

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col justify-center items-center font-sans p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            Create new password
          </h2>
          <p className="text-slate-500 mt-2">
            Your new password must be different from previous used passwords
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8"
        >
          {isSuccess ? (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Password Reset!
              </h3>
              <p className="text-slate-500 mb-6">
                Your password has been successfully reset. You will be
                redirected to the login page shortly.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Click here if you are not redirected
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {password.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? "bg-red-400" : strength === 2 ? "bg-orange-400" : strength >= 3 ? "bg-green-400" : "") : "bg-slate-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full ${strength >= 2 ? (strength === 2 ? "bg-orange-400" : strength >= 3 ? "bg-green-400" : "") : "bg-slate-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full ${strength >= 3 ? "bg-green-400" : "bg-slate-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full ${strength >= 4 ? "bg-green-500" : "bg-slate-200"}`}
                  ></div>
                </div>
              )}
              {password.length > 0 && password.length < 8 && (
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  Must be at least 8 characters
                </p>
              )}

              <div className="relative group pt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  password.length < 8 ||
                  password !== confirmPassword
                }
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl py-3 shadow-lg shadow-indigo-500/30 flex justify-center items-center group transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
