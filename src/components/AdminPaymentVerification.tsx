import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Smartphone, 
  Building2, 
  FileText, 
  Eye, 
  X, 
  MessageSquare, 
  Mail, 
  Printer, 
  Sparkles,
  AlertCircle,
  Filter,
  ArrowUpRight,
  Key,
  History,
  Play,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PaymentSubmission } from '../types';
import { Language } from '../utils/translations';
import { checkBillStatus, getCronStatus, triggerCronNow, CronStatus } from '../utils/bill-inquiry';

interface AdminPaymentVerificationProps {
  lang: Language;
  onViewBill?: (companyId: string, refNo: string) => void;
}

export const AdminPaymentVerification: React.FC<AdminPaymentVerificationProps> = ({
  lang,
  onViewBill
}) => {
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending Verification' | 'PAID' | 'Rejected'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<{ url: string; title: string } | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isAutoChecking, setIsAutoChecking] = useState<string | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<PaymentSubmission | null>(null);

  // 10-Minute Auto Cron State
  const [cronStatus, setCronStatus] = useState<CronStatus | null>(null);
  const [isRunningCronManually, setIsRunningCronManually] = useState(false);
  const [showCronLogs, setShowCronLogs] = useState(false);

  // API Key Management Modal State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [kuickpayInstId, setKuickpayInstId] = useState('KP_INST_DEMO_001');
  const [kuickpayKey, setKuickpayKey] = useState('');
  const [kuickpaySecret, setKuickpaySecret] = useState('');
  const [onepayClientId, setOnepayClientId] = useState('');
  const [onepaySecret, setOnepaySecret] = useState('');
  const [isSavingKeys, setIsSavingKeys] = useState(false);

  // Load submissions from API & localStorage fallback
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payment/list');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
          localStorage.setItem('pakbill_payment_submissions', JSON.stringify(data.submissions));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not load from API, reading local storage:', err);
    }

    // LocalStorage fallback
    try {
      const local = localStorage.getItem('pakbill_payment_submissions');
      if (local) {
        setSubmissions(JSON.parse(local));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  };

  // Polling for cron status & submissions
  const refreshCronAndData = async () => {
    const cron = await getCronStatus();
    if (cron) setCronStatus(cron);
    await fetchSubmissions();
  };

  useEffect(() => {
    refreshCronAndData();
    // Auto poll every 15 seconds so admin sees 10-minute cron results live
    const interval = setInterval(refreshCronAndData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Trigger 10-Minute Cron Manually Now
  const handleTriggerCronNow = async () => {
    setIsRunningCronManually(true);
    try {
      const result = await triggerCronNow();
      setActionSuccessMsg(result.message || '10-Minute Auto Cron completed successfully!');
      await refreshCronAndData();
    } catch (err: any) {
      setActionSuccessMsg(`Cron trigger error: ${err.message}`);
    } finally {
      setIsRunningCronManually(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  // Save Kuickpay / 1Pay API keys dynamically
  const handleSaveApiKeys = async () => {
    setIsSavingKeys(true);
    try {
      const res = await fetch('/api/payment/update-api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kuickpay: {
            institutionId: kuickpayInstId,
            apiKey: kuickpayKey || undefined,
            apiSecret: kuickpaySecret || undefined,
          },
          onepay: {
            clientId: onepayClientId || undefined,
            clientSecret: onepaySecret || undefined,
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionSuccessMsg('API credentials updated in bill-inquiry.js memory! Live calls active.');
        setShowKeyModal(false);
        await refreshCronAndData();
      }
    } catch (err: any) {
      setActionSuccessMsg(`Failed to save keys: ${err.message}`);
    } finally {
      setIsSavingKeys(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'PAID' | 'Rejected', notes?: string) => {
    try {
      const res = await fetch('/api/payment/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, notes })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissions(prev => 
            prev.map(item => item.id === id ? { ...item, status: newStatus, verifiedAt: new Date().toISOString() } : item)
          );
          setActionSuccessMsg(`Status updated to ${newStatus}`);
          setTimeout(() => setActionSuccessMsg(null), 3000);
          return;
        }
      }
    } catch (err) {
      console.warn('API update failed, updating locally:', err);
    }

    // Local fallback update
    setSubmissions(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, status: newStatus, verifiedAt: new Date().toISOString() } : item
      );
      localStorage.setItem('pakbill_payment_submissions', JSON.stringify(updated));
      return updated;
    });
    setActionSuccessMsg(`Status updated to ${newStatus}`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // 1LINK Bill Inquiry Auto-Verification
  const handleAutoVerify1Link = async (submission: PaymentSubmission) => {
    setIsAutoChecking(submission.id);
    try {
      const result = await checkBillStatus(submission.referenceNo, submission.companyId);

      if (result.status === 'PAID') {
        await handleUpdateStatus(
          submission.id, 
          'PAID', 
          `Auto-verified via 1LINK Inquiry (${result.transactionId || 'Confirmed'})`
        );
        setActionSuccessMsg(`1LINK Verified: Bill for Ref ${submission.referenceNo} is PAID!`);
      } else {
        setActionSuccessMsg(`1LINK Response: Status is UNPAID on 1LINK network.`);
      }
    } catch (err: any) {
      setActionSuccessMsg(`1LINK Inquiry notice: ${err.message || 'Check failed'}`);
    } finally {
      setIsAutoChecking(null);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  // WhatsApp share message generator
  const getWhatsAppShareUrl = (sub: PaymentSubmission) => {
    const text = `*PAKBILL PAYMENT VERIFIED*\n\n` +
      `✓ Status: PAID\n` +
      `• Company: ${sub.companyName}\n` +
      `• Reference No: ${sub.referenceNo}\n` +
      `• Customer Name: ${sub.customerName}\n` +
      `• Amount Paid: Rs. ${sub.amount.toLocaleString()}\n` +
      `• Transaction ID: ${sub.transactionId}\n` +
      `• Date: ${new Date(sub.submittedAt).toLocaleDateString()}\n` +
      `• Channel: ${sub.channel}\n\n` +
      `Thank you for paying via Link Model on PakBill.`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  // Email share generator
  const getEmailShareUrl = (sub: PaymentSubmission) => {
    const subject = `PakBill Payment Receipt - ${sub.companyName} Ref: ${sub.referenceNo}`;
    const body = `Dear Customer,\n\nYour utility bill payment has been VERIFIED and marked as PAID.\n\n` +
      `Company: ${sub.companyName}\n` +
      `Reference Number: ${sub.referenceNo}\n` +
      `Customer Name: ${sub.customerName}\n` +
      `Amount: Rs. ${sub.amount.toLocaleString()}\n` +
      `Transaction ID: ${sub.transactionId}\n` +
      `Verified Date: ${new Date().toLocaleDateString()}\n\n` +
      `Best regards,\nPakBill Verification Desk`;
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const filteredSubmissions = submissions.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      item.referenceNo.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.transactionId.toLowerCase().includes(q) ||
      item.companyName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = submissions.filter(s => s.status === 'Pending Verification').length;
  const paidCount = submissions.filter(s => s.status === 'PAID').length;
  const rejectedCount = submissions.filter(s => s.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'ایڈمن کنٹرول پینل · تصدیق کا مرکز' : 'Admin Dashboard · Payment Verification'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'ur' ? 'ادائیگیوں کی دستی و خودکار تصدیق' : 'Payment Verification Dashboard'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {lang === 'ur'
                ? 'جاز کیش، ایزی پیسہ اور بینک ایپس کے ذریعے جمع کرائے گئے ٹرانزیکشن آئی ڈی اور رسیدوں کی تصدیق کریں۔ 1LINK اے پی آئی کے ذریعے براہِ راست خودکار جانچ بھی دستیاب ہے۔'
                : 'Review customer payments submitted via JazzCash, Easypaisa, and Bank Apps (Link Model), or run instant 1LINK Bill Inquiry auto-verification.'}
            </p>
          </div>

          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-700 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{lang === 'ur' ? 'تازہ کریں' : 'Refresh Records'}</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Submissions</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{submissions.length}</div>
          </div>

          <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-800/60">
            <span className="text-[11px] text-amber-300 font-semibold uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Pending Review</span>
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
          </div>

          <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/60">
            <span className="text-[11px] text-emerald-300 font-semibold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Marked as PAID</span>
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{paidCount}</div>
          </div>

          <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-800/50">
            <span className="text-[11px] text-rose-300 font-semibold uppercase flex items-center gap-1.5">
              <XCircle className="w-3 h-3 text-rose-400" />
              <span>Rejected</span>
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* 10-Minute Auto Cron Monitor & Control Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/60 rounded-2xl p-5 shadow-lg text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                10-Minute Auto Cron Job Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                bill-inquiry.js
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {lang === 'ur'
                ? 'یہ سسٹم ہر 10 منٹ بعد تمام پینڈنگ بلز کو 1LINK / Kuickpay / 1Pay کے ذریعے خودکار طریقے سے چیک کر کے PAID مارک کر دیتا ہے۔'
                : 'Automated 10-minute cron actively checks pending bills against the 1LINK network (Kuickpay / 1Pay.pk) and marks verified bills as PAID automatically.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1 font-mono">
              <div>
                <span className="text-slate-500">Last Run: </span>
                <span className="text-slate-200">
                  {cronStatus?.lastRunAt 
                    ? new Date(cronStatus.lastRunAt).toLocaleTimeString() 
                    : 'Just now (Startup scan)'}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div>
                <span className="text-slate-500">Next Auto-Run: </span>
                <span className="text-emerald-300 font-bold">
                  {cronStatus?.nextRunAt 
                    ? new Date(cronStatus.nextRunAt).toLocaleTimeString() 
                    : 'Within 10 minutes'}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div>
                <span className="text-slate-500">Auto-Verified: </span>
                <span className="text-emerald-400 font-bold">{cronStatus?.totalAutoVerifiedCount || 0} bills</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleTriggerCronNow}
              disabled={isRunningCronManually}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-initial"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningCronManually ? 'animate-spin' : ''}`} />
              <span>{isRunningCronManually ? 'Running Cron...' : 'Run Cron Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 lg:flex-initial"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Kuickpay / 1Pay Keys</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCronLogs(!showCronLogs)}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="View Cron Activity Logs"
            >
              <History className="w-3.5 h-3.5" />
              <span>Logs ({cronStatus?.logs?.length || 0})</span>
              {showCronLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

        </div>

        {/* Expandable Cron Activity Logs Drawer */}
        {showCronLogs && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                10-Minute Cron Execution Log (Auto-Polling History)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Total cron cycles completed: {cronStatus?.totalRuns || 0}
              </span>
            </div>
            
            {cronStatus?.logs && cronStatus.logs.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {cronStatus.logs.map((log, idx) => (
                  <div key={idx} className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/60 text-[11px] font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-emerald-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                    {log.verifiedCount > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold shrink-0">
                        +{log.verifiedCount} PAID
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 font-mono italic p-2 bg-slate-950/40 rounded-lg">
                Cron engine is running. Next auto-check will record logs here.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Action Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Pending Verification', 'PAID', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' && 'All Records'}
              {tab === 'Pending Verification' && `Pending (${pendingCount})`}
              {tab === 'PAID' && `Verified PAID (${paidCount})`}
              {tab === 'Rejected' && `Rejected (${rejectedCount})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ur' ? 'ریفرنس، نام یا TID سے تلاش کریں...' : 'Search Ref, Name, or TID...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Records Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Loading payment records...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-bold text-slate-700">No payment verification records found.</p>
            <p className="text-slate-400 text-[11px]">
              When customers submit payment TID from JazzCash, Easypaisa, or Bank apps, they appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Reference & Company</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Channel & Transaction ID</th>
                  <th className="py-3 px-3 text-center">Receipt Image</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredSubmissions.map((sub) => {
                  const isPending = sub.status === 'Pending Verification';
                  const isPaid = sub.status === 'PAID';
                  const isRejected = sub.status === 'Rejected';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Date / Time */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        <div>{new Date(sub.submittedAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Reference & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900">{sub.referenceNo}</span>
                          <button
                            onClick={() => handleCopy(sub.referenceNo, `ref-${sub.id}`)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title="Copy Reference Number"
                          >
                            {copiedId === `ref-${sub.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <span>{sub.companyName}</span>
                          {onViewBill && (
                            <button
                              onClick={() => onViewBill(sub.companyId, sub.referenceNo)}
                              className="text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer inline-flex items-center"
                            >
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 max-w-[180px] truncate" title={sub.customerName}>
                          {sub.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400">Due: {sub.dueDate}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-black text-sm text-slate-900">
                          Rs. {sub.amount.toLocaleString()}
                        </div>
                      </td>

                      {/* Channel & Transaction ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {sub.transactionId}
                          </span>
                          <button
                            onClick={() => handleCopy(sub.transactionId, `tid-${sub.id}`)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title="Copy Transaction ID"
                          >
                            {copiedId === `tid-${sub.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                          <span>{sub.channel} Link Model</span>
                          {sub.autoVerified && (
                            <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono">
                              1LINK Auto
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Receipt Image Thumbnail */}
                      <td className="py-3.5 px-3 text-center">
                        {sub.receiptImage ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptImage({ url: sub.receiptImage!, title: `Receipt: ${sub.customerName} (${sub.referenceNo})` })}
                            className="group relative inline-block rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer shadow-2xs"
                          >
                            <img
                              src={sub.receiptImage}
                              alt="Customer Receipt"
                              loading="lazy"
                              decoding="async"
                              className="w-10 h-10 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No receipt attached</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Pending Verification</span>
                          </span>
                        )}
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>PAID</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1LINK Auto-Check Button */}
                          <button
                            type="button"
                            onClick={() => handleAutoVerify1Link(sub)}
                            disabled={isAutoChecking === sub.id}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="Auto-check bill status directly with 1LINK Bill Inquiry"
                          >
                            <Sparkles className={`w-3 h-3 text-amber-600 ${isAutoChecking === sub.id ? 'animate-spin' : ''}`} />
                            <span>{isAutoChecking === sub.id ? 'Checking...' : '1LINK Check'}</span>
                          </button>

                          {/* Mark as PAID */}
                          {sub.status !== 'PAID' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(sub.id, 'PAID')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark as PAID</span>
                            </button>
                          )}

                          {/* Reject */}
                          {sub.status !== 'Rejected' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(sub.id, 'Rejected')}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border border-rose-200"
                            >
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Verified Paid Actions (WhatsApp / Receipt) */}
                          {isPaid && (
                            <div className="flex items-center gap-1">
                              <a
                                href={getWhatsAppShareUrl(sub)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                                title="Send Paid Receipt on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              </a>
                              <a
                                href={getEmailShareUrl(sub)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Send Email Receipt"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setActiveReceiptModal(sub)}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                                title="View & Print Official Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full-Size Receipt Image Modal */}
      {selectedReceiptImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs truncate max-w-md">{selectedReceiptImage.title}</span>
              <button
                onClick={() => setSelectedReceiptImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-100">
              <img
                src={selectedReceiptImage.url}
                alt="Receipt Full View"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReceiptImage(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Verification Receipt Printable Modal */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none">
            {/* Header */}
            <div className="bg-emerald-800 text-white p-5 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="font-black text-lg">OFFICIAL PAYMENT RECEIPT</h3>
              <p className="text-xs text-emerald-200">PakBill 1Link Direct Verification System</p>
            </div>

            {/* Receipt Details */}
            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider">Amount Paid</span>
                <span className="text-2xl font-black text-emerald-950 font-mono">
                  Rs. {activeReceiptModal.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Status: VERIFIED & PAID</span>
              </div>

              <div className="divide-y divide-slate-100 text-slate-700">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Transaction ID (TID):</span>
                  <span className="font-mono font-bold text-slate-900">{activeReceiptModal.transactionId}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Reference Number:</span>
                  <span className="font-mono font-bold text-slate-900">{activeReceiptModal.referenceNo}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Utility Company:</span>
                  <span className="font-semibold text-slate-900">{activeReceiptModal.companyName}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Consumer Name:</span>
                  <span className="font-semibold text-slate-900 text-right">{activeReceiptModal.customerName}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-semibold text-slate-900">{activeReceiptModal.channel} App (Link Model)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Verification Date:</span>
                  <span className="font-semibold text-slate-900">
                    {activeReceiptModal.verifiedAt 
                      ? new Date(activeReceiptModal.verifiedAt).toLocaleString() 
                      : new Date().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 text-center leading-relaxed">
                Money deposited directly to {activeReceiptModal.companyName} account via 1Bill network. 
                Keep this verification voucher for your official utility records.
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
              <a
                href={getWhatsAppShareUrl(activeReceiptModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Configuration Modal (Kuickpay / 1Pay.pk) */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">1LINK Aggregator API Setup</h3>
                  <p className="text-[11px] text-slate-300">Kuickpay / 1Pay.pk live credentials for bill-inquiry.js</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              
              {/* Instructions banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kuickpay ya 1Pay.pk API Keys Paste Karein</span>
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Aap direct project ki root file <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold">/bill-inquiry.js</code> me bhi apni API Key aur Secret paste kar sakte hain, ya niche form me daal kar &quot;Save Credentials&quot; par click karein:
                </p>
              </div>

              {/* Section 1: Kuickpay (1Bill Aggregator) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>1. Kuickpay Configuration</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1Bill Partner</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Kuickpay Institution ID
                    </label>
                    <input
                      type="text"
                      value={kuickpayInstId}
                      onChange={(e) => setKuickpayInstId(e.target.value)}
                      placeholder="e.g. KP_INST_10023"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Kuickpay API Key
                    </label>
                    <input
                      type="text"
                      value={kuickpayKey}
                      onChange={(e) => setKuickpayKey(e.target.value)}
                      placeholder="Paste your live Kuickpay API Key..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Kuickpay Secret Key
                    </label>
                    <input
                      type="password"
                      value={kuickpaySecret}
                      onChange={(e) => setKuickpaySecret(e.target.value)}
                      placeholder="Paste your live Kuickpay Secret..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: 1Pay.pk Configuration */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>2. 1Pay.pk Configuration</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1LINK Gateway</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      1Pay Client ID
                    </label>
                    <input
                      type="text"
                      value={onepayClientId}
                      onChange={(e) => setOnepayClientId(e.target.value)}
                      placeholder="Paste 1Pay Client ID..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      1Pay Client Secret
                    </label>
                    <input
                      type="password"
                      value={onepaySecret}
                      onChange={(e) => setOnepaySecret(e.target.value)}
                      placeholder="Paste 1Pay Client Secret..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-100 p-3 rounded-lg font-mono">
                💡 <span className="font-semibold text-slate-700">Note:</span> Jab tak live keys nahi miltin, system standby mode me rahay ga aur 10 minute ka cron job verify hone wale bills ko auto PAID mark karta rahay ga.
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveApiKeys}
                disabled={isSavingKeys}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSavingKeys ? 'Saving...' : 'Save & Connect Keys'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
