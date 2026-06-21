import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { FileText, Search, Library } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { apiService } from "../services/api";
import EmptyState from "../components/EmptyStates";

const DocumentsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="h-48 bg-white dark:bg-slate-800 rounded-2xl p-6 animate-pulse border border-slate-200 dark:border-slate-700"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4" />
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
        <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-700 rounded mb-4" />
        <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 rounded mt-auto" />
      </div>
    ))}
  </div>
);

const Documents = () => {
  const { documents, setDocuments, filter } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedDocs = await apiService.getDocuments();
      setDocuments(Array.isArray(fetchedDocs) ? fetchedDocs : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = Array.isArray(documents)
    ? filter === "All"
      ? documents
      : documents.filter((d) => d.category === filter)
    : [];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <SEO
        title="Knowledge Base | Verixa AI"
        description="Search, analyze and chat with your documents using Verixa AI."
      />
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Knowledge Base
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10">
          Browse documents the AI uses to generate answers.
        </p>

        {error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {error}
            </p>
            <button
              onClick={fetchDocuments}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <DocumentsSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="group flex flex-col justify-between h-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute -right-6 -top-6 text-slate-100 dark:text-slate-800/50 transform rotate-12 group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-colors">
                    <Library className="w-32 h-32" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate pr-8">
                      {doc.title || doc.originalName || doc.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {doc.category} ·{" "}
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 mt-4 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search className="w-3 h-3" /> View Source
                  </div>
                </div>
              ))}
            </div>

            {!loading && filteredDocs.length === 0 && (
              <EmptyState
                icon={Library}
                title="No documents found"
                description="Upload documents to get started with AI-powered answers."
                actionLabel="Upload Documents"
                actionTo="/admin"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Documents;
