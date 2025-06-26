import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import AuthStatus from "./AuthStatus";
import { FaNewspaper, FaPenNib, FaFire, FaCrown, FaChartLine } from "react-icons/fa";

const translations: Record<string, Record<string, string>> = {
  en: {
    world: "World",
    politics: "Politics",
    business: "Business",
    health: "Health",
    entertainment: "Entertainment",
    sports: "Sports",
    submit: "Submit News",
    user: "User Panel",
    admin: "Admin Panel",
    signin: "Sign In",
  },
  zh: {
    world: "世界",
    politics: "政治",
    business: "商业",
    health: "健康",
    entertainment: "娱乐",
    sports: "体育",
    submit: "提交新闻",
    user: "用户中心",
    admin: "管理后台",
    signin: "登录",
  },
  es: {
    world: "Mundo",
    politics: "Política",
    business: "Negocios",
    health: "Salud",
    entertainment: "Entretenimiento",
    sports: "Deportes",
    submit: "Enviar Noticia",
    user: "Panel Usuario",
    admin: "Panel Admin",
    signin: "Iniciar Sesión",
  },
};

export default function Header() {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[lang];
  const navItems = [
    { href: "/", label: "Home", key: "home", icon: FaNewspaper },
    { href: "/trending", label: "Trending", key: "trending", icon: FaFire },
    { href: "/most-read", label: "Most Read", key: "most-read", icon: FaChartLine },
    { href: "/editors-choice", label: "Editor's Choice", key: "editors-choice", icon: FaCrown },
    { href: "/category/world", label: t.world, key: "world" },
    { href: "/category/politics", label: t.politics, key: "politics" },
    { href: "/category/business", label: t.business, key: "business" },
    { href: "/category/technology", label: "Technology", key: "technology" },
  ];

  return (
    <header className="w-full bg-white dark:bg-neutral-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight font-sans hover:scale-105 transition-transform"
          >
            Tanznews
          </Link>          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative font-medium transition-all duration-200 hover:text-primary flex items-center gap-2 ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-primary font-bold"
                    : "text-gray-700 dark:text-gray-300"
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 hover:after:w-full ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "after:w-full" : ""
                }`}
              >
                {item.icon && <item.icon className="text-sm" />}
                {item.label}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                More ▾
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {navItems.slice(4).map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex gap-3 items-center">
            <LanguageSwitcher value={lang} onChange={setLang} />
            <ThemeToggle />
            {/* AuthStatus handles all auth UI: Sign In, Sign Up, Profile, etc. */}
            <AuthStatus />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-lg font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
