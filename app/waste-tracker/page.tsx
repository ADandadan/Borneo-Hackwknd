"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, TrendingDown, DollarSign, Info, Sparkles, Sprout } from 'lucide-react';

interface Product { id: number; name: string; inStock: number; }
interface WasteLog {
  id: string; productName: string; quantity: number; reason: string;
  costLost: number; wasteRate: number; aiSuggestion: string; date: string;
}

export default function WasteTrackerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalBatchStock, setTotalBatchStock] = useState(''); 
  const [reason, setReason] = useState('');
  const [unitCost, setUnitCost] = useState('');
  
  // Added pre-filled data to show off the AI immediately!
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([
    {
      id: 'mock-1', productName: 'Fresh Tomatoes', quantity: 5, reason: 'Spoiled',
      costLost: 15.00, wasteRate: 10.0, aiSuggestion: 'Check storage temperatures immediately. Compost if organic & safe.',
      date: new Date().toLocaleDateString('en-MY')
    },
    {
      id: 'mock-2', productName: 'Nasi Lemak Pre-pack', quantity: 12, reason: 'Unsold',
      costLost: 36.00, wasteRate: 24.0, aiSuggestion: 'Donate to local food banks or sell on surplus apps at 50% off.',
      date: new Date().toLocaleDateString('en-MY')
    },
    {
      id: 'mock-3', productName: 'Cabbage Heads', quantity: 3, reason: 'Expired',
      costLost: 9.00, wasteRate: 6.0, aiSuggestion: 'Convert to compost (Buat Baja) for community gardens.',
      date: new Date().toLocaleDateString('en-MY')
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('freshstock_products');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts([{ id: 1, name: 'Fresh Tomatoes', inStock: 50 }, { id: 2, name: 'Nasi Lemak Pre-pack', inStock: 50 }]);
  }, []);

  const getAiSuggestion = (wasteReason: string) => {
    switch(wasteReason) {
      case 'Expired': return "Convert to compost (Buat Baja) for community gardens.";
      case 'Unsold': return "Donate to local food banks or sell on surplus apps at 50% off.";
      case 'Returned': return "Investigate quality control. Discard safely to prevent contamination.";
      case 'Spoiled': return "Check storage temperatures immediately. Compost if organic & safe.";
      default: return "Review purchasing limits to prevent future overstocking.";
    }
  };

  const handleLogWaste = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !quantity || !reason || !unitCost || !totalBatchStock) return alert("Please fill in all fields");

    const qty = parseFloat(quantity);
    const cost = parseFloat(unitCost);
    const batchStock = parseFloat(totalBatchStock);
    
    const totalCostLost = qty * cost;
    const calculatedWasteRate = (qty / batchStock) * 100;

    const newLog: WasteLog = {
      id: Date.now().toString(),
      productName: product.name,
      quantity: qty,
      reason: reason,
      costLost: totalCostLost,
      wasteRate: calculatedWasteRate,
      aiSuggestion: getAiSuggestion(reason),
      date: new Date().toLocaleDateString('en-MY')
    };

    setWasteLogs([newLog, ...wasteLogs]);
    setQuantity(''); setReason(''); setUnitCost(''); setTotalBatchStock('');
  };

  const removeLog = (id: string) => setWasteLogs(wasteLogs.filter(log => log.id !== id));
  const totalFinancialLoss = wasteLogs.reduce((sum, log) => sum + log.costLost, 0);

  return (
    <div className="ml-64 p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Waste & Impact Tracker</h1>
        <p className="text-gray-500 text-lg">Calculate loss, waste rates, and discover sustainable solutions</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Log Food Waste</h2>
          <div className="space-y-4">
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none">
              <option value="">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Waste Qty</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Units wasted" className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Total Batch Stock</label>
                <input type="number" value={totalBatchStock} onChange={(e) => setTotalBatchStock(e.target.value)} placeholder="Original qty" className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Cost Price (RM)</label>
                <input type="number" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} placeholder="0.00" className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Reason</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none">
                  <option value="">Select...</option>
                  <option value="Returned">Returned</option>
                  <option value="Unsold">Unsold</option>
                  <option value="Expired">Expired</option>
                  <option value="Spoiled">Spoiled</option>
                </select>
              </div>
            </div>

            <button onClick={handleLogWaste} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition mt-2">
              Calculate Impact & Log
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col justify-center items-center text-center mb-6">
              <DollarSign size={32} className="text-red-500 mb-2" />
              <p className="text-sm text-red-700 font-bold uppercase tracking-wider mb-1">Total Profit Loss</p>
              <p className="text-5xl font-black text-red-600">RM {totalFinancialLoss.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-sm flex gap-3 items-start">
              <Sprout size={24} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 font-medium">
                Turning waste into fertilizer (Buat Baja) supports local agriculture, creating a circular food economy right here in our community.
              </p>
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Waste History & AI Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wasteLogs.map((log) => (
          <div key={log.id} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-red-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{log.productName}</h3>
                <span className="text-xs font-bold text-red-500 uppercase">{log.reason}</span>
              </div>
              <button onClick={() => removeLog(log.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Profit Loss</p>
                <p className="text-lg font-bold text-red-600">RM {log.costLost.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Waste Rate</p>
                <p className="text-lg font-bold text-orange-600">{log.wasteRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mt-2">
              <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-700 font-bold uppercase mb-1">AI Recommendation</p>
                <p className="text-sm text-blue-900 font-medium">{log.aiSuggestion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}