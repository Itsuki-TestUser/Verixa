import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "How to Reduce HR Ticket Volume by 60% with AI Document Q&A",
    "description": "Learn how RAG-powered document search eliminates repetitive policy questions and frees HR teams for strategic work."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="How to Reduce HR Ticket Volume by 60% with AI Document Q&A"
        description="Learn how RAG-powered document search eliminates repetitive policy questions and frees HR teams for strategic work."
        canonicalUrl="https://verixaai.com/blog/reduce-hr-tickets-with-ai-document-qa"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Reduce HR Tickets by 60%
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Learn how RAG-powered document search eliminates repetitive policy questions and frees HR teams for strategic work.
        </p>
      </main>
    </div>
  );
};

export default Page;
