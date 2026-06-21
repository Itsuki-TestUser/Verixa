import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Verixa AI vs ChatGPT for Enterprise Document Q&A",
    "description": "ChatGPT lacks your company's context. Verixa AI combines RAG with your private documents for accurate, cited answers from your actual policies."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Verixa AI vs ChatGPT for Enterprise Document Q&A"
        description="ChatGPT lacks your company's context. Verixa AI combines RAG with your private documents for accurate, cited answers from your actual policies."
        canonicalUrl="https://verixaai.com/compare/verixa-ai-vs-chatgpt-enterprise"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Verixa AI vs ChatGPT
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          ChatGPT lacks your company's context. Verixa AI combines RAG with your private documents for accurate, cited answers from your actual policies.
        </p>
      </main>
    </div>
  );
};

export default Page;
