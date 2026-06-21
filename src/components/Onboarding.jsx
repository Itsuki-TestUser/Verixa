import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Upload,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "Welcome to Verixa AI!",
    description:
      "Let's get you set up in under 2 minutes. Your AI-powered knowledge base starts here.",
    action: "continue",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Upload,
    title: "Upload Your Documents",
    description:
      "Add PDFs, DOCX, or text files. The AI will analyze them and make them searchable.",
    action: "upload",
    link: "/admin",
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: MessageSquare,
    title: "Ask Your First Question",
    description:
      "Chat with your documents. Ask anything and get instant, cited answers.",
    action: "chat",
    link: "/chat",
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: CheckCircle,
    title: "You're All Set!",
    description:
      "Your workspace is ready. Invite team members and start collaborating.",
    action: "done",
    color: "from-amber-600 to-orange-600",
  },
];

const Onboarding = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");

  if (dismissed) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  const changeStep = (newStep) => {
    setDirection(newStep > currentStep ? "forward" : "backward");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      changeStep(currentStep + 1);
    } else {
      localStorage.setItem("onboardingComplete", "true");
      onClose?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      changeStep(currentStep - 1);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("onboardingComplete", "true");
    setDismissed(true);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Progress Bar */}
        <div className="flex gap-1.5 p-5 pb-0">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => i < currentStep && changeStep(i)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < currentStep
                  ? "bg-blue-600 cursor-pointer hover:opacity-80"
                  : i === currentStep
                    ? "bg-blue-600"
                    : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <div className="px-5 pt-3 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </p>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with animation */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: "280px" }}
        >
          <div
            key={currentStep}
            className={`p-6 pt-4 pb-8 text-center transition-all duration-300 ${
              animating
                ? direction === "forward"
                  ? "opacity-0 -translate-x-8"
                  : "opacity-0 translate-x-8"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* Animated icon */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20 animate-pulse`}
              />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl transform transition-transform duration-300 hover:scale-110`}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
              {step.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              {step.description}
            </p>

            {/* Step illustration dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "bg-blue-600 w-6"
                      : i < currentStep
                        ? "bg-blue-300"
                        : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
              currentStep === 0
                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-x-1"
            }`}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step.action === "upload" && step.link ? (
            <Link
              to={step.link}
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              Upload Documents
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : step.action === "chat" && step.link ? (
            <Link
              to={step.link}
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Skip */}
        <div className="px-4 pb-4 pt-1 text-center">
          <button
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            Skip setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
