/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, BarChart, Plus, Trash, Check, Package, RotateCcw, Image, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../lib/store';
import FreshnessScannerModal from './FreshnessScannerModal';
import FarmTrustBadge from './FarmTrustBadge';
import DemandForecasting from './DemandForecasting';

export default function FarmerDashboard() {
  const {
    products,
    orders,
    addNewProduct,
    updateOrderStatus,
    currentUser,
    farmerProfile
  } = useAppStore();

  const [scanOpen, setScanOpen] = useState(false);
  const [formScore, setFormScore] = useState(95);
  const [formLabel, setFormLabel] = useState('AAA Super Fresh');

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('3.99');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('100');
  const [category, setCategory] = useState('Vegetables');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Farmer context indicators
  const myFarmerId = farmerProfile ? farmerProfile.id : 'frm_1';
  const myProducts = products.filter(p => p.farmerId === myFarmerId);
  const myOrders = orders.filter(o => o.farmerId === myFarmerId);

  // Financial Metrics
  const pendingOrders = myOrders.filter(o => (o.status as string) === 'pending');
  const preparingOrders = myOrders.filter(o => (o.status as string) === 'preparing' || (o.status as string) === 'accepted');
  const completedOrders = myOrders.filter(o => (o.status as string) === 'delivered');

  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Image upload converter helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !stock) {
      alert('Fill all mandatory product parameters before listing.');
      return;
    }

    const ok = await addNewProduct({
      farmerId: myFarmerId,
      farmerName: currentUser?.name || 'Hari Prasad Acharya',
      farmName: farmerProfile?.farmName || 'Gyaneshwor Organic Farm',
      title,
      description: description || 'No description provided.',
      category,
      price: Number(price),
      unit,
      stock: Number(stock),
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      freshnessScore: formScore,
      freshnessLabel: formLabel as any
    });

    if (ok) {
      alert('Product listed successfully & updated to all customer screens in real-time!');
      setTitle('');
      setDescription('');
      setImage('');
      setStock('100');
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Farm Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {farmerProfile ? farmerProfile.farmName : "Gyaneshwor Organic Farm"}
            </h2>
            <FarmTrustBadge farmName={farmerProfile?.farmName || "Gyaneshwor Organic Farm"} rating={farmerProfile?.rating || 4.9} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-xl">
            {farmerProfile ? farmerProfile.description : "Gyaneshwor Organic Farm is committed to heirloom and regenerative farming practices."}
          </p>
          <div className="text-[11px] text-slate-400 font-mono tracking-tight uppercase flex items-center gap-2 flex-wrap">
            <span>📍 Location: {farmerProfile ? farmerProfile.location : "Dhulikhel, Kavre (26 km)"}</span>
            <span>•</span>
            <span>Rating: {farmerProfile ? farmerProfile.rating : 4.9} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Gross Sales</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">Rs. {totalSales.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <BarChart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Low Stock Crops</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">
              {myProducts.filter(p => p.stock <= 20).length} items
            </h3>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Inbox Live Orders</p>
            <h3 className="text-2xl font-black text-sky-700 mt-1">{pendingOrders.length} boxes</h3>
          </div>
          <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
            <Package className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Crops in Store</p>
            <h3 className="text-2xl font-black text-slate-700 mt-1">{myProducts.length} items</h3>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Smart Demand Forecasting */}
      <DemandForecasting />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left side: Add Product Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              List Fresh Harvest Crop
            </h3>
            <p className="text-xs text-slate-400 font-mono">Upload to direct marketplace</p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Crop Title*</label>
              <input
                type="text"
                placeholder="Heirloom Red Strawberries..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none focus:border-emerald-550"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Direct Price (Rs.)*</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none focus:border-emerald-550"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Billing Unit*</label>
                <input
                  type="text"
                  placeholder="kg, bunch, crate"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Total Stock Available*</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs py-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Category*</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-xs focus:outline-none"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Crop Synopsis</label>
              <textarea
                placeholder="Sweeter and crisper variety grown from heirloom compost roots."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-xs min-h-[60px] focus:outline-none"
              />
            </div>

            {/* AI Freshness scanning area */}
            <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                  AI Quality Certify
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-extrabold uppercase">
                  {formScore}% {formLabel}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-normal font-sans">
                Perform visual analysis to calculate organic index and grade label before publishing crop.
              </p>
              <button
                type="button"
                onClick={() => setScanOpen(true)}
                className="w-full bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-800 font-bold py-2 rounded-lg text-xs cursor-pointer shadow-sm"
              >
                Scan Product with AI Scanner
              </button>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Crop Cover Photo</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 file:cursor-pointer hover:file:bg-slate-200"
                />
                {image && <Image className="text-emerald-700 w-5 h-5 shrink-0" />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-650 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl text-xs uppercase cursor-pointer shadow-md shadow-emerald-100 transition-colors"
            >
              Expose Direct to Marketplace
            </button>
          </form>
        </div>

        {/* Right side: Incoming Orders & Products lists */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Incoming Orders */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Active Diner Incoming Orders</h3>
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No orders have hit your storefront inbox yet.</p>
              ) : (
                myOrders.map(ord => (
                  <div key={ord.id} className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 font-mono text-xs text-left">
                     <div className="flex justify-between items-start border-b border-slate-200 pb-2.5">
                      <div>
                        <div className="text-emerald-800 font-bold text-xs">ORDER #{ord.id}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">{new Date(ord.createdAt).toLocaleTimeString()}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        ord.status === 'preparing' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span>{it.quantity}x {it.title}</span>
                          <span>Rs. {(it.price * it.quantity).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm font-sans mt-1">
                        <span>Total Pay</span>
                        <span className="text-emerald-700">Rs. {ord.totalPrice.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="text-left text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                      <strong>Ship Address:</strong> {ord.customerAddress}
                    </div>

                    {ord.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'preparing')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept & Pack Cargo
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Catalog Stock list */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight mb-4 text-left">Your Store Catalog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myProducts.map(prd => (
                <div key={prd.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex gap-3 text-left shadow-sm">
                  <img
                    src={prd.image}
                    alt={prd.title}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{prd.title}</h4>
                    <p className="text-[10px] text-emerald-700 mt-1 font-mono font-semibold">Rs. {prd.price.toLocaleString('en-NP', { minimumFractionDigits: 2 })} / {prd.unit}</p>
                    <p className={`text-[10px] font-mono mt-1 font-bold ${prd.stock <= 10 ? 'text-amber-600' : 'text-slate-450'}`}>
                      Stock: {prd.stock} {prd.unit}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {scanOpen && (
        <FreshnessScannerModal
          onScanComplete={(score, lbl) => {
            setFormScore(score);
            setFormLabel(lbl);
          }}
          onClose={() => setScanOpen(false)}
        />
      )}
    </div>
  );
}
