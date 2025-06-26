// src/lib/profileApi.ts
import { API_BASE_URL } from "./api";

export async function fetchProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Failed to fetch profile';
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      errorMsg = data.message || JSON.stringify(data);
    } else {
      errorMsg = await res.text();
    }
    throw new Error(errorMsg);
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    throw new Error('Response is not JSON');
  }
}

export async function fetchNotifications() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/users/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    console.error('Failed to fetch notifications');
    return [];
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    console.error('Notifications response is not JSON');
    return [];
  }
}

export async function fetchBadges() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/users/badges`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    console.error('Failed to fetch badges');
    return [];
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    console.error('Badges response is not JSON');
    return [];
  }
}

export async function fetchRecentActivity() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/users/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    console.error('Failed to fetch recent activity');
    return [];
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    console.error('Activity response is not JSON');
    return [];
  }
}

export async function fetchAdvancedAnalytics() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/analytics/user/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Failed to fetch analytics';
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      errorMsg = data.message || JSON.stringify(data);
    } else {
      errorMsg = await res.text();
    }
    console.error('Analytics fetch error:', errorMsg);
    return null;
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    console.error('Analytics response is not JSON');
    return null;
  }
}

export async function updateProfile(profileData: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Failed to update profile';
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      errorMsg = data.message || data.error || JSON.stringify(data);
    } else {
      errorMsg = await res.text();
    }
    throw new Error(errorMsg);
  }
  
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    throw new Error('Response is not JSON');
  }
}

export async function fetchUserAnalytics() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/analytics/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Failed to fetch user analytics';
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      errorMsg = data.message || JSON.stringify(data);
    } else {
      errorMsg = await res.text();
    }
    console.error('User analytics fetch error:', errorMsg);
    return null;
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    console.error('User analytics response is not JSON');
    return null;
  }
}
