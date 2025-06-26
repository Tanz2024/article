"use client";
import { useEffect, useState } from "react";
import { fetchAllUsers, banUser, deleteUser } from "../../lib/adminUserApi";

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  async function handleBan(id: string) {
    await banUser(id);
    setUsers(users.map(u => u.id === id ? { ...u, banned: true } : u));
  }
  async function handleDelete(id: string) {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  }

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Manage Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="mb-2 flex items-center gap-4">
            <span>{user.name} ({user.email}) {user.banned && <span className="text-red-500">[Banned]</span>}</span>
            <button onClick={() => handleBan(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Ban</button>
            <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
