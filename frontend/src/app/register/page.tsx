"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bday, setBday] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await authAPI.register({ 
        email, 
        username, 
        firstName,
        middleName,
        lastName,
        phoneNumber,
        password, 
        bday 
      });
      
      // Store the user data immediately if registration includes auto-login
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?message=Registration successful! Please sign in to continue.");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10 md:px-12">
      <div className="w-full max-w-md bg-white text-black dark:bg-neutral-900 dark:text-white p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-white/10 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tight">Create Your Account</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Sign up to join Tanznews and start sharing, commenting, and saving your favorite articles. Your information is safe and never shared.</p>        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold mb-1">First Name *</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold mb-1">Last Name *</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="middleName" className="block text-sm font-semibold mb-1">Middle Name (Optional)</label>
            <input
              id="middleName"
              type="text"
              placeholder="Optional middle name"
              className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              autoComplete="additional-name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Email *</label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-1">Phone Number *</label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-1">Username *</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a unique username"
              className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="bday" className="block text-sm font-semibold mb-1">Birthday *</label>
            <input
              id="bday"
              type="date"
              className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              value={bday}
              onChange={e => setBday(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition pr-12"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.062 2.062A7.963 7.963 0 0112 5c2.21 0 4.21.896 5.675 2.338m2.062 2.062A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10-.657 0-1.299-.064-1.925-.188m-2.062-2.062A7.963 7.963 0 015 12c0-2.21.896-4.21 2.338-5.675" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c2.21 0 4.21.896 5.675 2.338m2.062 2.062A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10-2.21 0-4.21-.896-5.675-2.338m-2.062-2.062A9.956 9.956 0 012 15c0-1.657.336-3.234.938-4.675" /></svg>
                )}
              </button>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters.</span>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="w-full border p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition pr-12"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.062 2.062A7.963 7.963 0 0112 5c2.21 0 4.21.896 5.675 2.338m2.062 2.062A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10-.657 0-1.299-.064-1.925-.188m-2.062-2.062A7.963 7.963 0 015 12c0-2.21.896-4.21 2.338-5.675" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c2.21 0 4.21-.896 5.675-2.338m2.062 2.062A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10-2.21 0-4.21-.896-5.675-2.338m-2.062-2.062A9.956 9.956 0 012 15c0-1.657.336-3.234.938-4.675" /></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
          {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
        </form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Already have an account? <a href="/login" className="text-primary underline font-semibold">Sign in</a>
        </div>
        <div className="text-xs text-gray-400 text-center mt-4">
          By signing up, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
        </div>
      </div>
    </main>
  );
}
