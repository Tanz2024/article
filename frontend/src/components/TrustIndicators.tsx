// src/components/TrustIndicators.tsx
"use client";
import Link from "next/link";
import { FaShieldAlt, FaAward, FaUsers, FaCheckCircle, FaNewspaper, FaGlobe, FaCertificate, FaHandshake } from "react-icons/fa";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: FaShieldAlt,
      title: "Editorial Independence",
      description: "Our newsroom operates with complete editorial independence, free from external influence.",
      color: "bg-blue-500"
    },
    {
      icon: FaCheckCircle,
      title: "Fact-Checked Content",
      description: "Every article undergoes rigorous fact-checking by our experienced editorial team.",
      color: "bg-green-500"
    },
    {
      icon: FaAward,
      title: "Award-Winning Journalism",
      description: "Our team has received recognition for excellence in digital journalism and reporting.",
      color: "bg-yellow-500"
    },
    {
      icon: FaUsers,
      title: "Expert Contributors",
      description: "Written by journalists, industry experts, and verified contributors worldwide.",
      color: "bg-purple-500"
    },
    {
      icon: FaGlobe,
      title: "Global Network",
      description: "Coverage from correspondents and partners in over 50 countries worldwide.",
      color: "bg-indigo-500"
    },
    {
      icon: FaCertificate,
      title: "Ethical Standards",
      description: "We adhere to the highest ethical standards in journalism and media practices.",
      color: "bg-red-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Trust Tanznews?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our commitment to quality journalism, transparency, and editorial integrity sets us apart in today's media landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {indicators.map((indicator, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className={`w-12 h-12 ${indicator.color} rounded-full flex items-center justify-center mb-4`}>
                <indicator.icon className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {indicator.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {indicator.description}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial Standards Link */}
        <div className="text-center">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FaNewspaper className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Learn More About Our Standards
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Discover our comprehensive editorial guidelines, ethics policy, and commitment to journalistic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about"
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <FaHandshake />
                About Us
              </Link>
              <Link
                href="/editorial-standards"
                className="border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <FaCertificate />
                Editorial Standards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
