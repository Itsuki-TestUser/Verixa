import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Compliance Document Q&A for Regulated Industries | Verixa AI",
    "description": "Ensure employees follow procedures with AI-powered compliance search. Instant answers about data retention, GDPR, SOC 2, and internal controls."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Compliance Document Q&A for Regulated Industries | Verixa AI"
        description="Ensure employees follow procedures with AI-powered compliance search. Instant answers about data retention, GDPR, SOC 2, and internal controls."
        canonicalUrl="https://verixaai.com/solutions/compliance"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Compliance at Your Fingertips
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Ensure employees follow procedures with AI-powered compliance search. Instant answers about data retention, GDPR, SOC 2, and internal controls.
        </p>
      </main>
    </div>
  );
};

export default Page;
