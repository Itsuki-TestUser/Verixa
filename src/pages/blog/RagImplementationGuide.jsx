import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "The Enterprise Guide to RAG Implementation for Internal Documents",
    "description": "Step-by-step guide to implementing Retrieval-Augmented Generation for company policies and procedures."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="The Enterprise Guide to RAG Implementation for Internal Documents"
        description="Step-by-step guide to implementing Retrieval-Augmented Generation for company policies and procedures."
        canonicalUrl="https://verixaai.com/blog/enterprise-rag-implementation-guide"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Enterprise Guide to RAG
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Step-by-step guide to implementing Retrieval-Augmented Generation for company policies and procedures.
        </p>
      </main>
    </div>
  );
};

export default Page;
