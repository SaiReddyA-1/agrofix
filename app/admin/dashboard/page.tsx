"use client";

import React, { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    // Robust cookie parsing
    console.log('[ADMIN DASHBOARD] Full document.cookie:', document.cookie);
    const cookies = document.cookie.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(cookie => cookie.startsWith('session='));
    let session = '';
    if (sessionCookie) {
      session = sessionCookie.split('=')[1];
    }
    console.log('[ADMIN DASHBOARD] session value:', session);
    if (session) {
      try {
        const decoded = atob(session);
        console.log('[ADMIN DASHBOARD] Decoded session:', decoded);
        const [, role] = decoded.split(':');
        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          setSessionError('Session found, but not admin. Decoded: ' + decoded);
        }
      } catch (err) {
        setSessionError('Invalid session cookie format. Error: ' + err);
      }
    } else {
      setSessionError('No session cookie found.');
    }
    setChecked(true);
  }, []);

  if (!checked) {
    return <div className="flex items-center justify-center min-h-screen">Checking admin session...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 font-bold">Access denied: Not an admin or session missing.</div>
        {sessionError && <div className="mt-4 text-red-600">{sessionError}</div>}
        <a href="/admin/login" className="mt-4 underline text-green-700">Go to Admin Login</a>
      </div>
    );
  }
  // Fetch stats (move this to client-side or use SWR/fetch if needed)
  // For now, show a placeholder
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-100 rounded-xl p-6 text-center font-bold text-green-700 shadow">
            <div className="text-2xl">Loading...</div>
            <div className="text-base">Total Orders</div>
          </div>
          <div className="bg-green-100 rounded-xl p-6 text-center font-bold text-green-700 shadow">
            <div className="text-2xl">Loading...</div>
            <div className="text-base">Total Products</div>
          </div>
        </div>
      </div>
    </div>
  );
}
