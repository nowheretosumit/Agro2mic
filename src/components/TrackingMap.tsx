/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Compass, Navigation, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Delivery } from '../types';

interface TrackingMapProps {
  delivery: Delivery | null;
}

export default function TrackingMap({ delivery }: TrackingMapProps) {
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    heading: 45,
    altitude: 125,
    signalStrength: 'Excellent'
  });

  useEffect(() => {
    if (!delivery || delivery.status !== 'delivering') {
      setTelemetry(t => ({ ...t, speed: 0 }));
      return;
    }

    // Update coordinates stats
    const timer = setInterval(() => {
      setTelemetry({
        speed: 25 + Math.floor(Math.random() * 8), // 25-33 km/h
        heading: (120 + Math.floor(Math.random() * 15)) % 360,
        altitude: 45 + Math.floor(Math.random() * 4),
        signalStrength: Math.random() > 0.05 ? 'Stable (5G)' : 'Calibrating...'
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [delivery]);

  // Fallback defaults if no active delivery
  const isTracking = !!delivery;
  const progress = delivery ? delivery.progress : 0;
  const status = delivery ? delivery.status : 'pending';

  // SVG dimensions
  const width = 500;
  const height = 300;

  // Farm (Origin) coordinate
  const originX = 100;
  const originY = 220;

  // Customer (Destination) coordinate
  const destX = 400;
  const destY = 80;

  // Current moving marker coordinate depending on progress
  const currentX = originX + (destX - originX) * (progress / 100);
  const currentY = originY + (destY - originY) * (progress / 100);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden text-left">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="font-semibold text-lg text-emerald-800 font-sans tracking-tight">Tactical HUD Courier Tracker</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">ID: {delivery?.id || 'NO_ACTIVE_STREAM'}</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>ETA: {delivery ? `${delivery.eta} min` : 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Visual Map Canvas Block */}
        <div className="md:col-span-3 bg-slate-100 aspect-video md:h-[300px] w-full rounded-xl border border-slate-200 relative overflow-hidden flex flex-col justify-between">
          {/* Animated radar sonar lines representing search coordinates */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* HUD Target Lock Details */}
          <div className="absolute top-3 left-3 pointer-events-none z-10 text-[10px] font-mono text-emerald-850 space-y-0.5 font-bold">
            <div>TARGET_LOCK: ACTIVE</div>
            <div>SYS_ROUTE: #{delivery?.orderId || 'PENDING'}</div>
            <div>COURIER: {delivery?.driverName || 'UNASSIGNED'}</div>
          </div>

          <div className="absolute bottom-3 right-3 pointer-events-none z-10 text-[10px] font-mono text-emerald-850 text-right font-bold">
            <div>LAT: {currentX.toFixed(2)}N</div>
            <div>LNG: {currentY.toFixed(2)}W</div>
            <div>COMPASS: {telemetry.heading}°</div>
          </div>

          {/* SVG Vector Tracking Canvas */}
          <svg className="w-full h-full relative z-0" viewBox={`0 0 ${width} ${height}`}>
            {/* Delivery Route Guide Path */}
            <line
              x1={originX}
              y1={originY}
              x2={destX}
              y2={destY}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Completed Path Indicator */}
            {isTracking && (
              <line
                x1={originX}
                y1={originY}
                x2={currentX}
                y2={currentY}
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            )}

            {/* Farm Origin Marker */}
            <g transform={`translate(${originX}, ${originY})`}>
              <circle r="22" fill="rgba(22,163,74,0.1)" stroke="rgba(22,163,74,0.2)" strokeWidth="1" />
              <circle r="12" fill="rgba(22,163,74,0.15)" stroke="rgba(22,163,74,0.3)" strokeWidth="1.5" />
              <circle r="4" fill="#16a34a" />
              <foreignObject x="-15" y="-35" width="30" height="30">
                <div className="flex items-center justify-center text-emerald-700">
                  <MapPin className="w-4 h-4" />
                </div>
              </foreignObject>
              <text x="0" y="22" textAnchor="middle" fill="#15803d" fontSize="9" fontFamily="monospace" fontWeight="bold">FARM</text>
            </g>

            {/* Customer Destination Marker */}
            <g transform={`translate(${destX}, ${destY})`}>
              <circle r="22" fill="rgba(2,132,199,0.1)" stroke="rgba(2,132,199,0.2)" strokeWidth="1" />
              <circle r="12" fill="rgba(2,132,199,0.15)" stroke="rgba(2,132,199,0.3)" strokeWidth="1.5" />
              <circle r="4" fill="#0284c7" />
              <foreignObject x="-15" y="-35" width="30" height="30">
                <div className="flex items-center justify-center text-sky-700">
                  <Navigation className="w-4 h-4 rotate-45" />
                </div>
              </foreignObject>
              <text x="0" y="22" textAnchor="middle" fill="#0369a1" fontSize="9" fontFamily="monospace" fontWeight="bold">CUSTOMER</text>
            </g>

            {/* Moving Courier Marker */}
            {isTracking && (
              <g transform={`translate(${currentX}, ${currentY})`}>
                <circle r="24" className="marker-ripple" fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="0.5" />
                <circle r="12" fill="#16a34a" className="shadow-md shadow-emerald-700/30" />
                <foreignObject x="-8" y="-8" width="16" height="16">
                  <div className="flex items-center justify-center text-white">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </foreignObject>
              </g>
            )}

            {/* Instructions message if idle */}
            {!isTracking && (
              <text x={width / 2} y={height / 2} textAnchor="middle" fill="rgba(0,0,0,0.35)" fontSize="13" fontFamily="monospace" fontWeight="bold">
                [WAITING FOR ACTIVE DELIVERY GPS COORDS]
              </text>
            )}
          </svg>

          {/* Progress bar overlay along bottom */}
          <div className="w-full bg-slate-200 h-1.5 relative overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Realtime Telemetry parameters HUD */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-4 font-mono">
            <div className="text-[10px] text-slate-400 tracking-wider font-extrabold text-left">TELEMETRY_LOGS</div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold">VELOCITY_SPD</span>
              <span className="text-emerald-700 text-sm font-bold">{telemetry.speed} km/h</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold">COMPASS_HDG</span>
              <span className="text-amber-700 text-sm font-bold">{telemetry.heading}° NE</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold">SIGNAL_CON</span>
              <span className="text-sky-700 text-xs font-bold">{telemetry.signalStrength}</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold">ROUTE_COMP</span>
              <span className="text-slate-800 text-sm font-bold">{progress}%</span>
            </div>
          </div>

          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50 flex items-center gap-3">
            {progress >= 100 ? (
              <CheckCircle className="text-emerald-600 w-8 h-8 shrink-0 animate-bounce" />
            ) : status === 'delivering' ? (
              <Truck className="text-emerald-600 w-8 h-8 capitalize shrink-0 animate-bounce" />
            ) : (
              <Compass className="text-slate-400 w-8 h-8 capitalize shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono text-left">Live Logs</div>
              <p className="text-[11px] text-emerald-950 leading-tight text-left font-sans font-medium">
                {progress >= 100
                  ? 'Delivery marked completed. Client wallet settlement finalized.'
                  : status === 'delivering'
                  ? 'Courier package in transit. GPS telemetry online.'
                  : status === 'picked_up'
                  ? 'Rider picked up harvest boxes. Securing cooler mounts.'
                  : 'Awaiting packaging checkout and courier acceptance.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
