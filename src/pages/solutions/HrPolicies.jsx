import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "HR Policy Q&A Automation for Enterprises | Verixa AI",
    "description": "Reduce HR ticket volume by 60% with AI-powered policy search. Employees get instant answers about PTO, benefits, remote work, and company policies."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="HR Policy Q&A Automation for Enterprises | Verixa AI"
        description="Reduce HR ticket volume by 60% with AI-powered policy search. Employees get instant answers about PTO, benefits, remote work, and company policies."
        canonicalUrl="https://verixaai.com/solutions/hr-policies"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Never Answer "What's the Policy?" Again
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Reduce HR ticket volume by 60% with AI-powered policy search. Employees get instant answers about PTO, benefits, remote work, and company policies.
        </p>
      </main>
    </div>
  );
};

export default Page;
