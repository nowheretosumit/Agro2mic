/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Compass, Battery, Truck, ShieldAlert, Check, Plus, AlertCircle, Award } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function DriverDashboard() {
  const {
    deliveries,
    orders,
    updateDeliveryStatus,
    currentUser,
    driverProfile
  } = useAppStore();

  const [simCharge, setSimCharge] = useState(88); // mock battery %

  // Filter deliveries
  const pendingJobs = deliveries.filter(d => d.status === 'pending');
  const activeJobs = deliveries.filter(d => d.driverId === currentUser?.id && d.status !== 'delivered');
  const completedJobs = deliveries.filter(d => d.driverId === currentUser?.id && d.status === 'delivered');

  const myEarnings = completedJobs.length * 250.00; // Rs. 250 per delivery payout

  return (
    <div className="space-y-8 text-left">
      {/* Flight Deck Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Completed Drops</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{completedJobs.length} trips</h3>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Ride Earnings</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">Rs. {myEarnings.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Battery Charge</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{simCharge}%</h3>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Battery className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">E-Vehicle Plate</p>
            <h3 className="text-sm font-black text-slate-700 mt-2 font-mono">
              {driverProfile?.vehiclePlate || 'BA-2-PA-739X'}
            </h3>
          </div>
          <div className="p-3 bg-slate-100 text-slate-650 rounded-xl">
            <Compass className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Available dispatcher jobs */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2 text-slate-800">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Open Dispatch Queue</h3>
            <p className="text-[10px] text-slate-400 font-mono">Broadcasting live nearby delivery requests</p>
          </div>

          <div className="space-y-4 text-slate-800">
            {pendingJobs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 italic">No pending orders are waiting for pickup.</p>
              </div>
            ) : (
              pendingJobs.map(job => (
                <div key={job.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex justify-between font-bold text-emerald-800 border-b border-slate-200 pb-2">
                    <span>JOB #{job.id.substr(4, 5)}</span>
                    <span className="text-slate-800">Rs. 250.00</span>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div>
                      <span className="text-slate-400">FROM_FARM:</span>
                      <p className="text-slate-700 truncate font-sans text-[11px] font-semibold">{job.originName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">TO_CUSTOMER:</span>
                      <p className="text-slate-700 truncate font-sans text-[11px] font-semibold">{job.destName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => updateDeliveryStatus(job.id, 'accepted')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 rounded-lg text-[11px] tracking-wide cursor-pointer uppercase flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    Accept Delivery Request
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: Active assigned tracks panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="text-slate-800">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">Assigned Delivery Jobs</h3>
            <p className="text-xs text-emerald-700 font-mono">Control navigation coordinates and progress metrics below</p>
          </div>

          <div className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12">
                <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-spin" style={{ animationDuration: '10s' }} />
                <h5 className="font-semibold text-slate-600">Cockpit Empty</h5>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-sans">
                  Accept an open package shipment from the sidebar queue. Once accepted, package loading protocols will display in this cockpit.
                </p>
              </div>
            ) : (
              activeJobs.map(job => (
                <div key={job.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 font-mono text-xs text-slate-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <div className="text-emerald-800 font-bold text-sm">ACTIVE ROUTE: #{job.id}</div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold mt-0.5">EST. TIME LIMIT: {job.eta} minutes</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-850 font-bold uppercase tracking-wider text-[10px]">
                      STATUS: {job.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-sans text-sm">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-450 font-mono block uppercase">Loading Location</span>
                      <strong className="text-slate-850 truncate block mt-1">{job.originName}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-450 font-mono block uppercase">Shipping Destination</span>
                      <strong className="text-slate-850 truncate block mt-1">{job.destName}</strong>
                    </div>
                  </div>

                  {/* Simulations drive progress logs */}
                  {job.status === 'delivering' && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Simulated GPS Telemetry Progress</span>
                        <span className="text-emerald-700">{job.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all duration-1000" style={{ width: `${job.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-emerald-700/80 italic text-center animate-pulse mt-1">
                        * GPS signal transmitting driving coordinates in real-time. Broadcasters active.
                      </p>
                    </div>
                  )}

                  {/* Cockpit Action buttons */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    {job.status === 'accepted' && (
                      <button
                        onClick={() => updateDeliveryStatus(job.id, 'picked_up')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                      >
                        Confirm Farm Box Pick-Up
                      </button>
                    )}

                    {job.status === 'picked_up' && (
                      <div className="w-full bg-emerald-50 p-4 rounded-xl border border-emerald-250 space-y-3">
                        <div className="flex gap-2.5 items-start">
                          <Compass className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '4s' }} />
                          <p className="text-emerald-800 text-[11px] leading-normal text-left font-sans">
                            Ready to initiate e-trike? Click below to launch the moving-marker telemetry simulator on the Customer and Admin dashboards.
                          </p>
                        </div>
                        <button
                          onClick={() => updateDeliveryStatus(job.id, 'delivering')} // Trigger actual driving simulation status
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 rounded-lg text-xs cursor-pointer shadow-md shadow-emerald-100 transition-colors animate-pulse"
                        >
                          Launch Simulated Route Drive
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
