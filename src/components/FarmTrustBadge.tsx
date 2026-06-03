/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Award, Medal, ShieldAlert, Sparkles, HelpCircle, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type TrustTier = 'platinum' | 'gold' | 'silver' | 'bronze';

interface FarmTrustBadgeProps {
  farmName: string;
  rating: number; // 0 - 5 level
  experienceYears?: number; // fallback or custom calculated
  interactive?: boolean;
}

export interface TrustMetrics {
  tier: TrustTier;
  label: string;
  colorClasses: string;
  badgeClasses: string;
  textClass: string;
  description: string;
  icon: React.ReactNode;
  orderVolume: number;
  ontimeRate: string;
  directDispatches: number;
}

export const getTrustMetricsByRating = (rating: number, farmName: string): TrustMetrics => {
  // Deterministic calculation of details using rating and farmName charcode seeds
  const farmSeed = farmName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const ontimeRate = `${95 + (farmSeed % 5)}%`;
  const orderVolume = 12 + (farmSeed % 88);
  const directDispatches = orderVolume + (farmSeed % 12);

  // Determine Trust Tiers
  if (rating >= 4.9) {
    return {
      tier: 'platinum',
      label: 'Platinum Elite Trust',
      colorClasses: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-200 to-indigo-150 border-slate-350 text-slate-800 shadow-[0_2px_8px_rgba(100,116,139,0.12)]',
      badgeClasses: 'from-slate-100 to-slate-200 border-slate-300 text-slate-800 shadow-slate-200/50',
      textClass: 'text-slate-800',
      description: 'The highest tier of trustworthiness. Exceptionally high direct-order dispatch volumes without cold warehousing storage, maintaining a spotless feedback rating exceeding 4.9.',
      icon: <Award className="w-4 h-4 text-slate-700 animate-pulse" />,
      orderVolume,
      ontimeRate,
      directDispatches
    };
  } else if (rating >= 4.7) {
    return {
      tier: 'gold',
      label: 'Gold Verified Trust',
      colorClasses: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50 via-amber-100 to-yellow-150 border-amber-300 text-amber-900 shadow-[0_2px_8px_rgba(245,158,11,0.12)]',
      badgeClasses: 'from-amber-100 to-amber-200 border-amber-300 text-amber-950 shadow-amber-200/50',
      textClass: 'text-amber-900',
      description: 'Gold certified direct provider. Regularly logs dawn harvests, highly compliant with sensor telemetries, and maintains organic and ecological certification standards.',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      orderVolume,
      ontimeRate,
      directDispatches
    };
  } else if (rating >= 4.4) {
    return {
      tier: 'silver',
      label: 'Silver Direct Trust',
      colorClasses: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-slate-100 border-zinc-250 text-slate-800',
      badgeClasses: 'from-zinc-50 to-zinc-150 border-zinc-300 text-slate-800',
      textClass: 'text-slate-700',
      description: 'Regular certified local grower. Demonstrates consistent compliance with regional temperature-sensitive cold box deliveries.',
      icon: <Medal className="w-4 h-4 text-slate-500" />,
      orderVolume,
      ontimeRate,
      directDispatches
    };
  } else {
    return {
      tier: 'bronze',
      label: 'Bronze Fresh Standard',
      colorClasses: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-orange-100 to-amber-50 border-orange-200 text-orange-950',
      badgeClasses: 'from-orange-50 to-orange-150 border-orange-200 text-orange-900',
      textClass: 'text-orange-900',
      description: 'Registered direct standard grower. Transitioning to full bio-telemetry reports; certified regional marketplace participant.',
      icon: <ShieldCheck className="w-4 h-4 text-orange-700" />,
      orderVolume,
      ontimeRate,
      directDispatches
    };
  }
};

export default function FarmTrustBadge({ farmName, rating, experienceYears = 3, interactive = true }: FarmTrustBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const metrics = getTrustMetricsByRating(rating, farmName);

  return (
    <div className="relative inline-block text-left">
      {/* Visual Badge Tag */}
      <button
        type="button"
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => {
          if (!interactive) return;
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          if (!interactive) return;
          setShowTooltip(false);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-tight uppercase select-none transition-all cursor-pointer ${metrics.colorClasses}`}
      >
        {metrics.icon}
        <span>{metrics.label}</span>
      </button>

      {/* Floating Interactive Detail Popover block */}
      <AnimatePresence>
        {showTooltip && interactive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-0 mb-2 w-72 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700/60 text-left font-sans text-xs space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🛡️</span>
                <div>
                  <h4 className="font-extrabold text-[12px] tracking-tight">{farmName}</h4>
                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Direct Trust Verification</p>
                </div>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono uppercase shrink-0 border border-current ${
                metrics.tier === 'platinum' ? 'text-slate-200 border-slate-600' :
                metrics.tier === 'gold' ? 'text-amber-400 border-amber-800' :
                metrics.tier === 'silver' ? 'text-zinc-300 border-zinc-650' : 'text-orange-400 border-orange-850'
              }`}>
                {metrics.tier}
              </span>
            </div>

            {/* Content summary */}
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {metrics.description}
            </p>

            {/* Stats list */}
            <div className="bg-slate-950/80 rounded-lg p-2.5 space-y-1.5 font-mono text-[9px] border border-slate-800/40">
              <div className="flex justify-between items-center text-slate-400">
                <span>Verified Direct Orders:</span>
                <span className="text-white font-extrabold">{metrics.orderVolume} baskets</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>On-Time Direct Dispatch:</span>
                <span className="text-emerald-400 font-extrabold">{metrics.ontimeRate} ETA match</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold">
                <span>Farmer Marketplace Rating:</span>
                <span className="text-amber-400 font-extrabold">⭐️ {rating.toFixed(1)}/5.0</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Certifications Checked:</span>
                <span className="text-white">Active Eco ID</span>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="text-[9px] text-slate-400 flex items-center gap-1 leading-normal pt-1">
              <span className="text-emerald-400">✓</span>
              <span>100% bypasses intermediate retail warehouses.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
