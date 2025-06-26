"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get redirect parameters
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const reason = searchParams.get("reason");
  const customMessage = searchParams.get("message");
  const requireRole = searchParams.get("requireRole");

  useEffect(() => {
    // Set appropriate message based on redirect reason
    if (customMessage) {
      setRedirectMessage(customMessage);
    } else if (reason === "auth_required") {
      setRedirectMessage("Please log in to access this page.");
    } else if (reason === "session_expired") {
      setRedirectMessage("Your session has expired. Please log in again.");
    } else if (reason === "permission_denied") {
      if (requireRole) {
        setRedirectMessage(`This page requires ${requireRole} privileges. Please log in with appropriate permissions.`);
      } else {
        setRedirectMessage("You need to log in to access this content.");
      }
    } else if (reason === "role_required") {
      setRedirectMessage(`Special permissions required. Please log in with ${requireRole || 'appropriate'} role.`);
    } else if (redirectTo !== "/dashboard") {
      setRedirectMessage(`You'll be redirected to ${redirectTo} after login.`);
    }
  }, [reason, redirectTo, customMessage, requireRole]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.login({ email, password });
      
      // Store user data and token
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Production-level redirect logic
      const determineRedirectPath = () => {
        // If there's a specific redirect parameter, use it
        if (redirectTo && redirectTo !== "/dashboard") {
          return redirectTo;
        }
        // Role-based default redirects
        switch (response.user.role) {
          case 'admin':
            return "/admin";
          case 'editor':
            return "/editor";
          case 'journalist':
            return "/dashboard?tab=articles";
          case 'user':
            return "/dashboard";
          default:
            return "/dashboard";
        }
      };

      const finalRedirect = determineRedirectPath();
      
      // Show success message before redirect
      setRedirectMessage("Login successful! Redirecting...");
      
      // Redirect to login-success page for production-level UX
      setTimeout(() => {
        router.push(`/login-success?redirect=${encodeURIComponent(finalRedirect)}`);
      }, 1000);

    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed.");
    }
    
    setLoading(false);
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-4xl font-extrabold mb-2">
            Tanznews
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
          
          {/* Redirect Message */}
          {redirectMessage && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl text-sm">
              ℹ️ {redirectMessage}
            </div>
          )}
        </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 dark:border-gray-600 p-4 rounded-xl bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-12"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                📧
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 dark:border-gray-600 p-4 rounded-xl bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-12 pr-12"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white p-4 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Signing In...
              </>
            ) : (
              <>
                🚀 Sign In
              </>
            )}
          </button>
        </form>
        
        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-neutral-900 text-gray-500">Don't have an account?</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <a 
            href="/register" 
            className="text-primary hover:text-accent font-semibold transition-colors text-lg"
          >
            Create a new account →
          </a>
        </div>
      </div>
    </main>
  );
}
