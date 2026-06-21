import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Verixa AI Blog - Insights on RAG, Knowledge Management & AI Q&A",
    "description": "Expert insights on RAG implementation, enterprise knowledge management, and AI-powered document search."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Verixa AI Blog - Insights on RAG, Knowledge Management & AI Q&A"
        description="Expert insights on RAG implementation, enterprise knowledge management, and AI-powered document search."
        canonicalUrl="https://verixaai.com/blog"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Verixa AI Blog
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Expert insights on RAG implementation, enterprise knowledge management, and AI-powered document search.
        </p>
      </main>
    </div>
  );
};

export default Page;
