"use client";
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-white/10 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <EnvelopeIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
        </div>
        <p className="mb-6 text-lg">
          Have a question, suggestion, or news tip? Our team would love to hear from you. Fill out the form below and we’ll get back to you as soon as possible.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit} aria-label="Contact form">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1">Your Name</label>
            <input id="name" type="text" placeholder="Name" className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Your Email</label>
            <input id="email" type="email" placeholder="Email" className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-1">Your Message</label>
            <textarea id="message" placeholder="Message" className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white min-h-[100px] focus:border-primary focus:ring-2 focus:ring-primary/20 transition" required />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
            <PaperAirplaneIcon className="h-5 w-5" /> Send Message
          </button>
          {sent && <div className="text-green-600 font-semibold text-center mt-2">Thank you! Your message has been sent.</div>}
        </form>
        <p className="mt-8 text-sm">Or email us directly at <a href="mailto:info@tanznews.com" className="underline">info@tanznews.com</a></p>
      </div>
    </main>
  );
}
