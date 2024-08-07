import React from 'react';
import Head from 'next/head';

const TermsOfService = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Head>
        <title>Terms of Service - Express Entry Search Engine</title>
        <meta name="description" content="Terms of Service for Express Entry Search Engine" />
      </Head>
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      <p className="text-lg mb-8">
        Welcome to Express Entry Search Engine. By accessing or using our service at https://expressentry.ca, you agree to be bound by these Terms of Service. Please read them carefully.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="text-lg mb-4">
          By using Express Entry Search Engine, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use of the Service</h2>
        <p className="text-lg mb-4">
          You may use Express Entry Search Engine for lawful purposes only. You agree not to use the service for any illegal, abusive, or harmful activities. We reserve the right to terminate your access to the service if you violate these terms.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="text-lg mb-4">
          Express Entry Search Engine and all its content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Privacy Policy</h2>
        <p className="text-lg mb-4">
          Your use of Express Entry Search Engine is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
        <p className="text-lg mb-4">
          Express Entry Search Engine is provided "as is" and "as available" without any warranties of any kind, whether express or implied. We do not guarantee that the service will be error-free or uninterrupted.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p className="text-lg mb-4">
          To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
        <p className="text-lg mb-4">
          We may terminate or suspend your access to Express Entry Search Engine immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service. Upon termination, your right to use the service will immediately cease.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p className="text-lg mb-4">
          We reserve the right to modify or replace these Terms of Service at any time. It is your responsibility to check these Terms periodically for changes.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p className="text-lg mb-4">
          If you have any questions about these Terms of Service or for sponsorship opportunities, please contact us at <a href="mailto:ishti@expressentry.ca" className="text-blue-600 hover:underline">ishti@expressentry.ca</a>.
        </p>
      </section>
      <p className="text-lg italic mt-12 text-center">
        Last updated: August 7, 2024
      </p>
    </div>
  );
};

export default TermsOfService;