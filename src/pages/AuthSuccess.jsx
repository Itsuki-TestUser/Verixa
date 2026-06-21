import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function AuthSuccess() {
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setStatus("success");
      setTimeout(() => {
        window.location.href = "/chat";
      }, 1500);
    } else {
      setStatus("error");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Verifying your account...
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
              Successfully authenticated!
            </h1>
            <p className="text-sm text-slate-400">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Authentication failed
            </h1>
            <p className="text-sm text-slate-400">
              Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
