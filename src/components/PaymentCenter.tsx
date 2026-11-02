import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Clock,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { UtilityCompany } from '../types';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';
import { Language } from '../utils/translations';

import { detectCompanyFromReference } from '../utils/discoDetector';

interface PaymentCenterProps {
  lang: Language;
  onPayBill: (company: UtilityCompany, refNo: string) => void;
  onSelectCompany: (company: UtilityCompany) => void;
}

export const PaymentCenter: React.FC<PaymentCenterProps> = ({
  lang,
  onPayBill,
  onSelectCompany
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('mepco');
  const [refInput, setRefInput] = useState<string>('06154540709308');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const activeComp = UTILITY_COMPANIES.find(c => c.id === selectedCompId) || UTILITY_COMPANIES[0];

  const handleCompanySelect = (comp: UtilityCompany) => {
    setSelectedCompId(comp.id);
    setRefInput(comp.sampleRef);
    setErrorMsg('');
    onSelectCompany(comp);
  };

  const handleRefChange = (val: string) => {
    const clean = val.replace(/[^0-9a-zA-Z]/g, '');
    setRefInput(clean);
    setErrorMsg('');
    // Auto-detect DISCO from reference number in background without showing badge
    const detected = detectCompanyFromReference(clean);
    if (detected) {
      setSelectedCompId(detected.company.id);
      onSelectCompany(detected.company);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = refInput.trim();
    if (!clean) {
      setErrorMsg(lang === 'ur' ? 'برائے مہربانی ریفرنس نمبر درج کریں' : 'Please enter reference number');
      return;
    }
    setErrorMsg('');
    onPayBill(activeComp, clean);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ur' ? 'محفوظ و تصدیق شدہ ادائیگی گیٹ وے' : '100% Encrypted & SBP Compliant Payment Gateway'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            {lang === 'ur' 
              ? 'پاکستان کے تمام بجلی، گیس و واسا بل آن لائن ادا کریں' 
              : 'Pay All Pakistan Utility Bills Online Instantly'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'ur'
              ? 'جاز کیش، ایزی پیسہ، 1Link 1Bill، تمام پاکستانی بینک، ڈیبٹ/کریڈٹ کارڈ، سادہ پے، نیا پے اور راست کیو آر کوڈ کے ذریعے اپنا بل فوری ادا کریں۔'
              : 'Pay directly via JazzCash, EasyPaisa, 1Bill, Meezan, HBL, UBL, Alfalah, Visa, Mastercard, SadaPay, NayaPay, and Raast Instant QR.'}
          </p>
        </div>

        {/* Quick Pay Box */}
        <div className="mt-6 bg-slate-950/90 backdrop-blur-md p-5 rounded-xl border border-slate-700/80 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'ur' ? 'کمپنی منتخب کریں:' : 'Select Utility Company:'}
                </label>
                <select
                  value={selectedCompId}
                  onChange={(e) => {
                    const found = UTILITY_COMPANIES.find(c => c.id === e.target.value);
                    if (found) handleCompanySelect(found);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <optgroup label="Electricity DISCOs (بجلی کمپنیاں)">
                    {UTILITY_COMPANIES.filter(c => c.category === 'electricity').map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.shortName})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Gas & WASA (گیس اور واسا)">
                    {UTILITY_COMPANIES.filter(c => c.category !== 'electricity').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'ur' ? activeComp.urduRefLabel : activeComp.refLabel}:
                </label>
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => handleRefChange(e.target.value)}
                  placeholder={activeComp.refFormatExample}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ur' ? 'بل کی تفصیلات اور ادائیگی شروع کریں' : 'Fetch Bill & Proceed to Pay Securely'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 5 Channels Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {lang === 'ur' ? 'ادائیگی کے تمام ذرائع (Payment Methods)' : 'Accepted Payment Channels Across Pakistan'}
          </h3>
          <p className="text-xs text-slate-600">
            {lang === 'ur' ? 'آپ مندرجہ ذیل تمام محفوظ طریقوں سے اپنا بل باآسانی ادا کر سکتے ہیں:' : 'Choose any verified channel to pay your duplicate utility bill:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* JazzCash & EasyPaisa */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs border border-amber-200">
                JC/EP
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Instant *786#
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">JazzCash &amp; EasyPaisa</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pay using the mobile app or dial USSD code (*786# for JazzCash or *786# for EasyPaisa) under Bill Payments &gt; Electricity.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant confirmation SMS received</span>
            </div>
          </div>

          {/* 1Link 1Bill All Banks */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs border border-blue-200">
                1Link
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                All 38+ Banks
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">1Link 1Bill &amp; Mobile Banking</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Available in Meezan, HBL, UBL, Bank Alfalah, MCB, Allied Bank, Askari, Faysal, and BOP mobile applications &amp; ATMs.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Use 100054 + Reference number</span>
            </div>
          </div>

          {/* Visa, Mastercard & PayPak */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs border border-emerald-200">
                CARD
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                3D Secure OTP
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Debit &amp; Credit Cards</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pay with any Pakistani or International Visa, Mastercard, or PayPak card protected with 256-bit bank encryption.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>State Bank 3D OTP Verification</span>
            </div>
          </div>

          {/* Raast QR Code Instant */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs border border-teal-200">
                RAAST
              </div>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                Zero Fees
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Raast Instant QR Scanner</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Scan the 1Bill Raast QR code using any banking or wallet app on your smartphone to pay with zero extra surcharges.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>SBP Raast Real-time Settlement</span>
            </div>
          </div>

          {/* SadaPay & NayaPay */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-orange-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-black text-xs border border-orange-200">
                EMI
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                SadaPay / NayaPay
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">SadaPay &amp; NayaPay Wallets</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Open SadaPay or NayaPay &gt; Payments &gt; Bills &gt; Select DISCO &gt; Enter Reference Number &gt; Instant 1-tap payment.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free instant receipts</span>
            </div>
          </div>

          {/* Cash at Retailers */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-200">
                SHOP
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                Cash Payment
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">NADRA e-Sahulat &amp; Agents</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Visit any nearby JazzCash / EasyPaisa retailer shop, NADRA e-Sahulat kiosk, or Pakistan Post Office branch with your reference number.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Physical stamped slip provided</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Guarantees */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              {lang === 'ur' ? '100% محفوظ و سرکاری طور پر تصدیق شدہ' : '100% Officially Regulated & Secure'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur' 
                ? 'تمام ادائیگیاں 1Link نیٹ ورک اور اسٹیٹ بینک آف پاکستان کی 3D سیکیور ہدایات کے مطابق محفوظ کی جاتی ہیں۔'
                : 'All transactions are routed via 1Link and State Bank of Pakistan verified banking switches.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const clean = refInput.trim() || activeComp.sampleRef;
            onPayBill(activeComp, clean);
          }}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          {lang === 'ur' ? 'ابھی بل ادا کریں' : 'Pay a Bill Now'}
        </button>
      </div>
    </div>
  );
};
