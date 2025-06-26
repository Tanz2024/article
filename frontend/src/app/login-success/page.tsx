"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAuth, getDashboardUrl, getRoleName } from "../../lib/auth-redirect";
import Link from "next/link";
import { FaCheckCircle, FaUser, FaHome, FaArrowRight, FaShieldAlt, FaRegClock } from "react-icons/fa";

export default function LoginSuccessPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || null;

  useEffect(() => {
    const { isAuthenticated, user: authUser } = checkAuth();
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setUser(authUser);
    setIsLoading(false);

    // Countdown timer
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    interval = setInterval(() => setCountdown((c) => c > 0 ? c - 1 : 0), 1000);
    timer = setTimeout(() => {
      const finalRedirect = redirectTo || getDashboardUrl(authUser);
      router.push(finalRedirect);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  const dashboardUrl = getDashboardUrl(user);
  const roleName = getRoleName(user.role);
  const avatar = user.avatarUrl || undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 md:px-6">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center relative overflow-hidden">
        {/* Animated Checkmark */}
        <div className="mx-auto mb-6 flex items-center justify-center relative">
          <span className="absolute inset-0 flex items-center justify-center animate-ping z-0">
            <FaCheckCircle className="text-green-400 text-6xl opacity-30" />
          </span>
          <span className="relative z-10">
            <FaCheckCircle className="text-green-500 text-6xl drop-shadow-lg" />
          </span>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 font-serif tracking-tight">
          Welcome Back!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-light">
          You are now signed in as <span className="font-semibold text-primary">{user.username || user.email}</span>
        </p>

        {/* User Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-primary shadow" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white font-bold text-xl">
                {(user.username || user.email)?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-base font-medium text-gray-900 dark:text-white">{user.username || user.email}</span>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
              {roleName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FaRegClock className="text-primary" />
            <span>Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {redirectTo ? `Destination: ${redirectTo}` : "To your dashboard"}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-1000"
              style={{ width: `${(3 - countdown) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 mb-4">
          <button
            onClick={() => router.push(redirectTo || dashboardUrl)}
            className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
          >
            <span>Continue as {user.username || user.email}</span>
            <FaArrowRight className="text-sm" />
          </button>
          
          <Link
            href="/"
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <FaHome className="text-sm" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Trust/Brand Section */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-3 justify-center">
          <FaShieldAlt className="text-blue-500 text-lg" />
          <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
            Your session is secure and encrypted. Tanznews upholds the highest standards of privacy and trust.
          </span>
        </div>
        
        <div className="mt-4 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Tanznews &mdash; Ethical Journalism. Trusted News.
        </div>
      </div>
    </div>
  );
}
