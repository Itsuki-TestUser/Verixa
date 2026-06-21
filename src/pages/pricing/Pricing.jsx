import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Verixa AI Pricing - Transparent Plans for Every Team",
    "description": "Simple, transparent pricing for AI-powered document Q&A. Start free, scale as you grow."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Verixa AI Pricing - Transparent Plans for Every Team"
        description="Simple, transparent pricing for AI-powered document Q&A. Start free, scale as you grow."
        canonicalUrl="https://verixaai.com/pricing"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Pricing Plans
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Simple, transparent pricing for AI-powered document Q&A. Start free, scale as you grow.
        </p>
      </main>
    </div>
  );
};

export default Page;
