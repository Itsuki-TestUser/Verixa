import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const { login } = useAuth();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    console.log("TOKEN:", token);
    console.log("USER DATA:", userData);

    // 🚨 HARD VALIDATION (very important)
    if (!token || token === "null" || token === "undefined") {
      setStatus("error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // ✅ Save token immediately
    localStorage.setItem("token", token);

    const processLogin = async () => {
      try {
        if (userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem("user", JSON.stringify(user));
          login(user, token);
        } else {
          await fetchUserAndLogin(token);
        }

        setStatus("success");

        setTimeout(() => {
          window.location.href = "/chat";
        }, 1000);
      } catch (err) {
        console.error("Login processing failed:", err);
        setStatus("error");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    };

    processLogin();
  }, []);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";

  const fetchUserAndLogin = async (token) => {
    try {
      if (!token || token === "null" || token === "undefined") {
        throw new Error("Invalid token");
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const user = await res.json();

      localStorage.setItem("user", JSON.stringify(user));
      login(user, token);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setStatus("error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Signing you in...
            </h1>
            <p className="text-sm text-slate-400">Please wait a moment</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Successfully signed in!
            </h1>
            <p className="text-sm text-slate-400">Redirecting to chat...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Sign in failed
            </h1>
            <p className="text-sm text-slate-400">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
