import React from 'react';
import Head from 'next/head';

const TermsOfService = () => {
  return (
    <div className="container mx-auto py-12">
      <Head>
        <title>Terms of Service - Your AI Chatbot</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-lg mb-8">
        By using our AI chatbot, you agree to be bound by these Terms of Service.
      </p>
      <h2 className="text-2xl font-bold mb-4">Use of the AI Chatbot</h2>
      <p className="text-lg mb-8">
        You may use our AI chatbot for lawful purposes only. You agree not to use the chatbot for any illegal, abusive, or harmful activities.
      </p>
      <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
      <p className="text-lg mb-8">
        The AI chatbot and all its content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
      </p>
      <h2 className="text-2xl font-bold mb-4">Termination</h2>
      <p className="text-lg mb-8">
        We may terminate or suspend your access to the AI chatbot immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.
      </p>
      <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
      <p className="text-lg">
        The AI chatbot is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, whether express or implied.
      </p>      
      <h2 className="text-2xl font-bold mb-4">Termination</h2>
      <p className="text-lg mb-8">
        We may terminate or suspend your access to the AI chatbot immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service. Upon cancellation or termination of your account, you will immediately lose access to all premium features.
      </p>
    </div>
  );
};

export default TermsOfService;