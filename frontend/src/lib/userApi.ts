// src/lib/userApi.ts
export async function fetchUserArticles() {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/articles/user/my-articles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Unknown error';
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

export async function deleteUserArticle(articleId: string) {
  const res = await fetch(`http://localhost:5000/api/articles/${articleId}`, { method: "DELETE" });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Unknown error';
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

export async function updateUserArticle(articleId: string, data: any) {
  const res = await fetch(`http://localhost:5000/api/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    let errorMsg = 'Unknown error';
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
