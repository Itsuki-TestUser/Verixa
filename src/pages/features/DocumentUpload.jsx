import React from 'react';
import SEO from '../../components/SEO';
import Topbar from '../../components/Topbar';

const Page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Secure PDF Upload & Processing | Verixa AI",
    "description": "Upload employee handbooks, policy documents, and procedures. Verixa AI processes PDFs with enterprise-grade security and makes them instantly searchable via AI Q&A."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title="Secure PDF Upload & Processing | Verixa AI"
        description="Upload employee handbooks, policy documents, and procedures. Verixa AI processes PDFs with enterprise-grade security and makes them instantly searchable via AI Q&A."
        canonicalUrl="https://verixaai.com/features/document-upload"
        schema={schema}
      />
      
      <Topbar />

      <main className="flex-1 p-8 mt-16 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          Upload Once. Answer Everything.
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Upload employee handbooks, policy documents, and procedures. Verixa AI processes PDFs with enterprise-grade security and makes them instantly searchable via AI Q&A.
        </p>
      </main>
    </div>
  );
};

export default Page;
