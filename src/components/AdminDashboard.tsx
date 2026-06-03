/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Compass, Users, Package, ShoppingBag, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function AdminDashboard() {
  const {
    products,
    orders,
    deliveries,
    notifications,
    currentUser
  } = useAppStore();

  const [loadingReset, setLoadingReset] = useState(false);

  // Stats calculate
  const totalVolume = orders.reduce((sum, o) => o.status === 'delivered' ? sum + o.totalPrice : sum, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveryCount = deliveries.filter(d => d.status === 'delivering').length;

  const handleResetDB = async () => {
    if (!confirm('Are you sure you want to reset all records back to default settings? This will clear all orders and active delivery dispatches.')) {
      return;
    }

    setLoadingReset(true);
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        alert('Database seed nodes restored. Reloading workspace settings...');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Fail to clear DB.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* HUD System Parameters Overview */}
      <div className="bg-gradient-to-br from-emerald-50 to-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl">
            <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Central Operations Command Center</h3>
            <p className="text-xs text-emerald-800 font-mono mt-1 font-semibold uppercase">
              SYS_NODE_OPERATIONAL • Broadcaster Stream: <span className="font-bold underline">ACTIVE</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          <button
            onClick={handleResetDB}
            disabled={loadingReset}
            className="bg-red-50 hover:bg-red-105 text-red-700 border border-red-200 hover:border-red-300 font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Database className="w-4 h-4 shrink-0 text-red-650" />
            {loadingReset ? 'Restoring Node...' : 'Reset Seed Database Nodes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Gross Farm Revenue</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">Rs. {totalVolume.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Active Deliveries</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{deliveryCount} riders</h3>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Inbox Live Orders</p>
            <h3 className="text-2xl font-black text-sky-700 mt-1">{pendingCount} boxes</h3>
          </div>
          <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Listed Crops</p>
            <h3 className="text-2xl font-black text-slate-700 mt-1">{products.length} items</h3>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Orders Monitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">Active Diner Incoming Orders</h3>
          <div className="space-y-3 font-mono text-xs">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No order records in DB node.</p>
            ) : (
              orders.slice().reverse().map(ord => (
                <div key={ord.id} className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="text-emerald-800 font-bold">ORDER_ID: {ord.id}</div>
                    <div className="text-slate-800 font-sans font-semibold mt-1">Diner: {ord.customerName}</div>
                    <div className="text-slate-500 font-sans text-xs mt-0.5">Farm: {ord.farmName}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' :
                      ord.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-250' :
                      'bg-indigo-100 text-indigo-800 border border-indigo-250'
                    }`}>
                      {ord.status}
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1.5 font-sans">Rs. {ord.totalPrice.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Logistics Monitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">System Logistics Dispatch Log</h3>
          <div className="space-y-3 font-mono text-xs text-slate-800">
            {deliveries.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No active logistics dispatches recorded.</p>
            ) : (
              deliveries.slice().reverse().map(del => (
                <div key={del.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-emerald-800 font-bold block">DISPATCH: {del.id}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Carrier: {del.driverName || 'UNASSIGNED'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-850 border border-sky-200">
                      {del.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-left text-slate-700 font-sans text-xs">
                    <div><span className="font-mono text-slate-400 font-semibold mr-1">FROM:</span> {del.originName}</div>
                    <div><span className="font-mono text-slate-400 font-semibold mr-1">TO:</span> {del.destName}</div>
                  </div>

                  {del.status === 'delivering' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Route Completion Progress</span>
                        <span>{del.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all duration-1000" style={{ width: `${del.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
