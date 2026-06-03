/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, TrendingUp, Calendar, MapPin, CheckCircle, 
  AlertCircle, ChevronRight, HelpCircle, FileText, BarChart3, 
  RotateCcw, Info, Globe, Building2, UserCheck
} from 'lucide-react';

interface ForecastItem {
  id: string;
  crop: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy';
  peakFestival: string;
  predictedDemandPeak: string; // e.g. "October 2026"
  sowingDeadline: string; // e.g. "June 15, 2026"
  currentMarketDeficit: string;
  predictedPricePremium: string; // "+45% premium"
  targetLocations: string[];
  activeRetailContracts: number;
  description: string;
  historicalQuantityMT: number;
}

const PRESET_FORECASTS: ForecastItem[] = [
  {
    id: 'fc_1',
    crop: 'Potatoes (Red Hill Variety)',
    category: 'Vegetables',
    peakFestival: 'Dashain Festival Feast Cycle',
    predictedDemandPeak: 'Sept - Oct 2026',
    sowingDeadline: 'June 18, 2026',
    currentMarketDeficit: 'Critical Deficit Expected',
    predictedPricePremium: '+42% premium over baseline',
    targetLocations: ['Lalitpur Markets', 'Tahachal Bulk Emporium', 'Gyaneshwor Retailers'],
    activeRetailContracts: 14,
    description: 'During Dashain, retailer demand for storable red mountain potatoes spikes by 350%. Growing under pre-harvest agreement saves transportation warehousing wastage.',
    historicalQuantityMT: 24.5
  },
  {
    id: 'fc_2',
    crop: 'Pure Premium Ghee / Khoya Solids',
    category: 'Dairy',
    peakFestival: 'Tihar & Chhath Confectionery Peak',
    predictedDemandPeak: 'Oct - Nov 2026',
    sowingDeadline: 'August 10, 2026 (Pasture Allocation)',
    currentMarketDeficit: 'Moderate Deficit',
    predictedPricePremium: '+55% premium over baseline',
    targetLocations: ['Patan Durbar Sweethouses', 'Kathmandu Ward-3 Bakers'],
    activeRetailContracts: 8,
    description: 'Confectioners place bulk purchase orders for high somatic, pure cream fat ghee for traditional Tihar Sel-Roti frying and dairy sweets.',
    historicalQuantityMT: 12.8
  },
  {
    id: 'fc_3',
    crop: 'Heirloom Crisp Iceberg Lettuce',
    category: 'Vegetables',
    peakFestival: 'Winter Resto-Tourism High Season',
    predictedDemandPeak: 'Dec - Feb 2026/27',
    sowingDeadline: 'October 1, 2026',
    currentMarketDeficit: 'Slight Deficit',
    predictedPricePremium: '+28% premium over baseline',
    targetLocations: ['Jhamsikhel Organic Cafes', 'Boudha Tourist Bistros'],
    activeRetailContracts: 22,
    description: 'Kathmandu urban health cafes run out of direct pesticide-free leafy crisp salads as winter tourism spikes. Commit early for continuous winter harvest intervals.',
    historicalQuantityMT: 8.2
  },
  {
    id: 'fc_4',
    crop: 'Mustang Royal Golden Apples',
    category: 'Fruits',
    peakFestival: 'Late Autumn Gift Giving & Rituals',
    predictedDemandPeak: 'Oct - Dec 2026',
    sowingDeadline: 'Immediate canopy thinning (Irrigation setup)',
    currentMarketDeficit: 'Severe High-Quality Deficit',
    predictedPricePremium: '+35% premium over baseline',
    targetLocations: ['Kupondole Superstores', 'Lalitpur Gourmet Hubs'],
    activeRetailContracts: 11,
    description: 'Bulk ritual offerings require premium, blemish-free alpine crisp apples. Direct flight containers avoid middleman shelf bruising.',
    historicalQuantityMT: 18.0
  }
];

