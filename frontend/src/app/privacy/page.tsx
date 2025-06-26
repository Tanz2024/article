import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-white/10 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <LockClosedIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="mb-4 text-lg">
          Your privacy is important to us. Tanznews is committed to protecting your personal information and being transparent about how we use it.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>We collect only the information necessary to provide our services and improve your experience.</li>
          <li>We never sell your data to third parties.</li>
          <li>Cookies are used for site functionality, analytics, and personalization.</li>
          <li>Your email is used only for account management and newsletters (if you opt in).</li>
          <li>You can unsubscribe from emails or delete your account at any time.</li>
        </ul>
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="h-5 w-5 text-primary" />
          <span className="text-sm">For questions or requests regarding your data, please contact us at <a href="/contact" className="text-primary underline">our contact page</a>.</span>
        </div>
        <div className="mt-8 text-sm text-gray-700 dark:text-gray-300">Effective date: June 2025</div>
      </div>
    </main>
  );
}
