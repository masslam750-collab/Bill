import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Droplet, 
  PhoneCall, 
  HelpCircle, 
  Bookmark, 
  Calculator, 
  Code2, 
  Search, 
  Check, 
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
  Info,
  CreditCard
} from 'lucide-react';
import { UtilityCompany, SavedBill, GeneratedBill } from './types';
import { UTILITY_COMPANIES } from './data/utilityCompanies';
import { generateDuplicateBill, fetchRealBill } from './utils/billGenerator';
import { Language, TRANSLATIONS } from './utils/translations';
import { Header } from './components/Header';
import { HeroBillChecker } from './components/HeroBillChecker';
import { BillViewModal } from './components/BillViewModal';
import { ReferenceGuideModal } from './components/ReferenceGuideModal';
import { UnitTariffCalculator } from './components/UnitTariffCalculator';
import { SavedBillsManager } from './components/SavedBillsManager';
import { CompanyDirectoryGrid } from './components/CompanyDirectoryGrid';
import { BillPaymentModal } from './components/BillPaymentModal';
import { PaymentCenter } from './components/PaymentCenter';
import { AdminPaymentVerification } from './components/AdminPaymentVerification';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('directory');
  const [selectedCompany, setSelectedCompany] = useState<UtilityCompany>(UTILITY_COMPANIES[0]); // default MEPCO
  const [activeBill, setActiveBill] = useState<GeneratedBill | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [savedBills, setSavedBills] = useState<SavedBill[]>([]);
  const [autoDownloadPdf, setAutoDownloadPdf] = useState<boolean>(false);
  // Load saved bills from localStorage & parse URL query params on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pakbill_saved_meters');
      if (stored) {
        setSavedBills(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const searchParams = new URLSearchParams(window.location.search);
    const companyParam = searchParams.get('company');
    const refParam = searchParams.get('ref');
    const langParam = searchParams.get('lang');
    const autoCheck = searchParams.get('autocheck');

    if (langParam === 'ur' || langParam === 'en') {
      setLang(langParam);
    }

    let targetComp = UTILITY_COMPANIES[0];
    if (companyParam) {
      const found = UTILITY_COMPANIES.find(c => c.id.toLowerCase() === companyParam.toLowerCase());
      if (found) {
        targetComp = found;
        setSelectedCompany(found);
      }
    }

    const payproStatus = searchParams.get('paypro_status');
    const payproRef = searchParams.get('ref') || refParam;

    if (payproStatus === 'SUCCESS') {
      const bill = generateDuplicateBill(targetComp, payproRef || targetComp.sampleRef);
      bill.paymentStatus = 'Paid';
      setActiveBill(bill);
      setIsPaymentModalOpen(true);
    } else if (refParam && autoCheck === 'true') {
      const bill = generateDuplicateBill(targetComp, refParam);
      setActiveBill(bill);
    }
  }, []);

  const handleSaveBill = React.useCallback((companyId: string, referenceNo: string, label: string) => {
    setSavedBills(prev => {
      const newBill: SavedBill = {
        id: `${companyId}_${referenceNo}_${Date.now()}`,
        companyId,
        referenceNo,
        label,
        addedAt: new Date().toISOString()
      };
      const updated = [newBill, ...prev.filter(b => b.referenceNo !== referenceNo)];
      try {
        localStorage.setItem('pakbill_saved_meters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleRemoveBill = React.useCallback((id: string) => {
    setSavedBills(prev => {
      const updated = prev.filter(b => b.id !== id);
      try {
        localStorage.setItem('pakbill_saved_meters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleCheckBill = React.useCallback(async (company: UtilityCompany, refNo: string) => {
    setSelectedCompany(company);
    setAutoDownloadPdf(false);
    const bill = await fetchRealBill(company, refNo);
    setActiveBill(bill);
    return bill;
  }, []);

  const handleDownloadBill = React.useCallback(async (company: UtilityCompany, refNo: string) => {
    setSelectedCompany(company);
    setAutoDownloadPdf(true);
    const bill = await fetchRealBill(company, refNo);
    setActiveBill(bill);
    return bill;
  }, []);

  const handlePayDirect = React.useCallback(async (company: UtilityCompany, refNo: string) => {
    setSelectedCompany(company);
    try {
      const bill = await fetchRealBill(company, refNo);
      setActiveBill(bill);
    } catch {
      const bill = generateDuplicateBill(company, refNo);
      setActiveBill(bill);
    }
    setIsPaymentModalOpen(true);
  }, []);

  const handleUpdateConsumerInfo = React.useCallback((updatedFields: Partial<GeneratedBill>) => {
    setActiveBill(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updatedFields
      };
    });
  }, []);

  const isAlreadySaved = activeBill 
    ? savedBills.some(b => b.referenceNo === activeBill.referenceNo)
    : false;

  // Standard Full-Featured Portal View
  return (
    <div className={`h-auto min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 ${lang === 'ur' ? 'font-urdu' : ''}`}>
      
      {/* Top Header with Integrated Utility Feature Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ur' : 'en')}
        onOpenGuide={() => setIsGuideOpen(true)}
        savedBillsCount={savedBills.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6 print:hidden flex-1 w-full">

        {/* Tab 1: Online Bill Checker */}
        {currentTab === 'check' && (
          <div className="space-y-8">
            <HeroBillChecker
              lang={lang}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
              onCheckBill={handleCheckBill}
              onDownloadBill={handleDownloadBill}
              onOpenPaymentDirect={handlePayDirect}
              onOpenGuide={() => setIsGuideOpen(true)}
              savedBills={savedBills}
            />

            {/* Official Naurduinbox Security & Exclusive Service Seal */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <span>{lang === 'ur' ? 'نور اردو ان باکس کی خصوصی بل سروس' : 'Official & Exclusive Service of Naurduinbox'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase font-mono">
                      Private & Secure
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                    {lang === 'ur'
                      ? 'یہ پورٹل خاص طور پر نور اردو ان باکس (Naurduinbox) کے صارفین کے لیے وقف ہے۔ کسی بھی غیر مجاز سائٹ پر اس کی کاپی یا ایمبیڈنگ کی ممانعت ہے۔'
                      : 'This portal is strictly exclusive to Naurduinbox visitors for safe, direct duplicate utility bill verification across Pakistan.'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ur' ? 'تصدیق شدہ برانڈ سروس' : 'Verified Brand Portal'}</span>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-lg font-black text-slate-900 mb-4">
                {lang === 'ur' ? 'اکثر پوچھے گئے سوالات (FAQs)' : 'Frequently Asked Questions about Online Bills in Pakistan'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">
                    What is a 14-digit reference number in electricity bills?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    The 14-digit reference number is the unique customer identifier assigned by power distribution companies (MEPCO, LESCO, FESCO, IESCO, GEPCO, PESCO, etc.). It consists of batch number, sub-division code, and consumer sequence.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">
                    Can I pay this duplicate bill in bank branches or mobile apps?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Yes! The reference number and consumer ID printed on this duplicate bill voucher can be used to pay immediately via JazzCash, EasyPaisa, Nayapay, Sadapay, and all Pakistani bank apps via 1Bill.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">
                    How do I calculate taxes on my electricity bill?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Electricity bills in Pakistan include Base Tariff, Fuel Price Adjustment (FPA), FC Surcharge, Electricity Duty (1.5%), PTV fee (Rs. 35), and General Sales Tax (GST 18% on unprotected consumers). Use our tariff calculator above to see your exact bill breakdown.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">
                    {lang === 'ur' ? 'نور اردو ان باکس پر ڈپلیکیٹ بل کیسے پرنٹ کریں؟' : 'How can I print or save a duplicate bill on Naurduinbox?'}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {lang === 'ur' 
                      ? 'اپنا 14 ہندسوں کا ریفرنس نمبر درج کر کے "بل چیک کریں" دبائیں۔ بل کھلنے کے بعد اوپر دیے گئے "Print / Save as PDF" بٹن پر کلک کر کے پرنٹ حاصل کریں۔'
                      : 'Enter your 14-digit reference number, click "Check & Download Bill", and use the "Print / Save as PDF" button inside the duplicate bill viewer.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pay Bills Online */}
        {currentTab === 'pay' && (
          <PaymentCenter
            lang={lang}
            onPayBill={handlePayDirect}
            onSelectCompany={setSelectedCompany}
          />
        )}

        {/* Tab 3: Company Directory (DISCOs & Gas) */}
        {currentTab === 'directory' && (
          <CompanyDirectoryGrid
            onSelectCompany={(c) => {
              setSelectedCompany(c);
              setCurrentTab('check');
            }}
            lang={lang}
          />
        )}

        {/* Tab 4: NEPRA Tariff Calculator */}
        {currentTab === 'calculator' && (
          <UnitTariffCalculator lang={lang} />
        )}

        {/* Tab 5: Saved Meters */}
        {currentTab === 'saved' && (
          <SavedBillsManager
            savedBills={savedBills}
            onCheckBill={handleCheckBill}
            onRemoveBill={handleRemoveBill}
            onAddBill={handleSaveBill}
            lang={lang}
          />
        )}

        {/* Tab 6: Payment Verification (Admin) */}
        {currentTab === 'admin' && (
          <AdminPaymentVerification
            lang={lang}
            onViewBill={(comp, ref) => {
              const found = UTILITY_COMPANIES.find(c => c.id === comp) || UTILITY_COMPANIES[0];
              handleCheckBill(found, ref);
            }}
          />
        )}

      </main>

      {/* Bill View / Duplicate Bill Modal */}
      <BillViewModal
        bill={activeBill}
        isOpen={!!activeBill && !isPaymentModalOpen}
        onClose={() => {
          setActiveBill(null);
          setAutoDownloadPdf(false);
        }}
        lang={lang}
        onSaveBill={handleSaveBill}
        isAlreadySaved={isAlreadySaved}
        onOpenPayment={() => setIsPaymentModalOpen(true)}
        onUpdateConsumerInfo={handleUpdateConsumerInfo}
        autoDownload={autoDownloadPdf}
        onResetAutoDownload={() => setAutoDownloadPdf(false)}
      />

      {/* Bill Payment Modal */}
      <BillPaymentModal
        bill={activeBill}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        lang={lang}
        onNavigateToAdmin={() => setCurrentTab('admin')}
        onPaymentSuccess={(paidBill, txId) => {
          if (activeBill) {
            setActiveBill({
              ...activeBill,
              paymentStatus: 'Paid'
            });
          }
        }}
      />

      {/* Reference Number Visual Locator Guide Modal */}
      <ReferenceGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      {/* Clean Footer */}
      <Footer
        lang={lang}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

    </div>
  );
}
