'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const session = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))?.split('=')[1];

      if (session) {
        try {
          const [email, role] = atob(session).split(':');
          setUser({ email, role });
        } catch {
          console.error('Invalid session cookie');
        }
      }
    }
  }, []);

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.location.href = user?.role === 'admin' ? '/' : '/login';
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left - Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-green-700">
            Agrofix
          </Link>

          {!isAdminRoute || !isAdmin ? (
            <>
              <Link href="/" className="text-gray-600 hover:text-green-700 transition-colors">Products</Link>
              <Link href="/orders/place" className="text-gray-600 hover:text-green-700 transition-colors">Place Order</Link>
              <Link href="/orders/history" className="text-gray-600 hover:text-green-700 transition-colors font-bold">My Orders</Link>
              <Link href="/track" className="px-4 py-2 border-2 border-green-600 rounded-lg text-green-700 font-semibold hover:bg-green-50 hover:border-green-700 transition">Track Order</Link>
            </>
          ) : (
            <>
              <Link href="/admin/dashboard" className="text-green-700 font-semibold hover:underline">Dashboard</Link>
              <Link href="/admin/products" className="text-green-700 font-semibold hover:underline">Products</Link>
              <Link href="/admin/orders" className="text-green-700 font-semibold hover:underline">Orders</Link>
            </>
          )}
        </div>

        {/* Right - Profile */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-transform hover:scale-105" tabIndex={0}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
              </svg>
            </button>

            <div className="hidden group-focus-within:block group-hover:block absolute right-0 mt-3 w-72 bg-gradient-to-br from-green-50 via-white to-green-100 rounded-3xl shadow-2xl border border-green-300 z-50 p-7 animate-fade-in">
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-green-200">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg mb-2 border-4 border-white">{user?.email ? user.email[0].toUpperCase() : '?'}</div>
                <div className="text-green-900 font-extrabold text-lg">{user?.email || ' '}</div>
                <div className="text-green-700 font-semibold text-sm">Role: <span className="font-bold text-green-800">{user?.role || ''}</span></div>
              </div>
              <ul className="py-4">
                <li className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 cursor-pointer transition-all">
                  <span className="inline-block w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" /></svg>
                  </span>
                  <span className="font-semibold text-green-800">Profile</span>
                </li>
                <li className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 cursor-pointer transition-all">
                  <span className="inline-block w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M4.75 6.75A2.25 2.25 0 017 4.5h10a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0117 19.5H7a2.25 2.25 0 01-2.25-2.25V6.75z" /></svg>
                  </span>
                  <span className="font-semibold text-green-800">Account Settings</span>
                </li>
                <li className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 cursor-pointer transition-all">
                  <span className="inline-block w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5m-7.5 4.5h7.5m-7.5 4.5h7.5" /></svg>
                  </span>
                  <span className="font-semibold text-green-800">My Content</span>
                </li>
              </ul>
              <hr className="my-3 border-green-200" />
              <button onClick={handleLogout} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-2xl font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-150 mt-2">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
