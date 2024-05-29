import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-8">
      <Head>
        <title>Privacy Policy - Your AI Chatbot</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At Your AI Chatbot, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website and services.
      </p>
      <h2 className="text-2xl font-bold mb-2">Information We Collect</h2>
      <p className="mb-4">
        When you use our AI chatbot, we collect and store your search queries in order to improve our services and provide a better user experience. We do not collect any personally identifiable information unless you voluntarily provide it to us.
      </p>
      <h2 className="text-2xl font-bold mb-2">Use of Information</h2>
      <p className="mb-4">
        We use the collected search queries to analyze trends, improve our AI chatbot's performance, and enhance the overall user experience. Your search queries may be used to train our AI models and algorithms.
      </p>
      <h2 className="text-2xl font-bold mb-2">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </p>
      <h2 className="text-2xl font-bold mb-2">Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
    </div>
  );
};

export default PrivacyPolicy;