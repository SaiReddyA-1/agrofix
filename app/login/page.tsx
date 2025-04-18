// moved from login.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (email === 'meghnakorimi@gmail.com') {
        // Try admin login
        const res = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          document.cookie = `session=${btoa(email + ':admin')}; path=/;`;
          window.location.href = '/admin/dashboard';
        } else {
          setError(data.message || 'Invalid admin credentials');
        }
        setLoading(false);
        return;
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/';
      } else {
        setError(data.message || 'Invalid credentials or not verified');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">User Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-full transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <Link href="/register" className="text-green-700 font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
