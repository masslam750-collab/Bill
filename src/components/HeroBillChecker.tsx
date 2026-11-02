import React, { useState, useMemo, memo, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  Check, 
  Zap, 
  Flame, 
  Droplet, 
  PhoneCall, 
  Bookmark,
  ChevronDown,
  Building2,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { UtilityCompany, SavedBill, UtilityCategory } from '../types';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';
import { Language, TRANSLATIONS } from '../utils/translations';
import { PeakHoursWidget } from './PeakHoursWidget';
import { detectCompanyFromReference, DetectionResult } from '../utils/discoDetector';

interface HeroBillCheckerProps {
  lang: Language;
  selectedCompany: UtilityCompany;
  onSelectCompany: (company: UtilityCompany) => void;
  onCheckBill: (company: UtilityCompany, refNo: string) => Promise<any> | void;
  onDownloadBill?: (company: UtilityCompany, refNo: string) => Promise<any> | void;
  onOpenPaymentDirect?: (company: UtilityCompany, refNo: string) => void;
  onOpenGuide: () => void;
  savedBills: SavedBill[];
}

export const HeroBillChecker: React.FC<HeroBillCheckerProps> = memo(({
  lang,
  selectedCompany,
  onSelectCompany,
  onCheckBill,
  onDownloadBill,
  onOpenPaymentDirect,
  onOpenGuide,
  savedBills
}) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState<UtilityCategory | 'all'>('electricity');
  const [referenceInput, setReferenceInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [detectedResult, setDetectedResult] = useState<DetectionResult | null>(null);
  const [showManualCompanyList, setShowManualCompanyList] = useState<boolean>(false);

  // Memoize filtered companies based on category
  const filteredCompanies = useMemo(() => {
    if (activeCategory === 'all') return UTILITY_COMPANIES;
    return UTILITY_COMPANIES.filter(comp => comp.category === activeCategory);
  }, [activeCategory]);

  // Real-time Auto-Detection from 14-digit reference number prefix
  useEffect(() => {
    const result = detectCompanyFromReference(referenceInput);
    setDetectedResult(result);
    if (result && result.company.id !== selectedCompany.id) {
      onSelectCompany(result.company);
      if (result.company.category !== activeCategory && activeCategory !== 'all') {
        setActiveCategory(result.company.category as UtilityCategory);
      }
    }
  }, [referenceInput]);

  const handleCompanyChange = (comp: UtilityCompany) => {
    onSelectCompany(comp);
    setErrorMsg('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
    setReferenceInput(val);
    setErrorMsg('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isChecking) return;
    
    const clean = referenceInput.trim();
    if (!clean) {
      setErrorMsg(lang === 'ur' ? 'برائے مہربانی 14 ہندسوں کا ریفرنس نمبر درج کریں' : 'Please enter a 14-digit reference number.');
      return;
    }

    if (clean.length < 8) {
      setErrorMsg(
        lang === 'ur'
          ? 'ریفرنس نمبر کم از کم 14 ہندسوں کا ہونا چاہیے۔'
          : 'Please enter a valid reference number.'
      );
      return;
    }

    setIsChecking(true);
    setErrorMsg('');

    // If auto-detected, make sure we use detected company
    const activeComp = detectedResult ? detectedResult.company : selectedCompany;

    try {
      await onCheckBill(activeComp, clean);
    } catch (err: any) {
      setErrorMsg(
        err.message === 'Bill Not Found'
          ? (lang === 'ur' 
              ? 'بل نہیں ملا (Bill Not Found) - درج کردہ 14 ہندسوں کا ریفرنس نمبر ریکارڈ میں موجود نہیں ہے۔' 
              : 'Bill Not Found. The provided reference number was not found on the network.')
          : (err.message || 'Bill Not Found')
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleLoadSample = (sampleCompId?: string) => {
    const targetComp = sampleCompId 
      ? (UTILITY_COMPANIES.find(c => c.id === sampleCompId) || selectedCompany)
      : selectedCompany;
    setReferenceInput(targetComp.sampleRef);
    setErrorMsg('');
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity pointer-events-none">
        <picture>
          <source srcSet="/src/assets/images/pakistan_grid_network.webp" type="image/webp" />
          <img
            src="/src/assets/images/pakistan_grid_network.webp"
            alt="Pakistan National Power Grid Network"
            loading="lazy"
            decoding="async"
            width={1200}
            height={670}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/95" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">
        {/* Real-time Peak Hours Banner placed inside the hero box */}
        <div className="mb-6">
          <PeakHoursWidget lang={lang} />
        </div>

        {/* Smart Auto-Detect Reference Input & Action Form (Primary Focus) */}
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-xl">
            {/* Header info with Time-Saving Auto-Detect Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ur' ? '14 ہندسوں کا ریفرنس نمبر درج کریں' : 'Enter 14-Digit Reference Number'}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'ur' 
                    ? 'کمپنی منتخب کرنے کی ضرورت نہیں — سسٹم خود کمپنی شناخت کرے گا' 
                    : 'No need to select company — auto-detected from prefix'}
                </span>
              </div>
            </div>

            {/* Reference input field - full width, large & clear */}
            <div className="relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <label htmlFor="refInput" className="font-medium text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>
                    {detectedResult 
                      ? (lang === 'ur' ? detectedResult.company.urduRefLabel : detectedResult.company.refLabel)
                      : (lang === 'ur' ? '14 ہندسوں کا ریفرنس نمبر' : '14-Digit Reference Number')}
                  </span>
                </label>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {referenceInput.length 
                    ? `${referenceInput.length} ${lang === 'ur' ? 'ہندسے درج ہو چکے' : 'digits entered'}`
                    : (lang === 'ur' ? '14 ہندسے (مثلاً 06154540709308)' : '14 digits (e.g. 06154540709308)')}
                </span>
              </div>

              <div className="relative">
                <input
                  id="refInput"
                  type="text"
                  value={referenceInput}
                  onChange={handleInputChange}
                  placeholder="06154540709308"
                  autoFocus
                  className="w-full px-10 py-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-mono text-lg sm:text-xl tracking-widest text-center placeholder:text-center placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                />
                {referenceInput && (
                  <button
                    type="button"
                    onClick={() => setReferenceInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 cursor-pointer transition-colors"
                    title="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Exact Auto-Detect Confirmation Message ("Ye MEPCO ka number hai") */}
              {detectedResult ? (
                <div className="mt-3 p-3.5 bg-emerald-950/90 border-2 border-emerald-500/80 rounded-xl flex items-center justify-between gap-3 text-white shadow-lg animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm border border-emerald-400/40"
                      style={{ backgroundColor: detectedResult.company.color || '#0284c7' }}
                    >
                      {detectedResult.company.shortName.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-emerald-300">
                          {lang === 'ur' ? detectedResult.messageUrdu : detectedResult.messageRoman}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                          <span>Auto-Detected</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {lang === 'ur' ? detectedResult.company.urduDescription : detectedResult.company.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end text-xs text-slate-300 shrink-0">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Helpline</span>
                    <a
                      href={`tel:${detectedResult.company.helpline.split('/')[0].trim()}`}
                      className="font-mono text-xs text-white font-bold hover:underline"
                    >
                      {detectedResult.company.helpline.split('/')[0]}
                    </a>
                  </div>
                </div>
              ) : referenceInput.length >= 2 ? (
                <div className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5 px-1">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {lang === 'ur' 
                      ? 'ریفرنس نمبر کے پہلے 4 ہندسے لکھتے ہی کمپنی خود بخود شناخت ہو جائے گی...' 
                      : 'Type the first 4 digits to auto-detect your DISCO power company...'}
                  </span>
                </div>
              ) : null}

              {errorMsg && (
                <div className="mt-2.5 p-3 rounded-lg bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Quick 1-Click Samples to test auto-detection */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/90 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'ur' ? 'ٹیسٹ کریں (نمونہ نمبر):' : 'Try Samples:'}
              </span>
              <button
                type="button"
                onClick={() => handleLoadSample('mepco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                MEPCO (0615...)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('lesco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                LESCO (0811...)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('iesco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                IESCO (0114...)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('fesco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                FESCO (1213...)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('gepco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                GEPCO (0712...)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('pesco')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 rounded-md text-xs cursor-pointer transition-colors font-mono"
              >
                PESCO (0626...)
              </button>
            </div>

            {/* Check Bill Button */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/90">
              <button
                type="submit"
                disabled={isChecking}
                className={`w-full py-3.5 px-4 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] ${
                  isChecking
                    ? 'bg-emerald-700 text-emerald-100 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 border border-emerald-500/50'
                }`}
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{lang === 'ur' ? 'بل تلاش ہو رہا ہے...' : 'Checking bill...'}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>
                      {detectedResult 
                        ? (lang === 'ur' ? `${detectedResult.company.name} کا بل چیک کریں` : `Check ${detectedResult.company.name} Bill`)
                        : t.checkBillBtn}
                    </span>
                  </>
                )}
              </button>

              {/* Minimal reference guide locator */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 px-1">
                <button
                  type="button"
                  onClick={onOpenGuide}
                  className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer text-slate-400"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.whereIsRef}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualCompanyList(prev => !prev)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{showManualCompanyList ? (lang === 'ur' ? 'دستی انتخاب چھپائیں' : 'Hide manual selection') : (lang === 'ur' ? 'یا دستی طور پر کمپنی منتخب کریں' : 'Or select company manually')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showManualCompanyList ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Optional Collapsible Manual Company Selection */}
            {showManualCompanyList && (
              <div className="mt-4 pt-4 border-t border-slate-800 animate-in fade-in">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  {lang === 'ur' ? 'دستی طور پر کمپنی منتخب کریں (اختیاری):' : 'Select Company Manually (Optional):'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {filteredCompanies.map(comp => {
                    const isSelected = comp.id === selectedCompany.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => handleCompanyChange(comp)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                          isSelected
                            ? 'bg-white text-slate-900 border-white shadow-md'
                            : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{comp.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Saved Bills Quick Select if available */}
        {savedBills.length > 0 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'ur' ? 'محفوظ شدہ میٹرز:' : 'Saved Meters:'}
            </span>
            {savedBills.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  const comp = UTILITY_COMPANIES.find(c => c.id === b.companyId) || selectedCompany;
                  onSelectCompany(comp);
                  setReferenceInput(b.referenceNo);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                <span className="font-semibold">{b.label}</span> ({b.referenceNo.substring(0, 6)}...)
              </button>
            ))}
          </div>
        )}

        {/* Step-by-Step Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
            <span className="font-bold text-white block mb-1">
              {lang === 'ur' ? '1. ریفرنس نمبر درج کریں' : '1. Enter Reference No'}
            </span>
            <span>
              {lang === 'ur' 
                ? 'اپنے پرانے بل پر موجود 14 ہندسوں کا ریفرنس نمبر بغیر کسی وقفے کے درج کریں۔'
                : 'Locate 14 digits printed in the top box of your bill paper without spaces.'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
            <span className="font-bold text-white block mb-1">
              {lang === 'ur' ? '2. ڈپلیکیٹ بل دیکھیں' : '2. Instant Duplicate Bill'}
            </span>
            <span>
              {lang === 'ur'
                ? 'مکمل بل بشمول یونٹس، ٹیرف، ٹیکسز اور آخری تاریخ کی رقم حاصل کریں۔'
                : 'Get exact bill preview with reading, FPA, TV fee, GST, and due dates.'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
            <span className="font-bold text-white block mb-1">
              {lang === 'ur' ? '3. پرنٹ یا محفوظ کریں' : '3. Print or Download PDF'}
            </span>
            <span>
              {lang === 'ur'
                ? 'ایک کلک پر آفیشل فارمیٹ میں پرنٹ کریں یا بینک/جاز کیش سے ادا کریں۔'
                : 'Print with authentic barcode ready for bank, EasyPaisa, or JazzCash payment.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
