import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Document Search vs Manual PDF Searching | Verixa AI",
    "description": "Stop Ctrl+F searching through PDFs. Verixa AI understands questions and retrieves exact answers with context."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="AI Document Search vs Manual PDF Searching | Verixa AI"
        description="Stop Ctrl+F searching through PDFs. Verixa AI understands questions and retrieves exact answers with context."
        canonicalUrl="https://verixaai.com/compare/verixa-ai-vs-manual-document-search"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Stop Searching. Start Asking.
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Stop Ctrl+F searching through PDFs. Verixa AI understands questions and retrieves exact answers with context.
        </p>
      </main>
    </div>
  );
};

export default Page;
