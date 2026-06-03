/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from './lib/store';
import { Sparkles, Trash, ShieldAlert, LogOut, Compass, Bell, ShoppingCart, User as UserIcon, Lock, Mail, Server } from 'lucide-react';
import LandingMarketplace from './components/LandingMarketplace';
import FarmerDashboard from './components/FarmerDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import Logo from './components/Logo';
import { UserRole } from './types';

export default function App() {
  const {
    currentUser,
    selectedRole,
    sseConnected,
    notifications,
    customerProfile,
    farmerProfile,
    driverProfile,
    initializeApp,
    login,
    register,
    logout,
    selectRole,
    markAllNotificationsRead,
    cart
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regExtra, setRegExtra] = useState('');

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await login(email);
    if (!ok) {
      alert('Email not matching any account. Use presets below for tests!');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    let extra: any = {};
    if (regRole === 'customer') {
      extra = { deliveryAddress: regExtra || 'Jhamsikhel-3, Lalitpur, Nepal' };
    } else if (regRole === 'farmer') {
      extra = { farmName: regExtra || `${regName}'s Organic Farm` };
    } else if (regRole === 'driver') {
      extra = { vehiclePlate: regExtra || 'BA-2-PA-739X' };
    }

    const ok = await register(regName, regEmail, regRole, extra);
    if (ok) {
      alert(`Account registered successfully as a ${regRole}!`);
    } else {
      alert('Registration failed. Check if email is already in use.');
    }
  };

  // Quick preset logger
  const triggerQuickLogin = async (presetEmail: string) => {
    setEmail(presetEmail);
    await login(presetEmail);
  };

  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read);

  // Master dashboard display selector
  const renderDashboard = () => {
    switch (selectedRole) {
      case 'customer':
        return <LandingMarketplace />;
      case 'farmer':
        return <FarmerDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingMarketplace />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F2] text-slate-800 flex flex-col justify-between">
      {/* Glow highlight indicators */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main navigation header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Logo size="md" />

        {/* Demo Synchronisation Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-xl text-slate-700">
            <Server className={`w-3.5 h-3.5 ${sseConnected ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-mono text-[10px] font-semibold tracking-wider">
              {sseConnected ? '● REAL-TIME SYNC ON' : 'CONNECTING...'}
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3 bg-white border border-slate-200 py-1 px-3.5 rounded-xl text-slate-800 shadow-sm">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6.5 h-6.5 rounded-full object-cover border border-slate-100"
              />
              <div className="text-left font-sans">
                <p className="text-[11px] font-bold text-slate-800 max-w-[120px] truncate">{currentUser.name}</p>
                <p className="text-[9px] text-emerald-600 font-bold uppercase font-mono tracking-wider">{currentUser.role}</p>
              </div>
            </div>
          )}

          {/* Notifications Center */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-left space-y-3 font-mono text-xs text-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">System Notifications</span>
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                        setNotifOpen(false);
                      }}
                      className="text-[10px] text-emerald-600 hover:underline"
                    >
                      Clear Reads
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-4">No alerts received yet.</p>
                    ) : (
                      notifications
                        .filter(n => n.userId === currentUser.id)
                        .map(n => (
                          <div key={n.id} className={`p-2.5 rounded-xl border ${n.read ? 'border-transparent bg-slate-50' : 'border-emerald-100 bg-emerald-50'} space-y-1`}>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-emerald-700 uppercase tracking-widest">{n.type}</span>
                              <span className="text-slate-400">{new Date(n.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-sans leading-relaxed">{n.message}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </header>

      {/* Guest Welcome & Sign In panel */}
      {!currentUser ? (
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-center gap-12 pt-10">
          {/* Brief info */}
          <div className="flex-1 text-left space-y-6">
            <Logo size="lg" showTagline={true} className="mb-4" />
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 py-1.5 px-3 rounded-full text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" style={{ animationDuration: '4s' }} />
              D2C AGRITECH MULTIPLAYER DEMO HARVEST
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              A Direct Market, <br />
              Fully <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">Synchronized</span>.
            </h2>
            <p className="text-slate-650 text-sm leading-relaxed max-w-md font-sans">
              Welcome to the demonstration sandbox. Experience a completely functional, locally resilient food supply chain connecting actual farmers, dispatch systems, and customer carts.
            </p>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3.5">
              <h4 className="text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">Select Demo Persona To Log In</h4>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => triggerQuickLogin('customer1@gmail.com')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-2.5 rounded-xl text-left font-sans flex items-center gap-2 group transition-all cursor-pointer"
                >
                  🌾
                  <div>
                    <strong className="block text-slate-900 group-hover:text-emerald-700 text-xs font-semibold">Customer View</strong>
                    <span className="text-[10px] text-slate-400">Utsav Shrestha</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => triggerQuickLogin('farmer1@farmfresh.com')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-2.5 rounded-xl text-left font-sans flex items-center gap-2 group transition-all cursor-pointer"
                >
                  🚜
                  <div>
                    <strong className="block text-slate-900 group-hover:text-emerald-700 text-xs font-semibold">Farmer View</strong>
                    <span className="text-[10px] text-slate-400">Hari Prasad Acharya</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => triggerQuickLogin('driver1@delivery.com')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-2.5 rounded-xl text-left font-sans flex items-center gap-2 group transition-all cursor-pointer"
                >
                  🛵
                  <div>
                    <strong className="block text-slate-900 group-hover:text-emerald-700 text-xs font-semibold">Courier Rider</strong>
                    <span className="text-[10px] text-slate-400">Arjun Thapa</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => triggerQuickLogin('admin@farmfresh.com')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-2.5 rounded-xl text-left font-sans flex items-center gap-2 group transition-all cursor-pointer"
                >
                  👁️
                  <div>
                    <strong className="block text-slate-900 group-hover:text-emerald-700 text-xs font-semibold">Admin Monitor</strong>
                    <span className="text-[10px] text-slate-400">Root Command</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Core Registeration Form block */}
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col text-slate-800">
            <div className="flex border-b border-slate-100 mb-6 text-sm font-semibold font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 pb-3 transition-colors ${activeTab === 'login' ? 'text-emerald-600 border-b-2 border-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 pb-3 transition-colors ${activeTab === 'register' ? 'text-emerald-600 border-b-2 border-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4 text-left font-mono text-xs">
                <div>
                  <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">Your Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="e.g. customer1@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">Your Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider font-sans cursor-pointer shadow-md shadow-emerald-100 transition-colors"
                >
                  Connect Access Node
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-left font-mono text-xs">
                <div>
                  <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Brody"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="brody@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">Access Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-xs focus:outline-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="farmer">Farmer</option>
                      <option value="driver">Courier Driver</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5 uppercase font-bold text-[10px]">
                      {regRole === 'customer' ? 'Shipping Address' : regRole === 'farmer' ? 'Farm Name' : 'Vehicle Plate'}
                    </label>
                    <input
                      type="text"
                      placeholder={regRole === 'customer' ? 'Apt 4B Maplewood' : regRole === 'farmer' ? 'Green Meadows' : 'F2C-739X'}
                      value={regExtra}
                      onChange={(e) => setRegExtra(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider font-sans cursor-pointer shadow-md shadow-emerald-100 transition-colors"
                >
                  Create New Account Node
                </button>
              </form>
            )}
          </div>
        </main>
      ) : (
        /* Authenticated Main Screens */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
          {/* Glowing Demo Workspace Role Switcher bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm text-slate-800">
            <div className="text-left">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 py-0.5 px-2 rounded-md font-bold uppercase tracking-wider">
                Demo Workspace
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wide mt-1.5">Role telemetry Switcher Node</h4>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { r: 'customer', label: '🌾 Customer' },
                { r: 'farmer', label: '🚜 Farmer dashboard' },
                { r: 'driver', label: '🛵 courier cockpit' },
                { r: 'admin', label: '👁️ operations monitor' }
              ].map((b) => (
                <button
                  key={b.r}
                  onClick={() => selectRole(b.r as any)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedRole === b.r
                      ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-100'
                      : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Role Screen Container */}
          <div className="w-full">
            {renderDashboard()}
          </div>
        </main>
      )}

      {/* Footer bar */}
      <footer className="border-t border-slate-200 bg-white p-6 text-center text-xs font-mono text-slate-500 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-8">
        <div>
          <span>© 2026 Agro2mic Inc. • Certified Natural Tones Theme</span>
        </div>
        <div className="flex gap-4">
          <span>COMPILED_TS_ESM_OK</span>
          <span>● PORT: 3000 INGRESS</span>
        </div>
      </footer>
    </div>
  );
}
