import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, ExternalLink, Search, Check, Zap, Building } from 'lucide-react';
import { SavedBill, UtilityCompany } from '../types';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';
import { Language } from '../utils/translations';

interface SavedBillsManagerProps {
  savedBills: SavedBill[];
  onCheckBill: (company: UtilityCompany, refNo: string) => void;
  onRemoveBill: (id: string) => void;
  onAddBill: (companyId: string, refNo: string, label: string) => void;
  lang: Language;
}

export const SavedBillsManager: React.FC<SavedBillsManagerProps> = ({
  savedBills,
  onCheckBill,
  onRemoveBill,
  onAddBill,
  lang
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('mepco');
  const [refInput, setRefInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) {
      setErrorMsg('Please enter a reference number');
      return;
    }
    const label = labelInput.trim() || 'My Meter';
    onAddBill(selectedCompanyId, refInput.trim(), label);
    setRefInput('');
    setLabelInput('');
    setShowAddForm(false);
    setErrorMsg('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ur' ? 'محفوظ شدہ میٹرز' : 'Saved Consumer Meters'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'ur' ? 'میرے محفوظ شدہ بلز' : 'My Saved Reference Numbers'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ur'
              ? 'اپنے گھر، دکان یا دفتر کے بلز محفوظ رکھیں اور ہر ماہ بار بار 14 ہندسے لکھے بغیر فوری چیک کریں۔'
              : 'Save your home, shop, or office meters locally to check every month with a single click.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ur' ? 'نیا میٹر محفوظ کریں' : 'Add New Meter'}</span>
        </button>
      </div>

      {/* Add New Meter Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Save a New Meter to Browser Storage
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Company:
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {UTILITY_COMPANIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Label / Nickname:
              </label>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g. Home Ground Floor, Shop"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Reference / Account No:
              </label>
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="14 or 10 digits"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-500 font-semibold mb-2">{errorMsg}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Save Meter
            </button>
          </div>
        </form>
      )}

      {/* Saved Bills List */}
      {savedBills.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-800">
            {lang === 'ur' ? 'کوئی میٹر محفوظ نہیں ہے' : 'No Saved Meters Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {lang === 'ur'
              ? 'جب آپ بل چیک کریں گے تو "محفوظ کریں" کا بٹن دبا کر اپنا میٹر یہاں شامل کر سکتے ہیں۔'
              : 'Add your electricity or gas meters here so you can check them monthly in 1 second.'}
          </p>
          <button
            onClick={() => {
              // Add a sample meter
              onAddBill('mepco', '14151110234500', 'Home MEPCO');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
          >
            Add Demo Meter (Home MEPCO)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedBills.map((item) => {
            const comp = UTILITY_COMPANIES.find(c => c.id === item.companyId) || UTILITY_COMPANIES[0];
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {item.label}
                    </span>
                    <button
                      onClick={() => onRemoveBill(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Remove meter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">{comp.name}</span>
                    <span>·</span>
                    <span className="capitalize">{comp.category}</span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg font-mono text-xs text-slate-800 font-semibold mb-3">
                    Ref: {item.referenceNo}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Saved {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onCheckBill(comp, item.referenceNo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    <span>Check Bill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
