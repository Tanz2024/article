// src/lib/adminUserApi.ts
export async function fetchAllUsers() {
  const res = await fetch("http://localhost:5000/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function banUser(userId: string) {
  const res = await fetch(`http://localhost:5000/api/users/${userId}/ban`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to ban user");
  return res.json();
}

export async function deleteUser(userId: string) {
  const res = await fetch(`http://localhost:5000/api/users/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
