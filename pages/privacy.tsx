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
        At Your ExpressEntry.ca, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our website and services.
      </p>
      <h2 className="text-2xl font-bold mb-4">Information Collection</h2>
      <p className="text-lg mb-8">
        When you sign in to our AI chatbot using your Google account, we collect your email address solely for authentication purposes and to send you opt-in newsletters if you choose to subscribe. We do not collect any other personal information from your Google account.
      </p>
      <h2 className="text-2xl font-bold mb-4">Information Usage</h2>
      <p className="text-lg mb-8">
        Your email address is used only for authentication and to send you newsletters if you have opted in. We do not use your email address for any other purpose or share it with third parties.
      </p>
      <h2 className="text-2xl font-bold mb-4">Data Security</h2>
      <p className="text-lg mb-8">
        We implement industry-standard measures to protect your information from unauthorized access, alteration, or destruction. Your email address is securely stored and encrypted. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </p>
      <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
      <p className="text-lg mb-8">
        We use Google Sign-In to authenticate users and provide a seamless login experience. By signing in with your Google account, you are subject to Google&apos;s privacy policy and terms of service. We do not have access to or control over the information collected by Google during the sign-in process.
      </p>
      <h2 className="text-2xl font-bold mb-4">Privacy Policy Updates</h2>
      <p className="text-lg">
        We may update our Privacy Policy periodically. Any changes will be posted on this page, and we encourage you to review the Privacy Policy regularly to stay informed about how we protect your privacy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;