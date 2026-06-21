import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI-Powered Document Q&A with Source Citations | Verixa AI",
    "description": "Employees ask questions in natural language. Verixa AI retrieves exact answers from your documents with page-level citations for verification."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="AI-Powered Document Q&A with Source Citations | Verixa AI"
        description="Employees ask questions in natural language. Verixa AI retrieves exact answers from your documents with page-level citations for verification."
        canonicalUrl="https://verixaai.com/features/ai-qa"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Ask Anything. Get Cited Answers.
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Employees ask questions in natural language. Verixa AI retrieves exact answers from your documents with page-level citations for verification.
        </p>
      </main>
    </div>
  );
};

export default Page;
