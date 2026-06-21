import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FileText,
  Search,
  Zap,
  Shield,
  TrendingDown,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
} from "lucide-react";

const Homepage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verixa AI",
    url: "https://verixaai-rag-app.vercel.app/",
    logo: "https://verixaai-rag-app.vercel.app/favicon.png",
    sameAs: [
      "www.linkedin.com/in/immuhammadsaad",
      "https://github.com/Muhammad-Saad-786",
    ],
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Verixa AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <SEO
        title="Verixa AI - AI-Powered Document Q&A for Enterprise Knowledge Bases"
        description="Transform how employees access company policies. Verixa AI ingests your PDFs and provides instant, cited answers to policy and procedure questions. Reduce HR tickets by 60%."
        canonicalUrl="https://verixaai-rag-app.vercel.app/"
        ogImage="https://verixaai-rag-app.vercel.app/preview.png"
        schema={schema}
      />

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 opacity-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img
                  className="h-8 w-auto"
                  src="/favicon.png"
                  alt="Verixa AI"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Verixa AI
                </span>
              </Link>
            </motion.div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all hover:scale-105 whitespace-nowrap"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all whitespace-nowrap"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stop Searching.
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Start Finding Answers.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Your company's knowledge, instantly accessible. Upload PDFs, ask
            questions in plain English, and get precise, cited answers in
            seconds.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-10 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all inline-flex items-center gap-2 text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/demo"
                className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 text-lg border-2 border-indigo-200 dark:border-slate-700"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16"
          >
            {[
              { value: "60%", label: "Fewer HR Tickets" },
              { value: "5 min", label: "Setup Time" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            variants={fadeInUp}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-8">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-600 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-slate-500 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-slate-500 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg p-4 hidden lg:block"
            >
              <FileText className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-700 rounded-xl shadow-lg p-4 hidden lg:block"
            >
              <Search className="w-8 h-8 text-purple-600" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-gray-50/50 dark:bg-slate-800/50">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Problem With Company Knowledge
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Every day, employees waste hours searching for simple answers
              </p>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Clock,
                  title: "Time Waste",
                  description:
                    "Employees spend 3+ hours weekly digging through PDFs and wikis for basic policy questions.",
                  stat: "19%",
                  statLabel: "of work week lost",
                },
                {
                  icon: Users,
                  title: "HR Overload",
                  description:
                    "HR teams drown in repetitive questions about vacation policies, benefits, and procedures.",
                  stat: "40%",
                  statLabel: "repetitive queries",
                },
                {
                  icon: TrendingDown,
                  title: "Productivity Loss",
                  description:
                    "Critical information remains buried in documents, slowing down decision-making and onboarding.",
                  stat: "$12k",
                  statLabel: "lost per employee/year",
                },
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg border border-red-100 dark:border-red-900/30 group hover:border-red-300 dark:hover:border-red-700 transition-all"
                >
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                    <problem.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {problem.description}
                  </p>
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-600">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                      {problem.stat}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {problem.statLabel}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                How Verixa AI{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Transforms
                </span>{" "}
                Knowledge Access
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                AI-powered answers from your documents in seconds
              </p>
            </motion.div>

            <motion.div variants={staggerChildren} className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Connect Your Documents",
                  description:
                    "Upload PDFs, policies, and handbooks. Our AI processes them instantly, understanding context and relationships.",
                  icon: FileText,
                  color: "from-blue-600 to-cyan-600",
                },
                {
                  step: "02",
                  title: "Ask Natural Questions",
                  description:
                    "Type questions like you're asking a colleague. No keywords, no filters, no complex queries needed.",
                  icon: Search,
                  color: "from-indigo-600 to-purple-600",
                },
                {
                  step: "03",
                  title: "Get Instant, Cited Answers",
                  description:
                    "Receive precise answers with direct citations to source documents. Know exactly where information comes from.",
                  icon: Zap,
                  color: "from-purple-600 to-pink-600",
                },
              ].map((solution, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                    >
                      {solution.step}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {solution.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <solution.icon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50/50 dark:bg-slate-800/50">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Powerful features designed for enterprise knowledge management
              </p>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description:
                    "SOC 2 compliant, encrypted at rest and in transit",
                },
                {
                  icon: Zap,
                  title: "Real-Time Answers",
                  description: "Sub-second response times with 99.9% accuracy",
                },
                {
                  icon: FileText,
                  title: "Multi-Format Support",
                  description: "PDF, DOCX, TXT, and more formats supported",
                },
                {
                  icon: CheckCircle,
                  title: "Source Citations",
                  description: "Every answer linked to source documents",
                },
                {
                  icon: TrendingDown,
                  title: "Analytics Dashboard",
                  description:
                    "Track usage, common questions, and knowledge gaps",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Share knowledge bases across departments",
                },
                {
                  icon: Clock,
                  title: "Auto-Sync",
                  description: "Documents automatically update when changed",
                },
                {
                  icon: Search,
                  title: "Semantic Search",
                  description: "AI understands intent, not just keywords",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-16 shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Knowledge Base?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies using Verixa AI to make their knowledge
            instantly accessible.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/signup"
              className="bg-white text-indigo-600 font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transition-all text-lg inline-flex items-center gap-2 "
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-black font-semibold">
          © 2025 Verixa AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Animated Section Component
const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      {children}
    </motion.div>
  );
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2 } },
};

export default Homepage;
