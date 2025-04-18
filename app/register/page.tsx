// moved from register.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setStep('verify');
        setSuccess(`OTP sent to your email. (For demo: ${data.otp})`);
      } else {
        if (email === 'meghnakorimi@gmail.com') {
          setError('This email is reserved for admin and cannot be registered as a user.');
        } else {
          setError(data.message || 'Registration failed');
          setLoading(false);
        }
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Email verified! You can now log in.');
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">Register</h1>
        {step === 'register' ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-full transition"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
            />
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-full transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        <div className="text-center mt-4 text-sm">
          <Link href="/login" className="text-green-700 font-semibold hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
