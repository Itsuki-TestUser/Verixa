import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Verixa AI vs Traditional Knowledge Base Software | Comparison",
    "description": "Compare AI-powered document Q&A vs manual knowledge base search. See why RAG technology delivers faster, more accurate answers than traditional search."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Verixa AI vs Traditional Knowledge Base Software | Comparison"
        description="Compare AI-powered document Q&A vs manual knowledge base search. See why RAG technology delivers faster, more accurate answers than traditional search."
        canonicalUrl="https://verixaai.com/compare/verixa-ai-vs-traditional-knowledge-base"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Traditional Search vs AI Q&A
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Compare AI-powered document Q&A vs manual knowledge base search. See why RAG technology delivers faster, more accurate answers than traditional search.
        </p>
      </main>
    </div>
  );
};

export default Page;
