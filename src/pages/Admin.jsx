import React, { useState, useCallback, useEffect } from "react";
import { UploadCloud, FileText, Trash2, Loader2 } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { apiService } from "../services/api";
import SEO from "../components/SEO";

const Admin = () => {
  const { documents, setDocuments } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [category, setCategory] = useState("Other");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const safeDocuments = Array.isArray(documents) ? documents : [];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setFetchError(null);
    try {
      const fetchedDocs = await apiService.getDocuments();
      setDocuments(Array.isArray(fetchedDocs) ? fetchedDocs : []);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      setFetchError("Failed to load documents.");
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [category],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFiles = async (files) => {
    if (!files.length) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    const progressList = files.map((file) => ({
      name: file.name,
      status: "Uploading...",
    }));
    setUploadProgress(progressList);

    try {
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 10 * 1024 * 1024) {
          progressList[i].status = "Error: File too large (Max 10MB)";
          setUploadProgress([...progressList]);
          continue;
        }

        const ext = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "docx", "txt", "csv", "md"].includes(ext)) {
          progressList[i].status = "Error: Invalid format";
          setUploadProgress([...progressList]);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        try {
          await apiService.uploadDocument(formData);
          progressList[i].status = "Done";
          setUploadProgress([...progressList]);
          successCount++;
        } catch (err) {
          progressList[i].status = "Failed";
          setUploadProgress([...progressList]);
        }
      }

      if (successCount > 0) {
        setSuccessMsg(`Successfully uploaded ${successCount} documents!`);
      } else {
        setError("No documents were uploaded successfully.");
      }
      await fetchDocuments();
    } catch (err) {
      setError("Failed to process upload request.");
      console.error(err);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress([]);
        setSuccessMsg(null);
        setError(null);
      }, 5000);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = null;
  };

  const deleteDoc = async (id) => {
    try {
      await apiService.deleteDocument(id);
      // Refetch instead of filtering locally
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto min-h-0 h-full">
      <SEO
        title="Admin Dashboard | Verixa AI"
        description="Manage your documents with Verixa AI."
      />
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Admin & Document Management
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10">
          Upload and categorize company knowledge base for AI ingestion.
        </p>

        <div className="mb-6 flex flex-col max-w-sm">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          >
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Legal">Legal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-3xl p-8 md:p-16 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
          }`}
        >
          <UploadCloud
            className={`w-10 h-10 mx-auto mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`}
          />
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Drag and drop documents here
          </p>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Support formats: PDF, DOCX, MD, TXT, CSV up to 50MB per file.
          </p>
          <label className="inline-block px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer relative overflow-hidden">
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />{" "}
                Uploading...
              </>
            ) : (
              "Browse Files"
            )}
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileInput}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="mt-4">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-4 mb-4 text-sm text-emerald-700 bg-emerald-100 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
              {successMsg}
            </div>
          )}
          {uploadProgress.length > 0 && (
            <div className="mt-4 p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Upload Progress
              </h4>
              <ul className="space-y-2">
                {uploadProgress.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400 truncate w-2/3">
                      {p.name}
                    </span>
                    <span
                      className={`font-medium ${p.status === "Done" ? "text-emerald-500" : p.status.includes("Error") || p.status === "Failed" ? "text-red-500" : "text-blue-500 animate-pulse"}`}
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Indexed Knowledge base
            </h3>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs rounded-full font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
              {safeDocuments.length} Files
            </span>
          </div>

          {fetchError ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">{fetchError}</p>
              <button
                onClick={fetchDocuments}
                className="text-sm text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">
                        Document Name
                      </th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">
                        Category
                      </th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm">
                        Uploaded on
                      </th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-sm w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeDocuments.map((doc) => (
                      <tr
                        key={doc._id}
                        className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate max-w-[200px]">
                              {doc.title || doc.originalName || doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              doc.category === "Finance"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : doc.category === "HR"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            }`}
                          >
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteDoc(doc._id)}
                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {safeDocuments.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate">
                            {doc.title || doc.originalName || doc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                doc.category === "Finance"
                                  ? "bg-amber-100 text-amber-700"
                                  : doc.category === "HR"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {doc.category}
                            </span>
                            <span className="text-xs text-slate-400">
                              {doc.createdAt
                                ? new Date(doc.createdAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDoc(doc._id)}
                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {safeDocuments.length === 0 && !fetchError && (
                <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No documents currently indexed in the system.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
