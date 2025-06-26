// src/components/SocialProof.tsx
"use client";
import { FaUsers, FaNewspaper, FaQuoteLeft, FaStar, FaCheckCircle, FaGlobe } from "react-icons/fa";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
}

interface SocialProofProps {
  subscriberCount?: number;
  articleCount?: number;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "Tech Solutions Inc.",
    content: "This platform delivers high-quality, well-researched articles that keep our team informed about industry trends. The content is always reliable and insightful.",
    rating: 5
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Journalist",
    company: "News Weekly",
    content: "As a fellow journalist, I appreciate the editorial standards and depth of reporting here. It's become my go-to source for breaking news and analysis.",
    rating: 5
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    role: "Research Scientist",
    content: "The science and technology coverage is exceptional. Complex topics are explained clearly without losing accuracy. Highly recommend for anyone in STEM.",
    rating: 5
  }
];

const pressLogos = [
  { name: "TechCrunch", logo: "/logos/techcrunch.svg" },
  { name: "Forbes", logo: "/logos/forbes.svg" },
  { name: "Reuters", logo: "/logos/reuters.svg" },
  { name: "Associated Press", logo: "/logos/ap.svg" },
  { name: "Bloomberg", logo: "/logos/bloomberg.svg" }
];

export default function SocialProof({ 
  subscriberCount = 250000,
  articleCount = 15000,
  testimonials = defaultTestimonials 
}: SocialProofProps) {
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Readers Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Join hundreds of thousands of readers who rely on our platform for accurate, timely, and insightful news coverage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Subscribers */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FaUsers className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {subscriberCount.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Subscribers</div>
            </div>

            {/* Articles Published */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FaNewspaper className="text-2xl text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {articleCount.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Articles Published</div>
            </div>

            {/* Global Reach */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <FaGlobe className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                120+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Countries Reached</div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Readers Say
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaQuoteLeft className="text-primary text-2xl mr-3" />
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Mentions */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
            Featured In
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {pressLogos.map((press) => (
              <div key={press.name} className="flex items-center justify-center h-12 px-6">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {press.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-3xl text-green-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fact-Checked</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Every story goes through our rigorous fact-checking process
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <FaUsers className="text-3xl text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Team</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Written by experienced journalists and industry experts
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <FaGlobe className="text-3xl text-purple-500 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Global Coverage</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive coverage of local and international news
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
