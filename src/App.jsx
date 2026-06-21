import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Documents from "./pages/Documents";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Homepage from "./pages/Homepage";
import DocumentUpload from "./pages/features/DocumentUpload";
import AiQA from "./pages/features/AiQA";
import HrPolicies from "./pages/solutions/HrPolicies";
import KnowledgeBase from "./pages/solutions/KnowledgeBase";
import Compliance from "./pages/solutions/Compliance";
import TraditionalKnowledgeBase from "./pages/compare/TraditionalKnowledgeBase";
import ManualDocumentSearch from "./pages/compare/ManualDocumentSearch";
import ChatgptEnterprise from "./pages/compare/ChatgptEnterprise";
import Pricing from "./pages/pricing/Pricing";
import BlogIndex from "./pages/blog/BlogIndex";
import ReduceHrTickets from "./pages/blog/ReduceHrTickets";
import RagImplementationGuide from "./pages/blog/RagImplementationGuide";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Onboarding from "./components/Onboarding";
import { useState, useEffect } from "react";
import ToastContainer from "./components/Toast";
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();
  const workspaceRole = localStorage.getItem("myWorkspaceRole") || "member";
  const isAdmin = user?.role === "admin" || workspaceRole === "admin";

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/chat" replace />;
  return children;
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (user && !onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Sidebar role={user.role} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden relative w-full h-full">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {showOnboarding && (
        <Onboarding onClose={() => setShowOnboarding(false)} />
      )}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route
              path="/"
              element={
                <GuestRoute>
                  <Homepage />
                </GuestRoute>
              }
            />
            <Route
              path="/features/document-upload"
              element={<DocumentUpload />}
            />
            <Route path="/features/ai-qa" element={<AiQA />} />
            <Route path="/solutions/hr-policies" element={<HrPolicies />} />
            <Route
              path="/solutions/knowledge-base"
              element={<KnowledgeBase />}
            />
            <Route path="/solutions/compliance" element={<Compliance />} />
            <Route
              path="/compare/verixa-ai-vs-traditional-knowledge-base"
              element={<TraditionalKnowledgeBase />}
            />
            <Route
              path="/compare/verixa-ai-vs-manual-document-search"
              element={<ManualDocumentSearch />}
            />
            <Route
              path="/compare/verixa-ai-vs-chatgpt-enterprise"
              element={<ChatgptEnterprise />}
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route
              path="/blog/reduce-hr-tickets-with-ai-document-qa"
              element={<ReduceHrTickets />}
            />
            <Route
              path="/blog/enterprise-rag-implementation-guide"
              element={<RagImplementationGuide />}
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Auth />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <Auth />
                </GuestRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Chat />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ErrorBoundary>
                    <Admin />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ErrorBoundary>
                    <Documents />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
