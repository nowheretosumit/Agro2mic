/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, Radio, Calendar, Droplet, Thermometer, Info, 
  MapPin, CheckCircle2, FlaskConical, Navigation, Sparkles, AlertCircle 
} from 'lucide-react';
import { Product } from '../types';

interface DigitalFarmPassportProps {
  product: Product;
}

interface PassportData {
  plantedDate: string;
  harvestDateTime: string;
  soilMoisture: string;
  soilNPK: { n: number; p: number; k: number };
  soilPH: number;
  waterSource: string;
  fertilizer: string;
  temperatureLogs: Array<{ time: string; temp: number; location: string; status: string }>;
  batchId: string;
  verifier: string;
  blockchainHash: string;
}

// Generate static detailed passport profiles for predefined products
// or fallback deterministically for newly created farmer products!
const generatePassportData = (product: Product): PassportData => {
  const cleanId = product.id.replace('prd_', '');
  const farmSeed = product.farmName.length + product.title.length;
  
  // Deterministic batch ID
  const batchId = `AG-${product.category.substring(0, 2).toUpperCase()}-${10000 + (farmSeed % 8999)}`;
  const blockchainHash = `0x7faee${(farmSeed * 179).toString(16)}bc1e${cleanId}f59e9a4`;

  // Standard preset profiles matching our catalog
  if (product.id === 'prd_1' || product.title.toLowerCase().includes('lettuce')) {
    return {
      plantedDate: 'March 15, 2026 (79 days growth cycle)',
      harvestDateTime: 'June 3, 2026 at 5:12 AM (Dawn Harvest)',
      soilMoisture: '76% (Optimal vegetative standard)',
      soilNPK: { n: 124, p: 42, k: 168 },
      soilPH: 6.75,
      waterSource: 'Certified mountain spring rain-harvesting tank',
      fertilizer: 'Premium worm-castings & active mycorrhizae fungi compost tea',
      verifier: 'Himalayan Organic Certifications Bureau',
      blockchainHash,
      batchId,
      temperatureLogs: [
        { time: '05:45 AM', temp: 14.2, location: 'Field Pack Station', status: 'Clipped & cold water bath rinsed' },
        { time: '07:15 AM', temp: 14.0, location: 'Gyaneshwor Farm Gate', status: 'Enclosed in moisture-lock biodegradable starch bag' },
        { time: '07:30 AM', temp: 14.2, location: 'Transit Startup (Dhulikhel Hwy)', status: 'Rider Arjun loaded cargo cooler compartment' },
        { time: '08:15 AM', temp: 14.5, location: 'Koteshwor Micro-Depot', status: 'Mid-route quality checkpoint clear' },
        { time: '08:45 AM', temp: 14.8, location: 'Lalitpur Sorting Gateway', status: 'Package scan matching direct delivery dispatch' }
      ]
    };
  }

  if (product.id === 'prd_2' || product.title.toLowerCase().includes('tomato')) {
    return {
      plantedDate: 'February 10, 2026 (113 days full maturation cycle)',
      harvestDateTime: 'June 3, 2026 at 5:48 AM (Dawn Harvest)',
      soilMoisture: '68% (Regulated moisture restriction to concentrate fruit sweetness)',
      soilNPK: { n: 110, p: 58, k: 185 },
      soilPH: 6.42,
      waterSource: 'Solar-pumped deep geological aquifer well',
      fertilizer: 'Aromatic neem-cake dust, decomposed rice-husks, & localized organic potash',
      verifier: 'National Agritech Soil & Organic Standard Board',
      blockchainHash,
      batchId,
      temperatureLogs: [
        { time: '06:10 AM', temp: 15.0, location: 'Heirloom Orchard Packhouse', status: 'Stem-clipped select sorting & natural drying' },
        { time: '07:20 AM', temp: 14.8, location: 'Gyaneshwor Farm Gate', status: 'Laid into breathable wooden slats cargo crates' },
        { time: '07:30 AM', temp: 15.1, location: 'Transit Startup (Dhulikhel Hwy)', status: 'Maintained in chilled shade climate container' },
        { time: '08:10 AM', temp: 15.5, location: 'Koteshwor Micro-Depot', status: 'GPS lock verification complete' },
        { time: '08:40 AM', temp: 15.2, location: 'Lalitpur Sorting Gateway', status: 'Moisture evaluation: optimal' }
      ]
    };
  }

  if (product.id === 'prd_3' || product.title.toLowerCase().includes('apple')) {
    return {
      plantedDate: 'Permaculture Orchard (Canopy established in Spring 2018)',
      harvestDateTime: 'June 2, 2026 at 6:30 AM (Morning Harvest)',
      soilMoisture: '52% (Well-drained alpine stony terroir)',
      soilNPK: { n: 85, p: 30, k: 142 },
      soilPH: 7.12,
      waterSource: 'Himalayan pristine glacial meltwater stream (Nilgiri runoff)',
      fertilizer: 'Composted mountain pine-needles and wild yak meadow manure',
      verifier: 'Bidur Farmer Cooperative Labs',
      blockchainHash,
      batchId,
      temperatureLogs: [
        { time: '06:45 AM (June 2)', temp: 6.5, location: 'Mustang Foothills Cold-Cell', status: 'Preservation chilling inside limestone cellar' },
        { time: '10:00 AM (June 2)', temp: 7.2, location: 'Nuwakot mountain drone hub', status: 'Eco electric flight container payload' },
        { time: '05:30 AM (June 3)', temp: 8.5, location: 'Kathmandu Gateway Depot', status: 'Handover to final-mile green electric trike' },
        { time: '08:20 AM (June 3)', temp: 8.7, location: 'Lalitpur Delivery Hub', status: 'Visual spectral inspection: AAA verified' }
      ]
    };
  }

  if (product.id === 'prd_4' || product.title.toLowerCase().includes('milk') || product.category.toLowerCase().includes('dairy')) {
    return {
      plantedDate: 'Perennial Ryegrass & Wild Clover Pastures (Rotational grazing cycle)',
      harvestDateTime: 'June 3, 2026 at 4:30 AM (Pre-dawn milking session)',
      soilMoisture: '82% (Rich meadow high altitude loam)',
      soilNPK: { n: 130, p: 48, k: 160 },
      soilPH: 6.90,
      waterSource: 'Natural underground spring fed drinking aquifers',
      fertilizer: 'Closed-loop organic pasture grazing compost (No synthetic feeds)',
      verifier: 'Himalayan Dairy Quality & Purity Division',
      blockchainHash,
      batchId,
      temperatureLogs: [
        { time: '04:45 AM', temp: 3.8, location: 'Milking Bay Cold-Plate', status: 'Immediate thermal shock filtration to prevent micro-growth' },
        { time: '05:30 AM', temp: 3.9, location: 'A2 Somatic Cell Purity Lab', status: 'Somatic cell count 110k/mL (Certified Grade-A premium)' },
        { time: '07:15 AM', temp: 4.0, location: 'Bidur Farm Gate Dispatch', status: 'Hermetically sealed inside pre-nitrogen flushed glass bottles' },
        { time: '07:30 AM', temp: 4.1, location: 'Cold-Chain Trike Active', status: 'Placed into active battery-powered sub-4°C freezer compartment' },
        { time: '08:15 AM', temp: 4.2, location: 'Lalitpur Sorting Hub', status: 'Temperature check: stable 4.2°C maintained throughout route' }
      ]
    };
  }

  // Fallback programmatic passport for custom creations
  let daysCycle = 45 + (farmSeed % 60);
  const fakePlantedDate = new Date(Date.now() - 3600000 * 24 * daysCycle);
  const rawHarvest = new Date(product.createdAt);
  
  return {
    plantedDate: `${fakePlantedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${daysCycle} days micro-cultivation)`,
    harvestDateTime: `${rawHarvest.toLocaleDateString('en-US')} at ${rawHarvest.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
    soilMoisture: `${60 + (farmSeed % 25)}% (Certified agro-meteorological index)`,
    soilNPK: { 
      n: 95 + (farmSeed % 50), 
      p: 28 + (farmSeed % 30), 
      k: 120 + (farmSeed % 80) 
    },
    soilPH: Number((6.0 + (farmSeed % 15) / 10).toFixed(2)),
    waterSource: 'Filtered local mountain rain-tank & drip network system',
    fertilizer: 'Local bio-char organic compost slurry & beneficial soil nitrogen-fixers',
    verifier: 'Agro2mic Regional Farm-Pass Liaison',
    blockchainHash,
    batchId,
    temperatureLogs: [
      { time: 'Harvest Hr', temp: 14.5, location: 'Local Farm Shed', status: 'Certified visual review and manual dirt removal' },
      { time: 'Pickup Hr', temp: 14.8, location: 'Regional Sourcing Post', status: 'Secured inside direct agricultural basket crate' },
      { time: 'Transit Hr', temp: 15.0, location: 'Eco Trike Logistics', status: 'Active climate monitoring container' }
    ]
  };
};

export default function DigitalFarmPassport({ product }: DigitalFarmPassportProps) {
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'minerals'>('timeline');
  const passport = generatePassportData(product);

  // Auto scan when product changes to make it responsive
  useEffect(() => {
    setIsScanned(false);
    setIsNfcScanning(true);
    const t = setTimeout(() => {
      setIsNfcScanning(false);
      setIsScanned(true);
      // Play a little tick sound if supported
      try {
        const scannerAudio = new Audio('data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQgAAAAEAAEA/v8AAA==');
        scannerAudio.volume = 0.15;
        scannerAudio.play().catch(() => {});
      } catch (_) {}
    }, 1200);
    return () => clearTimeout(t);
  }, [product]);

  const handleSimulateScan = () => {
    setIsScanned(false);
    setIsNfcScanning(true);
    setTimeout(() => {
      setIsNfcScanning(false);
      setIsScanned(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-5 flex flex-col justify-between h-full">
      
      {/* Scanner Simulator Frame */}
      <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[140px]">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isNfcScanning ? (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 flex flex-col items-center relative z-10"
            >
              <div className="relative">
                {/* Visual Radar Pulse */}
                <div className="absolute inset-0 w-11 h-11 bg-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-full relative z-10">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-emerald-700 animate-pulse uppercase tracking-wider">
                  NFC Signalling & QR Verified...
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Contacting Decentralized Oracles for harvest ledger ...</p>
              </div>
            </motion.div>
          ) : isScanned ? (
            <motion.div 
              key="scanned"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 text-left w-full relative z-10"
            >
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <QrCode className="w-10 h-10 text-emerald-700 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold bg-emerald-600 text-white rounded px-1.5 py-0.5 tracking-wider uppercase">
                    Blockchain Verified
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]" title={passport.blockchainHash}>
                    {passport.blockchainHash.substring(0, 10)}...
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-800 font-sans tracking-tight mt-1">
                  Digital Pass Batch: {passport.batchId}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  Audit Agency: {passport.verifier}
                </p>
              </div>
              <button 
                onClick={handleSimulateScan}
                className="text-[10px] font-mono text-emerald-700 hover:underline border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 py-1 px-2.5 rounded-lg shrink-0 transition-colors"
                title="Tap to trigger a simulated NFC scan again"
              >
                Scan NFC
              </button>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-455">Produce Passport Encrypted</p>
              <button 
                onClick={handleSimulateScan}
                className="bg-emerald-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl"
              >
                Simulate Passport Scans
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {isScanned && (
        <div className="space-y-4">
          {/* Sub Tab buttons */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`flex-1 pb-2 text-[11px] font-bold tracking-wider font-mono uppercase text-center border-b-2 transition-all ${
                activeSubTab === 'timeline'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              🌾 Harvest Timeline
            </button>
            <button
              onClick={() => setActiveSubTab('minerals')}
              className={`flex-1 pb-2 text-[11px] font-bold tracking-wider font-mono uppercase text-center border-b-2 transition-all ${
                activeSubTab === 'minerals'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              🧪 Soil & Mineral Profiles
            </button>
          </div>

          {/* Sub Tab Contents */}
          <AnimatePresence mode="wait">
            {activeSubTab === 'timeline' ? (
              <motion.div
                key="timeline_tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                {/* Crop Maturation Steps */}
                <div className="relative pl-5 border-l border-emerald-200 space-y-4 text-xs">
                  
                  {/* Step 1: Planted */}
                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 bg-emerald-600 text-white border-2 border-white w-2.5 h-2.5 rounded-full" />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-slate-450" />
                        Maturation Start / Seeded
                      </div>
                      <h5 className="font-bold text-slate-800 text-[11px] mt-0.5">Crop Sowing Initiated</h5>
                      <p className="text-[10px] text-slate-500 leading-tight">{passport.plantedDate}</p>
                    </div>
                  </div>

                  {/* Step 2: Harvested */}
                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 bg-emerald-600 text-white border-2 border-white w-2.5 h-2.5 rounded-full" />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[9px] uppercase tracking-wider font-bold">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Pristine Morning Reap
                      </div>
                      <h5 className="font-bold text-slate-800 text-[11px] mt-0.5">Harvest Completed</h5>
                      <p className="text-[10px] text-emerald-700 font-mono leading-tight bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1 w-max">
                        {passport.harvestDateTime}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Logistics logs */}
                  <div className="relative border-t border-slate-150 pt-3 mt-3">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-wider mb-2">
                      <Thermometer className="w-3 h-3 text-slate-450" />
                      Live Transit Cold-Chain Temperature Logs
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {passport.temperatureLogs.map((log, lIdx) => (
                        <div key={lIdx} className="bg-white border border-slate-150 rounded-lg p-2 flex items-center justify-between text-left gap-2 hover:border-emerald-400/20 transition-all">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[9px] font-bold text-slate-400">{log.time}</span>
                              <span className="text-[10px] font-bold text-slate-800">{log.location}</span>
                            </div>
                            <p className="text-[9px] text-slate-550 leading-relaxed font-sans mt-0.5">{log.status}</p>
                          </div>
                          <div className={`p-1 px-1.5 rounded-lg border text-right font-mono text-[10px] font-bold ${
                            log.temp <= 5 
                              ? 'bg-blue-50 border-blue-100 text-blue-700' 
                              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          }`}>
                            {log.temp}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="minerals_tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-xs text-left"
              >
                {/* Minerals breakdown */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-sm font-sans">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                    Soil Chemical & Sensor Telemetry
                  </h4>
                  
                  {/* NPK Grid and Bars */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Soil Hydration Moisture</span>
                      <span className="font-bold text-slate-800">{passport.soilMoisture}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500">
                        <span>Nitrogen (N) Content</span>
                        <span className="font-bold text-slate-800">{passport.soilNPK.n} ppm</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (passport.soilNPK.n / 170) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500">
                        <span>Phosphorus (P) Content</span>
                        <span className="font-bold text-slate-800">{passport.soilNPK.p} ppm</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, (passport.soilNPK.p / 90) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500">
                        <span>Potassium (K) Content</span>
                        <span className="font-bold text-slate-800">{passport.soilNPK.k} ppm</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-650 h-full rounded-full" style={{ width: `${Math.min(100, (passport.soilNPK.k / 220) * 100)}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-100 mt-2">
                      <span>Loam Ground pH Neutrality</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                        {passport.soilPH} Class pH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary water & compost specs */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-sm font-sans">
                  <div className="flex items-start gap-2">
                    <Droplet className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-bold text-slate-800 text-[10px] font-mono uppercase tracking-wide">Irrigation Hydration Source</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{passport.waterSource}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 border-t border-slate-100 pt-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-bold text-slate-800 text-[10px] font-mono uppercase tracking-wide">Composting Nutrition Compound</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{passport.fertilizer}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Trust reassurance banner */}
      <div className="bg-emerald-50 border border-emerald-250/30 rounded-xl p-3 flex gap-2.5 text-left font-sans">
        <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[10px] font-bold text-emerald-900 tracking-wide uppercase leading-none">Agro2mic Certifications</h4>
          <p className="text-[9px] text-emerald-700 leading-normal mt-1">
            This passport is physically verified by direct automated sensors at harvest bagging. Scan QR labels on cargo packaging to retrieve decentralized oracle reports anytime.
          </p>
        </div>
      </div>

    </div>
  );
}
