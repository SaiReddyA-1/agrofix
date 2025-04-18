"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='))?.split('=')[1];
    if (session) {
      try {
        const [email, role] = atob(session).split(':');
        setUser({ email, role });
      } catch {}
    }
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) setSuccess('Password updated!');
      else setError(data.message || 'Failed to update password');
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">Profile</h1>
        <div className="mb-4 text-center">
          <div className="text-lg font-semibold">Email:</div>
          <div className="text-gray-700">{user.email}</div>
        </div>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <input
            type="password"
            required
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-full transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
