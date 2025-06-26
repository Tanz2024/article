"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { checkAuth, redirectToLogin } from "../lib/auth-redirect";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function RequireAuth({ children, requiredRole, redirectTo }: RequireAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null, hasRole: false });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = async () => {
      const auth = checkAuth(requiredRole);
      setAuthState(auth);
      // Debug log for troubleshooting
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[RequireAuth] token:', localStorage.getItem('token'));
        // eslint-disable-next-line no-console
        console.log('[RequireAuth] user:', localStorage.getItem('user'));
        // eslint-disable-next-line no-console
        console.log('[RequireAuth] auth:', auth);
      }
      if (!auth.isAuthenticated) {
        // Redirect to login with current path
        redirectToLogin({
          reason: 'auth_required',
          returnUrl: redirectTo || pathname,
          requireRole: requiredRole
        });
        return;
      }
      if (requiredRole && !auth.hasRole) {
        // User is authenticated but doesn't have required role
        redirectToLogin({
          reason: 'permission_denied',
          returnUrl: redirectTo || pathname,
          requireRole: requiredRole
        });
        return;
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, [requiredRole, redirectTo, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and has required permissions
  return <>{children}</>;
}
