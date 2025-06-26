import { ShieldCheckIcon, GlobeAltIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-white/10 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <GlobeAltIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">About Tanznews</h1>
        </div>
        <p className="mb-2 text-lg">
          <b>Tanznews</b> is a modern, independent news platform dedicated to delivering accurate, timely, and unbiased news from around the world. Our mission is to empower readers with trusted information and foster a well-informed, engaged community.
        </p>
        <div className="flex flex-col md:flex-row gap-6 mt-2">
          <div className="flex-1 bg-white text-black dark:bg-neutral-800 dark:text-white rounded-2xl p-6 shadow-card flex flex-col gap-2 border border-gray-300 dark:border-white/10">
            <ShieldCheckIcon className="h-7 w-7 text-primary mb-1" />
            <span className="font-semibold">Integrity & Trust</span>
            <p className="text-sm">We uphold the highest standards of journalistic integrity, transparency, and ethics. Our editorial team is committed to fact-checking and unbiased reporting.</p>
          </div>
          <div className="flex-1 bg-white text-black dark:bg-neutral-800 dark:text-white rounded-2xl p-6 shadow-card flex flex-col gap-2 border border-gray-300 dark:border-white/10">
            <UsersIcon className="h-7 w-7 text-primary mb-1" />
            <span className="font-semibold">Diversity & Community</span>
            <p className="text-sm">Tanznews values diversity, inclusion, and the free exchange of ideas. We strive to provide a platform where every voice can be heard and every story can be told.</p>
          </div>
        </div>
        <p className="mt-4">
          We cover a wide range of topics including world events, politics, business, health, entertainment, sports, and more. Join us in building a well-informed, engaged global community.
        </p>
        <div className="mt-8 text-sm text-gray-700 dark:text-gray-300">Last updated: June 2025</div>
      </div>
    </main>
  );
}
