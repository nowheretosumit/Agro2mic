/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Flame, Trees, Zap, RefreshCw, Milestone, ShieldCheck, TrendingDown } from 'lucide-react';
import { Product } from '../types';

interface CartItemData {
  product: Product;
  quantity: number;
}

interface CarbonFootprintScorecardProps {
  cartItems: CartItemData[];
}

export default function CarbonFootprintScorecard({ cartItems }: CarbonFootprintScorecardProps) {
  // 1. Calculate estimated weight of items
  // Vegetables ~0.8kg, Fruits ~1.0kg, Dairy ~1.2kg per unit
  const totalWeightKg = cartItems.reduce((sum, item) => {
    let weightPerUnit = 0.8; // default
    const cat = item.product.category.toLowerCase();
    if (cat.includes('dairy') || cat.includes('milk')) {
      weightPerUnit = 1.25; 
    } else if (cat.includes('fruit') || cat.includes('apple')) {
      weightPerUnit = 1.0;
    } else if (item.product.unit === 'crate') {
      weightPerUnit = 5.0;
    }
    return sum + (weightPerUnit * item.quantity);
  }, 0);

  // If cart is empty, render nothing or simple zero state
  if (totalWeightKg === 0) {
    return null;
  }

  // Traditional Supply Chain: ~1,450 km cargo truck driving with warehouse cold storage
  // Factor: ~0.42 kg CO2 per kg of produce
  const traditionalCO2 = Number((totalWeightKg * 0.44).toFixed(2));

  // Agro2mic Direct: ~30km local light electric trike transit
  // Factor: ~0.03 kg CO2 per kg of produce
  const directCO2 = Number((totalWeightKg * 0.03).toFixed(2));

  const co2Saved = Number((traditionalCO2 - directCO2).toFixed(2));
  const percentSaved = Math.round(((traditionalCO2 - directCO2) / traditionalCO2) * 100) || 93;

  // Equivalents
  const carKmEquivalent = Number((co2Saved * 4.1).toFixed(1)); // 1kg CO2 ~ 4.1 km standard car driving
  const phoneCharges = Math.round(co2Saved * 121); // 1kg CO2 ~ 121 smartphone charges
  const treeDays = Number((co2Saved / 0.06).toFixed(1)); // 1 tree absorbs 0.06 kg CO2 per day

  return (
    <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 sm:p-5 border border-emerald-800/80 space-y-4 shadow-xl relative overflow-hidden text-left">
      {/* Visual background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-400/15 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
        <div>
          <h4 className="text-xs font-black tracking-widest font-mono text-emerald-400 uppercase flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            Carbon Footprint Scorecard
          </h4>
          <p className="text-[10px] text-emerald-300 font-sans mt-0.5">Bypassing wholesale networks & distribution warehouses</p>
        </div>
        <div className="bg-emerald-500 text-emerald-950 font-black text-[13px] px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
          <span>-{percentSaved}%</span>
          <span className="text-[9px] font-mono tracking-tighter">CO₂</span>
        </div>
      </div>

      {/* Main Metric comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Saving Score */}
        <div className="bg-emerald-900/50 rounded-xl p-3 border border-emerald-805/30">
          <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">Net Carbon Saved</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white tracking-tight">{co2Saved}</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">kg CO₂</span>
          </div>
          <p className="text-[9px] text-emerald-350 mt-1 flex items-center gap-1">
            <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {treeDays} days tree absorption
          </p>
        </div>

        {/* Cargo weight Sourced */}
        <div className="bg-emerald-900/50 rounded-xl p-3 border border-emerald-805/30">
          <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">Consolidated Weight</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white tracking-tight">{totalWeightKg.toFixed(1)}</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">kg</span>
          </div>
          <p className="text-[9px] text-emerald-350 mt-1 flex items-center gap-1">
            <Milestone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            26 - 35 km Direct Deliveries
          </p>
        </div>
      </div>

      {/* Visual comparison bar Chart */}
      <div className="space-y-2.5 bg-emerald-900/20 p-3.5 rounded-xl border border-emerald-800/40">
        <h5 className="text-[9px] text-emerald-400 font-mono uppercase font-bold tracking-tight">Supply-Grid Emissions Comparison</h5>
        
        {/* Traditional Progress */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-[10px] text-emerald-300/80">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              Traditional Warehouses & Diesel Freight (~1,450 km)
            </span>
            <span className="font-mono text-white font-bold">{traditionalCO2} kg</span>
          </div>
          <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-800/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8 }}
              className="bg-red-500 h-full rounded-full" 
            />
          </div>
        </div>

        {/* Agro2mic Progress */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-[10px] text-emerald-200">
            <span className="flex items-center gap-1 font-bold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
              Agro2mic Direct Electric Sourcing (~30 km)
            </span>
            <span className="font-mono text-emerald-300 font-bold">{directCO2} kg</span>
          </div>
          <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-800/30 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(directCO2 / traditionalCO2) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-emerald-400 h-full rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Direct Environmental equivalents row */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-emerald-300">
        <div className="flex items-center gap-2 bg-emerald-900/30 p-2 rounded-lg border border-emerald-800/30">
          <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Avoided <strong>{carKmEquivalent} km</strong> combustion auto transit</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-900/30 p-2 rounded-lg border border-emerald-800/30">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-spin-slow" />
          <span>Saved <strong>{phoneCharges} charges</strong> smartphone battery storage</span>
        </div>
      </div>

      <div className="text-[9px] text-emerald-400/80 font-mono text-center flex items-center justify-center gap-1 bg-emerald-900/30 py-1.5 rounded-lg">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Zero mid-chain warehouses ensures a carbon footprint decrease of up to 93%!
      </div>
    </div>
  );
}
