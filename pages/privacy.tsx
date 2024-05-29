import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12">
      <Head>
        <title>Privacy Policy - Your AI Chatbot</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-lg mb-8">
        At Your AI Chatbot, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our website and services.
      </p>
      <h2 className="text-2xl font-bold mb-4">Information Collection</h2>
      <p className="text-lg mb-8">
        When you utilize our AI chatbot, we collect and store your search queries to enhance our services and provide a personalized user experience. We do not collect any personally identifiable information unless you voluntarily provide it to us.
      </p>
      <h2 className="text-2xl font-bold mb-4">Information Usage</h2>
      <p className="text-lg mb-8">
        The collected search queries are used to analyze trends, improve our AI chatbot&apos;s performance, and optimize the user experience. Your search queries may be utilized to train our AI models and algorithms.
      </p>
      <h2 className="text-2xl font-bold mb-4">Data Security</h2>
      <p className="text-lg mb-8">
        We implement industry-standard measures to protect your information from unauthorized access, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </p>
      <h2 className="text-2xl font-bold mb-4">Privacy Policy Updates</h2>
      <p className="text-lg">
        We may update our Privacy Policy periodically. Any changes will be posted on this page, and we encourage you to review the Privacy Policy regularly to stay informed about how we protect your privacy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;