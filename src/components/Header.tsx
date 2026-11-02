import React from 'react';
import { 
  Zap, 
  Globe, 
  Search, 
  CreditCard, 
  Layers, 
  Calculator, 
  Bookmark, 
  Shield
} from 'lucide-react';
import { Language } from '../utils/translations';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenGuide: () => void;
  savedBillsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  onOpenGuide,
  savedBillsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => onSelectTab('directory')}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold shadow-xs">
              <Zap className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
                Naurdu<span className="text-emerald-600">inbox</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Buttons (Directory first as requested) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => onSelectTab('directory')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'directory' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={lang === 'ur' ? 'تمام یوٹیلیٹی کمپنیاں (بجلی، گیس، واسا)' : 'Company Directory (DISCOs & Gas)'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'ڈائریکٹری' : 'Directory'}</span>
            </button>

            <button
              onClick={() => onSelectTab('check')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'check' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={lang === 'ur' ? 'آن لائن بل چیک کریں' : 'Online Bill Checker'}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'بل چیک' : 'Check Bill'}</span>
            </button>

            <button
              onClick={() => onSelectTab('pay')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'pay' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold'
              }`}
              title={lang === 'ur' ? 'آن لائن بل ادا کریں' : 'Pay Utility Bills Online'}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ur' ? 'بل ادائیگی' : 'Pay Bills'}</span>
            </button>

            <button
              onClick={() => onSelectTab('calculator')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'calculator' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={lang === 'ur' ? 'نیپرا یونٹ و ٹیرف کیلکولیٹر' : 'NEPRA Tariff Calculator'}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'ٹیرف کیلکولیٹر' : 'NEPRA Tariff Calculator'}</span>
            </button>

            <button
              onClick={() => onSelectTab('saved')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'saved' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={lang === 'ur' ? 'محفوظ کردہ میٹرز' : 'Saved Meters'}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'محفوظ شدہ میٹرز' : 'Saved Meters'}</span>
              {savedBillsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px]">
                  {savedBillsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentTab === 'admin' 
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300'
              }`}
              title={lang === 'ur' ? 'پیمنٹ ویریفکیشن (ایڈمن)' : 'Payment Verification (Admin)'}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'تصدیق' : 'Verify'}</span>
            </button>
          </div>

          {/* Zone 3: Language & Guide Action */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Toggle Urdu / English"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>
            <button
              onClick={onOpenGuide}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>{lang === 'ur' ? 'ریفرنس گائیڈ' : 'Reference Guide'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
