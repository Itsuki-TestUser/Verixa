import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Internal Knowledge Base AI Search | Verixa AI",
    "description": "Make your internal wiki, SOPs, and training docs instantly searchable with AI Q&A. Perfect for IT, Operations, and cross-functional teams."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Internal Knowledge Base AI Search | Verixa AI"
        description="Make your internal wiki, SOPs, and training docs instantly searchable with AI Q&A. Perfect for IT, Operations, and cross-functional teams."
        canonicalUrl="https://verixaai.com/solutions/knowledge-base"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Your Knowledge Base. Instantly Accessible.
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Make your internal wiki, SOPs, and training docs instantly searchable with AI Q&A. Perfect for IT, Operations, and cross-functional teams.
        </p>
      </main>
    </div>
  );
};

export default Page;
