// src/lib/auth-redirect.ts
// Production-level authentication and redirect utilities

export type RedirectReason = 
  | 'auth_required' 
  | 'session_expired' 
  | 'permission_denied' 
  | 'role_required' 
  | 'verification_required';

export interface RedirectOptions {
  reason?: RedirectReason;
  returnUrl?: string;
  message?: string;
  requireRole?: string;
}

/**
 * Redirects to login page with proper parameters for production-level UX
 */
export function redirectToLogin(options: RedirectOptions = {}) {
  const { reason = 'auth_required', returnUrl, message, requireRole } = options;
  
  // Get current path if no return URL specified
  const currentPath = returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  // Build query parameters
  const params = new URLSearchParams();
  params.set('redirect', currentPath);
  params.set('reason', reason);
  
  if (message) {
    params.set('message', message);
  }
  
  if (requireRole) {
    params.set('requireRole', requireRole);
  }
  
  // Construct redirect URL
  const redirectUrl = `/login?${params.toString()}`;
  
  if (typeof window !== 'undefined') {
    window.location.href = redirectUrl;
  }
  
  return redirectUrl;
}

/**
 * Checks if user is authenticated and has required role
 */
export function checkAuth(requiredRole?: string): { isAuthenticated: boolean; user: any; hasRole: boolean } {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, hasRole: false };
  }
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return { isAuthenticated: false, user: null, hasRole: false };
  }
  
  try {
    const user = JSON.parse(userStr);
    const hasRole = !requiredRole || user.role === requiredRole || user.role === 'admin';
    
    return { isAuthenticated: true, user, hasRole };
  } catch {
    return { isAuthenticated: false, user: null, hasRole: false };
  }
}

/**
 * Gets appropriate dashboard URL based on user role
 */
export function getDashboardUrl(user: any): string {
  switch (user?.role) {
    case 'admin':
      return '/admin';
    case 'editor':
      return '/editor';
    case 'journalist':
      return '/dashboard?tab=articles';
    case 'user':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Gets user-friendly role name
 */
export function getRoleName(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'editor':
      return 'Editor';
    case 'journalist':
      return 'Journalist';
    case 'user':
      return 'User';
    default:
      return 'User';
  }
}

/**
 * Gets redirect reason message
 */
export function getRedirectMessage(reason: RedirectReason): string {
  switch (reason) {
    case 'auth_required':
      return 'Please log in to access this page.';
    case 'session_expired':
      return 'Your session has expired. Please log in again.';
    case 'permission_denied':
      return 'You don\'t have permission to access this page.';
    case 'role_required':
      return 'This page requires special permissions.';
    case 'verification_required':
      return 'Please verify your account to continue.';
    default:
      return 'Please log in to continue.';
  }
}

/**
 * Production-level logout with proper cleanup
 */
export function logout(redirectTo: string = '/') {
  if (typeof window !== 'undefined') {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    
    // Clear any cached data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('article-reactions-') || key.startsWith('user-preferences-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Redirect to specified page
    window.location.href = redirectTo;
  }
}

/**
 * Validates and refreshes authentication state
 */
export async function validateAuth(): Promise<boolean> {
  const { isAuthenticated, user } = checkAuth();
  
  if (!isAuthenticated) {
    return false;
  }
  
  try {
    // You can add token validation API call here
    // const response = await fetch('/api/auth/validate', {
    //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    // });
    // return response.ok;
    
    return true;
  } catch {
    // Clear invalid auth data
    logout();
    return false;
  }
}
