import fs from "fs";
import path from "path";

const pages = [
  {
    path: "features/DocumentUpload.jsx",
    title: "Secure PDF Upload & Processing | Verixa AI",
    description:
      "Upload employee handbooks, policy documents, and procedures. Verixa AI processes PDFs with enterprise-grade security and makes them instantly searchable via AI Q&A.",
    h1: "Upload Once. Answer Everything.",
    canonicalUrl: "https://verixaai.com/features/document-upload",
  },
  {
    path: "features/AiQA.jsx",
    title: "AI-Powered Document Q&A with Source Citations | Verixa AI",
    description:
      "Employees ask questions in natural language. Verixa AI retrieves exact answers from your documents with page-level citations for verification.",
    h1: "Ask Anything. Get Cited Answers.",
    canonicalUrl: "https://verixaai.com/features/ai-qa",
  },
  {
    path: "solutions/HrPolicies.jsx",
    title: "HR Policy Q&A Automation for Enterprises | Verixa AI",
    description:
      "Reduce HR ticket volume by 60% with AI-powered policy search. Employees get instant answers about PTO, benefits, remote work, and company policies.",
    h1: 'Never Answer "What\'s the Policy?" Again',
    canonicalUrl: "https://verixaai.com/solutions/hr-policies",
  },
  {
    path: "solutions/KnowledgeBase.jsx",
    title: "Internal Knowledge Base AI Search | Verixa AI",
    description:
      "Make your internal wiki, SOPs, and training docs instantly searchable with AI Q&A. Perfect for IT, Operations, and cross-functional teams.",
    h1: "Your Knowledge Base. Instantly Accessible.",
    canonicalUrl: "https://verixaai.com/solutions/knowledge-base",
  },
  {
    path: "solutions/Compliance.jsx",
    title: "Compliance Document Q&A for Regulated Industries | Verixa AI",
    description:
      "Ensure employees follow procedures with AI-powered compliance search. Instant answers about data retention, GDPR, SOC 2, and internal controls.",
    h1: "Compliance at Your Fingertips",
    canonicalUrl: "https://verixaai.com/solutions/compliance",
  },
  {
    path: "compare/TraditionalKnowledgeBase.jsx",
    title: "Verixa AI vs Traditional Knowledge Base Software | Comparison",
    description:
      "Compare AI-powered document Q&A vs manual knowledge base search. See why RAG technology delivers faster, more accurate answers than traditional search.",
    h1: "Traditional Search vs AI Q&A",
    canonicalUrl:
      "https://verixaai.com/compare/verixa-ai-vs-traditional-knowledge-base",
  },
  {
    path: "compare/ManualDocumentSearch.jsx",
    title: "AI Document Search vs Manual PDF Searching | Verixa AI",
    description:
      "Stop Ctrl+F searching through PDFs. Verixa AI understands questions and retrieves exact answers with context.",
    h1: "Stop Searching. Start Asking.",
    canonicalUrl:
      "https://verixaai.com/compare/verixa-ai-vs-manual-document-search",
  },
  {
    path: "compare/ChatgptEnterprise.jsx",
    title: "Verixa AI vs ChatGPT for Enterprise Document Q&A",
    description:
      "ChatGPT lacks your company's context. Verixa AI combines RAG with your private documents for accurate, cited answers from your actual policies.",
    h1: "Verixa AI vs ChatGPT",
    canonicalUrl: "https://verixaai.com/compare/verixa-ai-vs-chatgpt-enterprise",
  },
  {
    path: "pricing/Pricing.jsx",
    title: "Verixa AI Pricing - Transparent Plans for Every Team",
    description:
      "Simple, transparent pricing for AI-powered document Q&A. Start free, scale as you grow.",
    h1: "Pricing Plans",
    canonicalUrl: "https://verixaai.com/pricing",
  },
  {
    path: "blog/BlogIndex.jsx",
    title: "Verixa AI Blog - Insights on RAG, Knowledge Management & AI Q&A",
    description:
      "Expert insights on RAG implementation, enterprise knowledge management, and AI-powered document search.",
    h1: "Verixa AI Blog",
    canonicalUrl: "https://verixaai.com/blog",
  },
  {
    path: "blog/ReduceHrTickets.jsx",
    title: "How to Reduce HR Ticket Volume by 60% with AI Document Q&A",
    description:
      "Learn how RAG-powered document search eliminates repetitive policy questions and frees HR teams for strategic work.",
    h1: "Reduce HR Tickets by 60%",
    canonicalUrl:
      "https://verixaai.com/blog/reduce-hr-tickets-with-ai-document-qa",
  },
  {
    path: "blog/RagImplementationGuide.jsx",
    title: "The Enterprise Guide to RAG Implementation for Internal Documents",
    description:
      "Step-by-step guide to implementing Retrieval-Augmented Generation for company policies and procedures.",
    h1: "Enterprise Guide to RAG",
    canonicalUrl:
      "https://verixaai.com/blog/enterprise-rag-implementation-guide",
  },
];

const template = (page) => `import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${page.title.replace(/"/g, '\\"')}",
    "description": "${page.description.replace(/"/g, '\\"')}"
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="${page.title.replace(/"/g, '\\"')}"
        description="${page.description.replace(/"/g, '\\"')}"
        canonicalUrl="${page.canonicalUrl}"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          ${page.h1}
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          ${page.description}
        </p>
      </main>
    </div>
  );
};

export default Page;
`;

pages.forEach((p) => {
  const fullPath = path.join("e:/Enterprise-Project-SaaS/src/pages", p.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, template(p));
  console.log("Created: ", fullPath);
});
