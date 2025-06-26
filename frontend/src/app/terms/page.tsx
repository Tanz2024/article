import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-white/10 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <DocumentTextIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        <p className="mb-4 text-lg">
          By accessing or using Tanznews, you agree to these Terms of Service. Please read them carefully. If you do not agree, you may not use our services.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><span className="font-semibold">Content:</span> All content is for informational purposes only. Tanznews does not guarantee the accuracy, completeness, or timeliness of any information.</li>
          <li><span className="font-semibold">User Conduct:</span> Users must not post illegal, abusive, defamatory, or misleading content. Respectful, lawful participation is required at all times.</li>
          <li><span className="font-semibold">Moderation:</span> We reserve the right to moderate, edit, or remove any content at our discretion, and to suspend or terminate accounts for violations.</li>
          <li><span className="font-semibold">Intellectual Property:</span> All articles, images, and site content are the property of Tanznews or their respective owners. Do not reproduce without permission.</li>
          <li><span className="font-semibold">Limitation of Liability:</span> Tanznews is not liable for any damages arising from your use of the site or reliance on its content.</li>
          <li><span className="font-semibold">Changes:</span> We may update these terms at any time. Continued use of the site constitutes acceptance of the new terms.</li>
        </ul>
        <div className="flex items-center gap-2 mb-4">
          <ExclamationTriangleIcon className="h-5 w-5 text-primary" />
          <span className="text-sm">For questions, please contact us at <a href="/contact" className="text-primary underline">our contact page</a>.</span>
        </div>
        <div className="mt-8 text-sm text-gray-700 dark:text-gray-300">Effective date: June 2025</div>
      </div>
    </main>
  );
}
