import { useState } from "react";
import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope, FaHeart } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubscribing(true);
    
    setTimeout(() => {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-extrabold text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight font-sans mb-4 block">
                Tanznews
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your trusted source for breaking news, in-depth analysis, and compelling stories from around the world. 
              Stay informed with quality journalism that matters.
            </p>
              {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 hover:bg-blue-800 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-300 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest news delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  disabled={isSubscribing}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubscribing || !email.trim()}
                className="w-full bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Subscribing...
                  </>                ) : (
                  <>
                    <FaEnvelope /> Subscribe
                  </>
                )}
              </button>
              {message && (
                <div className="text-green-400 font-semibold text-sm text-center bg-green-400/10 p-2 rounded-lg">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              &copy; {currentYear} Tanznews. All rights reserved.
            </div>            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                Made with <FaHeart className="text-red-500" /> for quality journalism
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