export default function DemandForecasting() {
  const [selectedForecast, setSelectedForecast] = useState<ForecastItem>(PRESET_FORECASTS[0]);
  const [committedContracts, setCommittedContracts] = useState<string[]>([]);
  const [activeTab, setActiveTab ] = useState<'list' | 'analytics'>('list');
  const [showCommitToast, setShowCommitToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCommit = (id: string, cropName: string) => {
    if (committedContracts.includes(id)) return;
    setCommittedContracts([...committedContracts, id]);
    setToastMessage(`Excellent commitment! Your secure 'Contract-to-Sow' slot for ${cropName} is registered. Regional buyers have been notified to deposit lock-in reserves.`);
    setShowCommitToast(true);
    setTimeout(() => setShowCommitToast(false), 5000);
  };

  // Simulated chart data points for visual custom SVG chart
  const predictedSupplyCurve = [15, 12, 19, 45, 82, 95, 30, 24, 21, 16];
  const predictedDemandCurve = [18, 22, 38, 70, 98, 92, 48, 30, 22, 18];
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 text-left relative">
      
      {/* Dynamic Popover Toast */}
      <AnimatePresence>
        {showCommitToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-emerald-500/35 text-emerald-100 p-4 rounded-2xl shadow-2xl flex gap-3 items-start font-sans text-xs"
          >
            <div className="bg-emerald-500 text-slate-900 p-1 rounded-full shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-white text-[12px] tracking-tight">Contract Secured Successfully</p>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with brand highlight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Empowered Sowing Decisions
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Smart Demand Forecasting Engine
          </h3>
          <p className="text-xs text-slate-500 font-sans max-w-xl">
            Let the market shape your harvest. Bypassing guesswork: our neural sensor pipelines analyze urban restaurant bookings, hospitality cycles, and holiday trends to lock in reliable orders months before you plant.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-center shrink-0 border border-slate-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all uppercase cursor-pointer ${
              activeTab === 'list' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Sowing Pools
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all uppercase cursor-pointer ${
              activeTab === 'analytics' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Demand Curves
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sowing Pools list (Col span 5) */}
          <div className="lg:col-span-5 space-y-3 max-h-[480px] overflow-y-auto pr-1">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 font-mono tracking-wider">
              Pending Festive Sowing Demands
            </h4>

            <div className="space-y-2.5">
              {PRESET_FORECASTS.map((fc) => {
                const isSelected = selectedForecast.id === fc.id;
                const isCommitted = committedContracts.includes(fc.id);

                return (
                  <div
                    key={fc.id}
                    onClick={() => setSelectedForecast(fc)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.06)]' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {isCommitted && (
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Lock
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-450 font-mono uppercase font-bold tracking-tight">
                        {fc.category} • {fc.peakFestival.substring(0, 16)}...
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold font-mono">
                        {fc.predictedPricePremium.split(' ')[0]}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-[13px] tracking-tight mt-1 leading-none">
                      {fc.crop}
                    </h5>

                    <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Sowing Deadline: <strong className="text-slate-800">{fc.sowingDeadline.split(' ')[0]} {fc.sowingDeadline.split(' ')[1] || ''}</strong>
                    </p>

                    <div className="flex items-center justify-between gap-1 mt-2 border-t border-slate-200/50 pt-2 text-[10px]">
                      <span className="text-slate-400 truncate max-w-[150px]">📍 {fc.targetLocations[0]}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100/50 px-1.5 py-0.5 rounded text-[9px] font-mono">
                        {fc.activeRetailContracts} contracts pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sowing Detail & Contract Lock (Col span 7) */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              {/* Product Sowing Title Block */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-205 border border-slate-300 rounded px-1.5 py-0.5 font-bold font-mono tracking-wider text-slate-700 uppercase">
                      {selectedForecast.category} SOWING POOL
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 border border-red-100">
                      <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                      {selectedForecast.currentMarketDeficit}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {selectedForecast.crop}
                  </h4>
                </div>
                
                <div className="bg-emerald-600 text-white font-mono rounded-xl p-2 px-3 text-right shrink-0">
                  <p className="text-[8px] font-bold tracking-wider opacity-90 uppercase">ESTIMATED PREMIUM</p>
                  <p className="text-sm font-black tracking-tight leading-none mt-0.5">
                    {selectedForecast.predictedPricePremium.split(' ')[0]}
                  </p>
                </div>
              </div>

              {/* Forecast Card Breakdown info */}
              <p className="text-xs text-slate-650 leading-relaxed font-sans">
                {selectedForecast.description}
              </p>

              {/* Specific detail targets list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white border border-slate-150 p-4 rounded-2xl shadow-sm rounded-xl">
                <div>
                  <h5 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wide">
                    🌾 Crucial Sowing Windows
                  </h5>
                  <p className="text-xs font-bold text-slate-800 mt-1 leading-normal">
                    Must sow before <span className="text-red-600 underline font-mono">{selectedForecast.sowingDeadline}</span>
                  </p>
                  <p className="text-[10px] text-slate-450 mt-0.5">To align with premium harvest timings</p>
                </div>
                
                <div>
                  <h5 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wide">
                    🎁 Festive Cycle Target
                  </h5>
                  <p className="text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-205 w-max mt-1 leading-none">
                    {selectedForecast.peakFestival}
                  </p>
                  <p className="text-[10px] text-slate-450 mt-1">High volume bulk consumption peak</p>
                </div>

                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                  <h5 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wide mb-1.5">
                    🏢 Registered Regional Buyers Demanding Sowing Contracts
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedForecast.targetLocations.map((loc, lIdx) => (
                      <span key={lIdx} className="bg-slate-100 text-slate-700 font-mono text-[9px] px-2 py-1 rounded-lg border border-slate-150 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        {loc}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5 font-sans leading-none">
                    *These registered buyers offer binding "Contract-to-Sow" minimum pricing, ensuring 100% price guarantee!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-2 border-t border-slate-150 flex items-center gap-3">
              {committedContracts.includes(selectedForecast.id) ? (
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
                  Sowing Commitment Confirmed - Production contract files generated
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleCommit(selectedForecast.id, selectedForecast.crop)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-50 select-none"
                  >
                    <UserCheck className="w-4 h-4" />
                    Accept "Contract-to-Sow" Slot
                  </button>
                  <button
                    onClick={() => {
                      alert(`Detailed technical sowing manual, moisture patterns & soil pre-allocation checklist for "${selectedForecast.crop}" sent to your registered profile email.`);
                    }}
                    className="p-3 bg-white border border-slate-205 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer"
                    title="Get Crop Tech Sheet"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-6">
          {/* Smart demand line chart preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rose-950/10 pb-4">
              <div>
                <h4 className="text-xs font-black tracking-widest font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Predictive Demand vs Sowing Curve
                </h4>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Macro metropolitan market analysis inside Lalitpur & Kathmandu (in Metric Tons)</p>
              </div>
              
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  Predicted Buyer Demand
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                  Normal Uncontracted Supply
                </span>
              </div>
            </div>

            {/* Custom SVG Responsive Line Chart Code */}
            <div className="w-full h-56 relative pt-4">
              {/* SVG Canvas overlay */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 3 text" />
                <line x1="0" y1="190" x2="700" y2="190" stroke="#475569" strokeWidth="1" />

                {/* Demand Line Plot */}
                <path
                  d={`M ${predictedDemandCurve.map((val, idx) => `${(idx / 9) * 700} ${190 - (val / 100) * 160}`).join(' L ')}`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Sowing Line Plot */}
                <path
                  d={`M ${predictedSupplyCurve.map((val, idx) => `${(idx / 9) * 700} ${190 - (val / 100) * 160}`).join(' L ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Adding decorative nodes on peaks to denote critical shortage gaps */}
                {/* April Peak: Idx 4 */}
                <circle cx={`${(4 / 9) * 700}`} cy={`${190 - (predictedDemandCurve[4] / 100) * 160}`} r="6" fill="#f87171" className="animate-ping" />
                <circle cx={`${(4 / 9) * 700}`} cy={`${190 - (predictedDemandCurve[4] / 100) * 160}`} r="4" fill="#ef4444" />

                {/* October Peak: Idx 5 */}
                <circle cx={`${(5 / 9) * 700}`} cy={`${190 - (predictedDemandCurve[5] / 100) * 160}`} r="6" fill="#f87171" className="animate-ping" />
                <circle cx={`${(5 / 9) * 700}`} cy={`${190 - (predictedDemandCurve[5] / 100) * 160}`} r="4" fill="#ef4444" />
                
                {/* Floating tags */}
                <text x={`${(5 / 9) * 700 + 10}`} y={`${190 - (predictedDemandCurve[5] / 100) * 160}`} fill="#fca5a5" fontSize="10" fontFamily="monospace">
                  Shortage Deficit Peak!
                </text>
              </svg>

              {/* Chart Months Label absolute overlay */}
              <div className="absolute -bottom-5 inset-x-0 flex justify-between font-mono text-[9px] text-slate-400">
                {monthsList.map((m, mIdx) => (
                  <span key={mIdx}>{m}</span>
                ))}
              </div>
            </div>

            <div className="pt-4" />
          </div>

          {/* Sowing action block summary */}
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-4 flex gap-3 text-left">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Shortage Mitigation Insights</h5>
              <p className="text-[11px] text-emerald-800 leading-normal font-sans">
                Notice the red **Shortage Deficit Peaks** during festival weeks (April & September/October). Local demand for fresh crops surges due to traditional home feasts, but farmers historically cut back because of winter crop turnovers or rainfall delays. By locking sowing slots, you hedge weather risks and guarantee immediate delivery directly to consumers at guaranteed set pricing!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trust safety badge footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-slate-450" />
          Neural Sowing Predictor Version 3.4
        </span>
        <span className="text-slate-400">Checked: June 2026 Sowing Allocations Open</span>
      </div>

    </div>
  );
}
