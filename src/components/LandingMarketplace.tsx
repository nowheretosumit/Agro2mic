/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, HelpCircle, Star, Filter, ArrowRight, Wallet, Sparkles, MapPin, Plus, Minus, Trash, X, MessageSquare } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Product, Review } from '../types';
import TrackingMap from './TrackingMap';
import CarbonFootprintScorecard from './CarbonFootprintScorecard';
import DigitalFarmPassport from './DigitalFarmPassport';
import FarmTrustBadge from './FarmTrustBadge';

export default function LandingMarketplace() {
  const {
    products,
    orders,
    deliveries,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkout,
    currentUser,
    customerProfile,
    addReview
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'price_asc', 'price_desc', 'freshness', 'rating'
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'passport' | 'reviews'>('passport');

  // Active delivery filter for live tracking panel
  const activeOrder = orders
    .filter(o => o.customerId === currentUser?.id)
    .find(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const activeDelivery = activeOrder && deliveries.find(d => d.orderId === activeOrder.id);

  // Get filtered & sorted products
  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'freshness') return b.freshnessScore - a.freshnessScore;
      return b.rating - a.rating;
    });

  // Calculate cart total summary
  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const prd = products.find(p => p.id === id);
    return {
      product: prd,
      quantity: qty
    };
  }).filter(item => !!item.product) as Array<{ product: Product; quantity: number }>;

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Open item modal details & fetch reviews
  const openProductDetails = async (prd: Product) => {
    setSelectedProduct(prd);
    setReviewRating(5);
    setReviewComment('');
    setModalTab('passport');
    try {
      const res = await fetch(`/api/products/${prd.id}/reviews`);
      if (res.ok) {
        const revs = await res.json();
        setProductReviews(revs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !currentUser) return;

    if (!reviewComment.trim()) {
      alert('Review comment cannot be empty');
      return;
    }

    await addReview(selectedProduct.id, reviewRating, reviewComment);

    // Refresh reviews
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/reviews`);
      if (res.ok) {
        const revs = await res.json();
        setProductReviews(revs);
      }
    } catch (_) {}

    setReviewComment('');
  };

  return (
    <div className="space-y-10">
      {/* Hero Welcome Unit */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl space-y-6 text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 py-1.5 px-3.5 rounded-full text-xs font-mono font-bold tracking-tight">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            100% REGIONALLY AUDITED NATURAL COMPOSTS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-sans">
            Connecting Regional Farms <span className="text-emerald-700">Directly</span> To Your Dinner Plate.
          </h1>

          <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-sans">
            Eliminate mid-market markups. Purchase fresh farm crops with instant carbon transparency metrics, live-broadcast coordinates tracking, and certified AI visual spectrometer inspections.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('marketplace-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Harvest Basket
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Bag Wallet</p>
                <p className="text-sm font-bold text-slate-800">
                  {customerProfile ? `Rs. ${customerProfile.balance.toLocaleString('en-NP', { minimumFractionDigits: 2 })}` : 'Rs. 0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-sm aspect-video sm:aspect-square md:w-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0 group">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
            alt="Farm Fresh"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 text-left">
            <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest">Harvested Fresh at 5:12 AM</p>
            <h4 className="text-sm font-bold text-white leading-tight">Misty Morning Clover Farms</h4>
          </div>
        </div>
      </div>

      {/* Live tracking overlay segment */}
      {activeOrder && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              Incoming Harvest Tracker
            </h3>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 py-1 px-3.5 rounded-full border border-emerald-200 font-semibold uppercase">
              In Transit
            </span>
          </div>
          <TrackingMap delivery={activeDelivery || null} />
        </div>
      )}

      {/* Marketplace exploration sector */}
      <div id="marketplace-anchor" className="space-y-6 pt-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-6">
          <div className="text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Locally Grown Basket</h2>
            <p className="text-xs text-slate-500">Filtering the local crop inventory of Dhulikhel & Nuwakot</p>
          </div>

          {/* Search, Filter bar */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search greens, fruits, milks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-850 placeholder-slate-400 transition-colors focus:outline-none shadow-sm"
              />
            </div>

            {/* Sorting SELECT */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="rating">Top Rated Seeds</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="freshness">Spectrometer Freshness Indicator</option>
              </select>
            </div>

            {/* Cart trigger button */}
            <button
              onClick={() => setCartOpen(true)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-4 text-xs text-slate-850 hover:border-emerald-600/30 font-semibold flex items-center gap-2 transition-colors relative shadow-sm cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              Cart Bag
              {cartItems.length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories filters layout */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Vegetables', 'Fruits', 'Dairy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid layout of products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-700">No Fresh Harvest found</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the keyword filter or choose a different category menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prd) => {
              const inQty = cart[prd.id] || 0;
              return (
                <div
                  key={prd.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-emerald-650/35 transition-all duration-350 hover:-translate-y-1 shadow-sm group"
                >
                  <div>
                    {/* Image Box */}
                    <div
                      onClick={() => openProductDetails(prd)}
                      className="aspect-video relative overflow-hidden bg-slate-50 cursor-pointer"
                    >
                      <img
                        src={prd.image}
                        alt={prd.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                      {/* Freshness rating label overlay */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg py-1 px-2 border border-slate-100 flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-slate-800">AI Score: {prd.freshnessScore}%</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <div className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-bold">{prd.category}</div>
                        <h4 className="text-sm font-bold text-white truncate leading-snug">{prd.title}</h4>
                      </div>
                    </div>

                    {/* Metadata Content block */}
                    <div className="p-4 space-y-3.5 text-left">
                      <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">{prd.description}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-b border-slate-100 py-2 font-mono">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{prd.farmName}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold">{prd.rating}</span>
                        </div>
                      </div>

                      {/* Trust rating badge */}
                      <div className="flex items-center justify-between gap-1 text-[10px] pb-1">
                        <span className="text-slate-400 font-mono">Farm Trust Tier:</span>
                        <FarmTrustBadge farmName={prd.farmName} rating={prd.rating} />
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action footer card footer */}
                  <div className="p-4 pt-0 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-450 font-mono tracking-wide uppercase">Direct Farm Price</p>
                      <p className="text-lg font-extrabold text-slate-900">
                        Rs. {prd.price.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
                        <span className="text-xs text-slate-450 font-normal font-mono"> / {prd.unit}</span>
                      </p>
                    </div>

                    {inQty > 0 ? (
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
                        <button
                          onClick={() => removeFromCart(prd.id)}
                          className="p-1 px-2 rounded-lg hover:bg-slate-200 text-emerald-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 font-mono px-1">{inQty}</span>
                        <button
                          onClick={() => addToCart(prd.id)}
                          disabled={prd.stock <= inQty}
                          className="p-1 px-2 rounded-lg hover:bg-slate-200 text-emerald-700 disabled:text-slate-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(prd.id)}
                        disabled={prd.stock <= 0}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {prd.stock <= 0 ? 'Sold Out' : 'Add to Bag'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product reviews / Info details modal overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 text-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900">Product Specsheet & Reviews</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full sm:w-48 h-36 object-cover rounded-xl border border-slate-200 bg-slate-50"
                />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 py-0.5 px-2 rounded font-bold uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 leading-tight">{selectedProduct.title}</h4>
                  <p className="text-xs text-emerald-700 font-mono">By: {selectedProduct.farmerName} • {selectedProduct.farmName}</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-1">Price: Rs. {selectedProduct.price.toLocaleString('en-NP', { minimumFractionDigits: 2 })} / {selectedProduct.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-mono font-semibold">Spectrometer rating:</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {selectedProduct.freshnessScore}% AAA Fresh Code
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 font-mono font-semibold">Farm Trust Tier:</span>
                    <FarmTrustBadge farmName={selectedProduct.farmName} rating={selectedProduct.rating} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">Product Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">{selectedProduct.description}</p>
              </div>              {/* TABS SELECTOR */}
              <div className="flex border-b border-slate-205 gap-5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalTab('passport')}
                  className={`pb-2.5 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    modalTab === 'passport'
                      ? 'border-emerald-600 text-emerald-800 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-655'
                  }`}
                >
                  🌾 Digital Farm Passport
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('reviews')}
                  className={`pb-2.5 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    modalTab === 'reviews'
                      ? 'border-emerald-600 text-emerald-800 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-655'
                  }`}
                >
                  💬 Verified Appraisals ({productReviews.length})
                </button>
              </div>

              {modalTab === 'passport' ? (
                <DigitalFarmPassport product={selectedProduct} />
              ) : (
                /* Reviews segment */
                <div className="pt-2 space-y-4">
                  <h5 className="text-xs font-bold font-mono tracking-wider text-slate-500 uppercase flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Verified Customer Appraisals ({productReviews.length})
                  </h5>

                  {/* Submit review */}
                  {currentUser && (
                    <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 font-semibold">Share your experience</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${reviewRating >= s ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Was this produce crunchy, sweet, fresh? Write comment here..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-lg p-3 text-xs text-slate-850 focus:outline-none min-h-[60px]"
                      />
                      <div className="text-right">
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-1.5 rounded-lg text-xs cursor-pointer"
                        >
                          Submit Appraisal
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2.5">
                    {productReviews.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">No reviews yet. Be the first to try and review!</p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-800">{rev.customerName}</span>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-650 leading-normal">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Slider Drawer panel */}
      {cartOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative">
            <div>
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-lg text-slate-900">Your Marketplace Bag</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 px-2 hover:bg-slate-200 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                     <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-mono">[Your cart is empty]</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200 bg-slate-50"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-xs font-bold text-slate-850 truncate leading-tight">{item.product.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">By: {item.product.farmerName}</p>
                        <p className="text-xs font-mono font-semibold text-emerald-700 mt-1">Rs. {(item.product.price * item.quantity).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div className="flex flex-col justify-between items-end shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 0)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-white">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-0.5 px-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[11px] font-bold text-slate-800 font-mono">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item.product.id)}
                            disabled={item.product.stock <= item.quantity}
                            className="p-0.5 px-1.5 text-slate-500 hover:text-slate-900 disabled:text-slate-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total, checkout bottom drawer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4 overflow-y-auto max-h-[45vh]">
                {/* Dynamically calculate and display the Carbon Footprint Scorecard */}
                <CarbonFootprintScorecard cartItems={cartItems} />

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Est. Courier Fee</span>
                    <span>Rs. 0.00 (Promo)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Chlorophyll Carbon Offset</span>
                    <span>Rs. 0.00 (Complimentary)</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold text-base border-t border-slate-200 pt-2 font-sans">
                    <span>Total Direct Payment</span>
                    <span className="text-emerald-700">Rs. {cartTotal.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const ok = await checkout();
                    if (ok) {
                      setCartOpen(false);
                      alert('Checkout complete! Order dispatched to Gyaneshwor farm packer.');
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-100 tracking-wider font-sans cursor-pointer"
                >
                  Confirm Instant Direct Pay
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
