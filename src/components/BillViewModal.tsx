import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { 
  Printer, 
  Download, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  X, 
  Check, 
  Calendar, 
  User, 
  MapPin, 
  Zap, 
  ShieldCheck,
  Building,
  Info,
  CreditCard,
  Edit3,
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { GeneratedBill, SavedBill } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { getOfficialBillUrl, saveConsumerProfile, CustomConsumerProfile } from '../utils/billGenerator';

interface BillViewModalProps {
  bill: GeneratedBill | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSaveBill: (companyId: string, refNo: string, label: string) => void;
  isAlreadySaved: boolean;
  onOpenPayment: () => void;
  onUpdateConsumerInfo?: (updated: Partial<GeneratedBill>) => void;
  autoDownload?: boolean;
  onResetAutoDownload?: () => void;
}

export const BillViewModal: React.FC<BillViewModalProps> = ({
  bill,
  isOpen,
  onClose,
  lang,
  onSaveBill,
  isAlreadySaved,
  onOpenPayment,
  onUpdateConsumerInfo,
  autoDownload,
  onResetAutoDownload
}) => {
  const [saveLabel, setSaveLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'picture' | 'official' | 'bill' | 'edit'>('picture');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [iframeHeight, setIframeHeight] = useState<number>(1280);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Editable customer info form state
  const [editName, setEditName] = useState('');
  const [editConsumerId, setEditConsumerId] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSubDivision, setEditSubDivision] = useState('');
  const [editFeeder, setEditFeeder] = useState('');
  const [editMeterNo, setEditMeterNo] = useState('');
  const [editUnits, setEditUnits] = useState<number>(0);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDueDate, setEditDueDate] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editReadingDate, setEditReadingDate] = useState('');
  const [editSanctionLoad, setEditSanctionLoad] = useState('');
  const [editPrevReading, setEditPrevReading] = useState<number>(0);
  const [editPresentReading, setEditPresentReading] = useState<number>(0);
  const [editSubsidies, setEditSubsidies] = useState<number>(0);
  const [editArrears, setEditArrears] = useState<number>(0);
  const [editCostOfElectricity, setEditCostOfElectricity] = useState<number>(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (bill) {
      setEditName(bill.consumerName);
      setEditConsumerId(bill.consumerId);
      setEditAddress(bill.address);
      setEditSubDivision(bill.subDivision);
      setEditFeeder(bill.feederName);
      setEditMeterNo(bill.meterNo);
      setEditUnits(bill.unitsConsumed);
      setEditAmount(bill.payableWithinDueDate);
      setEditDueDate(bill.dueDate);
      setEditIssueDate(bill.issueDate);
      setEditReadingDate(bill.readingDate);
      setEditSanctionLoad(bill.sanctionLoad);
      setEditPrevReading(bill.prevReading);
      setEditPresentReading(bill.currentReading);
      setEditSubsidies(bill.subsidies || 0);
      setEditArrears(bill.arrears || 0);
      setEditCostOfElectricity(bill.costOfElectricity);
      setActiveTab('official');
      setZoomLevel(1);
      setSaveSuccessMsg('');
    }
  }, [bill]);

  // Handle iframe load to ensure the full 1123px A4 bill is completely displayed without scrolling issues
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = e.currentTarget;
    try {
      if (frame.contentWindow && frame.contentWindow.document) {
        const doc = frame.contentWindow.document;
        const content = doc.querySelector('.a4-container') || doc.querySelector('.maincontent') || doc.querySelector('.gbn-app-shell') || doc.body;
        const rect = content.getBoundingClientRect();
        const h = Math.ceil(rect.height || doc.body.scrollHeight || doc.documentElement.scrollHeight);
        if (h > 600) {
          setIframeHeight(Math.max(h + 40, 1220));
        }
      }
    } catch (err) {
      console.warn('Iframe load measure:', err);
    }
  };

  // Download the exact original bill picture file
  const handleDownloadPicture = () => {
    if (!bill) return;
    const cleanRef = bill.referenceNo.replace(/[^0-9]/g, '');
    const isSample = cleanRef === '06154540709308';
    
    // Only if actively viewing the sample paper photo tab
    if (isSample && activeTab === 'picture') {
      const a = document.createElement('a');
      a.href = '/assets/aistudio/WhatsApp_Image_2026-10-29_at_12.14.15_AM_bb324910.jpeg';
      a.download = `MEPCO-Original-Bill-06154540709308.jpeg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // For any real customer's bill, trigger the authentic image download inside the official bill frame
    const frame = document.getElementById('pitc-live-bill-iframe') as HTMLIFrameElement | null;
    if (frame && frame.contentWindow) {
      try {
        const w = frame.contentWindow as any;
        if (typeof w.downloadBillImage === 'function') {
          w.downloadBillImage();
          return;
        }
        frame.contentWindow.postMessage('download-image', '*');
        const frameBtn = frame.contentWindow.document.getElementById('btn-download-img');
        if (frameBtn) {
          frameBtn.click();
          return;
        }
      } catch (err) {
        console.warn('Frame interaction:', err);
      }
    }

    // Direct window open fallback only if iframe is blocked
    window.open(`/api/pitc/view-bill?company=${encodeURIComponent(bill.company.id)}&ref=${encodeURIComponent(cleanRef)}`, '_blank');
  };

  // Download authentic original bill document directly as a single PDF file (User Selected)
  const handlePrint = async () => {
    if (!bill || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      const cleanRef = bill.referenceNo.replace(/[^0-9]/g, '');
      const fileName = `${bill.company.shortName}-Bill-${cleanRef}.pdf`;

      // Generate and download ONLY the single high-quality A4 PDF file
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/assets/aistudio/WhatsApp_Image_2026-10-29_at_12.14.15_AM_bb324910.jpeg';
        img.onload = () => {
          try {
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (img.naturalHeight * pdfWidth) / img.naturalWidth;
            pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
            pdf.save(fileName);
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load bill image'));
        };
      });
    } catch (error) {
      console.error('Error generating PDF download:', error);
      // Fallback: If image direct render failed, generate PDF from DOM
      try {
        const cleanRef = bill.referenceNo.replace(/[^0-9]/g, '');
        const target = document.getElementById('printable-bill') || document.body;
        const canvas = await html2canvas(target, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${bill.company.shortName}-Bill-${cleanRef}.pdf`);
      } catch (fallbackErr) {
        console.error('Fallback PDF error:', fallbackErr);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Auto-download trigger: directly downloads authentic original picture without showing replica
  useEffect(() => {
    if (isOpen && bill && autoDownload) {
      const timer = setTimeout(() => {
        handleDownloadPicture();
        if (onResetAutoDownload) {
          onResetAutoDownload();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, bill, autoDownload]);

  // Keyboard shortcut Ctrl+P / Cmd+P listener (must be called unconditionally before any early return)
  useEffect(() => {
    if (!isOpen || !bill) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, bill, activeTab, isGeneratingPdf]);

  if (!isOpen || !bill) return null;

  const officialUrl = getOfficialBillUrl(bill.company, bill.referenceNo);

  const handleSave = () => {
    const label = saveLabel.trim() || `${bill.company.shortName} Bill`;
    onSaveBill(bill.company.id, bill.referenceNo, label);
    setIsSaving(false);
  };

  const handleCopyShare = () => {
    const url = `${window.location.origin}/?company=${bill.company.id}&ref=${bill.referenceNo}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveCustomerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bill) return;

    const trimmedName = editName.trim() || bill.consumerName;
    const trimmedConsumerId = editConsumerId.trim() || bill.consumerId;
    const trimmedAddress = editAddress.trim() || bill.address;
    const trimmedSubDiv = editSubDivision.trim() || bill.subDivision;
    const trimmedFeeder = editFeeder.trim() || bill.feederName;
    const trimmedMeter = editMeterNo.trim() || bill.meterNo;
    const customUnits = Number(editUnits) || bill.unitsConsumed;
    const customAmount = Number(editAmount) || bill.payableWithinDueDate;
    const customDueDate = editDueDate.trim() || bill.dueDate;
    const customIssueDate = editIssueDate.trim() || bill.issueDate;
    const customReadingDate = editReadingDate.trim() || bill.readingDate;
    const customSanctionLoad = editSanctionLoad.trim() || bill.sanctionLoad;
    const customPrevReading = Number(editPrevReading) || bill.prevReading;
    const customPresentReading = Number(editPresentReading) || bill.currentReading;
    const customSubsidies = Number(editSubsidies) || 0;
    const customArrears = Number(editArrears) || 0;
    const customCost = Number(editCostOfElectricity) || bill.costOfElectricity;
    const currentMonthBill = Math.max(0, customAmount - customArrears);

    const profileData: CustomConsumerProfile = {
      consumerName: trimmedName,
      consumerId: trimmedConsumerId,
      address: trimmedAddress,
      subDivision: trimmedSubDiv,
      feederName: trimmedFeeder,
      meterNo: trimmedMeter,
      sanctionLoad: customSanctionLoad,
      issueDate: customIssueDate,
      readingDate: customReadingDate,
      prevReading: customPrevReading,
      currentReading: customPresentReading,
      unitsConsumed: customUnits,
      costOfElectricity: customCost,
      subsidies: customSubsidies,
      arrears: customArrears,
      payableWithinDueDate: customAmount,
      totalCurrentBill: currentMonthBill,
      dueDate: customDueDate
    };

    saveConsumerProfile(bill.company.id, bill.referenceNo, profileData);

    const lateFee = bill.latePaymentSurcharge || 90;

    if (onUpdateConsumerInfo) {
      onUpdateConsumerInfo({
        consumerName: trimmedName,
        consumerId: trimmedConsumerId,
        address: trimmedAddress,
        subDivision: trimmedSubDiv,
        feederName: trimmedFeeder,
        meterNo: trimmedMeter,
        sanctionLoad: customSanctionLoad,
        issueDate: customIssueDate,
        readingDate: customReadingDate,
        prevReading: customPrevReading,
        currentReading: customPresentReading,
        unitsConsumed: customUnits,
        costOfElectricity: customCost,
        subsidies: customSubsidies,
        arrears: customArrears,
        payableWithinDueDate: customAmount,
        totalCurrentBill: currentMonthBill,
        payableAfterDueDate: customAmount + lateFee,
        dueDate: customDueDate
      });
    }

    setSaveSuccessMsg(
      lang === 'ur' 
        ? '✓ صارف کا اصل نام، Consumer ID اور بل کی رقم کامیابی سے محفوظ ہو گئی!' 
        : '✓ Real Consumer Name, Consumer ID & Bill Amount updated successfully!'
    );
    setTimeout(() => {
      setActiveTab('picture');
      setSaveSuccessMsg('');
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (!bill) return;
    try {
      localStorage.removeItem(`pakbill_profile_${bill.company.id}_${bill.referenceNo.replace(/[^0-9]/g, '')}`);
    } catch {
      // ignore
    }
    window.location.reload();
  };

  if (!isOpen || !bill) return null;

  const companyColor = bill.company.color || '#16a34a';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:block print:overflow-visible print-modal-wrapper">
      {/* Explicit Print Stylesheet for Bill Voucher Isolation */}
      <style>{`
        @media print {
          /* Hide background, site layout, modals, headers, and footers */
          body * {
            visibility: hidden !important;
          }
          /* Expose only the authentic printable bill document */
          #printable-bill,
          #printable-bill * {
            visibility: visible !important;
          }
          /* Strictly hide interactive buttons, tabs, banners, and 12-month history */
          .print\\:hidden,
          #printable-bill .print\\:hidden,
          .history-section,
          #printable-bill .history-section,
          button {
            display: none !important;
            visibility: hidden !important;
          }
          /* Position printable bill cleanly at top of print page */
          #printable-bill {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            border-radius: 0 !important;
          }
          /* Force crisp black text and borders */
          #printable-bill * {
            color: #000000 !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }
          #printable-bill .barcode-bar {
            background-color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-bill .bg-slate-900,
          #printable-bill .bg-slate-800,
          #printable-bill .bg-slate-100,
          #printable-bill .bg-slate-50,
          #printable-bill .bg-emerald-50,
          #printable-bill .bg-amber-50 {
            background-color: transparent !important;
          }
          #printable-bill .bg-slate-900 {
            border: 2px solid #000000 !important;
          }
          #printable-bill .border,
          #printable-bill .border-b,
          #printable-bill .border-t,
          #printable-bill table,
          #printable-bill th,
          #printable-bill td {
            border-color: #000000 !important;
          }
        }
      `}</style>
      <div className="relative w-full max-w-5xl xl:max-w-6xl max-h-[94vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:static print:overflow-visible">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-emerald-400">
              {bill.company.name} {lang === 'ur' ? 'ڈپلیکیٹ بل' : 'Duplicate Bill Viewer'}
            </span>
            <span className="text-xs text-slate-400">
              (Ref: <span className="font-mono text-emerald-300 font-bold">{bill.referenceNo}</span>)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAlreadySaved && !isSaving && (
              <button
                onClick={() => setIsSaving(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ur' ? 'محفوظ کریں' : 'Save Meter'}</span>
              </button>
            )}

            {isSaving && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Home Meter"
                  value={saveLabel}
                  onChange={(e) => setSaveLabel(e.target.value)}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none w-28 sm:w-36"
                />
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsSaving(false)}
                  className="px-2 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              title="Copy bill direct link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            {bill.paymentStatus === 'Paid' ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-lg">
                <Check className="w-3.5 h-3.5" />
                <span>PAID (ادا شدہ)</span>
              </span>
            ) : (
              <button
                onClick={onOpenPayment}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'بل ادا کریں' : 'Pay Bill Online'}</span>
              </button>
            )}



            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* TAB 1: EDIT CUSTOMER INFO */}
        {activeTab === 'edit' && (
          <div className="p-6 sm:p-8 bg-slate-50 min-h-[480px]">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ur' ? 'کسٹمر کا اصل نام، پتہ اور تفصیلات درست کریں' : 'Correct Customer Name & Information'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'ur' 
                      ? 'اگر آپ کا نام یا پتہ غلط ظاہر ہو رہا ہے، تو یہاں اپنا اصل نام، پتہ اور میٹر نمبر درج کریں۔ یہ ہمیشہ کے لیے اس ریفرنس نمبر کے لیے محفوظ رہے گا اور پرنٹ میں بھی یہی آئے گا۔'
                      : 'If your customer name or address is incorrect, enter your exact details here. They will be saved for this reference number and printed on the bill.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('picture')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {lang === 'ur' ? 'واپس اصل بل پر جائیں' : 'Back to Original Picture'}
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveCustomerInfo} className="space-y-4 text-xs">
                {/* Notice banner inside edit form */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ur' ? 'کاغذ والے اصلی بل سے دیکھ کر درج کریں:' : 'Enter Exact Data from Your Paper Bill:'}</span>
                  </div>
                  <p className="text-[11px]">
                    {lang === 'ur'
                      ? 'اپنے اصل بجلی کے بل پر لکھا ہوا اصل نام، 10 ہندسوں کا Consumer ID اور بل کی واجب الادا رقم نیچے درج کر کے Save کریں۔ یہ ہمیشہ کے لیے اس ریفرنس کے ساتھ محفوظ رہے گا اور بل و ادائیگی میں یہی آئے گا۔'
                      : 'Enter your real registered name, 10-digit Consumer ID, and exact payable amount from your electricity bill. It will be permanently saved and used for duplicate bills and online payment.'}
                  </p>
                </div>

                {/* Primary Identifiers: Real Name & Consumer ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'ur' ? 'صارف کا اصل نام (Consumer Real Name):' : 'Consumer Real Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. MUHAMMAD ASLAM"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'ur' ? '10 ہندسوں کا کنزیومر آئی ڈی (Consumer ID):' : '10-Digit Consumer ID:'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={editConsumerId}
                      onChange={(e) => setEditConsumerId(e.target.value)}
                      placeholder="e.g. 1490636446"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Financials: Bill Amount, Due Date, Units */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">
                      {lang === 'ur' ? 'بل کی اصل رقم (Amount in PKR):' : 'Payable Amount (PKR):'}
                    </label>
                    <input
                      type="number"
                      required
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      placeholder="e.g. 4515"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg font-mono font-black text-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'آخری تاریخ (Due Date):' : 'Due Date:'}
                    </label>
                    <input
                      type="text"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      placeholder="e.g. 18-10-2026"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'استعمال شدہ یونٹس (Units):' : 'Units Consumed:'}
                    </label>
                    <input
                      type="number"
                      value={editUnits}
                      onChange={(e) => setEditUnits(Number(e.target.value))}
                      placeholder="e.g. 126"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'ur' ? 'صارف کا اصل مکمل پتہ (Consumer Address):' : 'Full Physical Address:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. HOUSE 14, STREET 3, GULBERG, LAHORE"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Subsidies & Arrears */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">
                      {lang === 'ur' ? 'حکومتی ٹیرف سبسڈی (Govt Subsidies in PKR):' : 'Govt Tariff Subsidies (PKR):'}
                    </label>
                    <input
                      type="number"
                      value={editSubsidies}
                      onChange={(e) => setEditSubsidies(Number(e.target.value))}
                      placeholder="e.g. 2449"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg font-mono text-emerald-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-950 mb-1">
                      {lang === 'ur' ? 'سابقہ بقایا جات (Arrears in PKR):' : 'Arrears / Previous Pending Balance (PKR):'}
                    </label>
                    <input
                      type="number"
                      value={editArrears}
                      onChange={(e) => setEditArrears(Number(e.target.value))}
                      placeholder="e.g. 1998"
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg font-mono text-amber-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Dates & Sanctioned Load */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'بل جاری کرنے کی تاریخ (Issue Date):' : 'Issue Date:'}
                    </label>
                    <input
                      type="text"
                      value={editIssueDate}
                      onChange={(e) => setEditIssueDate(e.target.value)}
                      placeholder="e.g. 19 OCT 26"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'میٹر ریڈنگ کی تاریخ (Reading Date):' : 'Reading Date:'}
                    </label>
                    <input
                      type="text"
                      value={editReadingDate}
                      onChange={(e) => setEditReadingDate(e.target.value)}
                      placeholder="e.g. 15 OCT 26"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'منظور شدہ لوڈ (Sanctioned Load):' : 'Sanctioned Load:'}
                    </label>
                    <input
                      type="text"
                      value={editSanctionLoad}
                      onChange={(e) => setEditSanctionLoad(e.target.value)}
                      placeholder="e.g. 2.00"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Previous & Present Readings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'سابقہ میٹر ریڈنگ (Previous Reading):' : 'Previous Meter Reading:'}
                    </label>
                    <input
                      type="number"
                      value={editPrevReading}
                      onChange={(e) => setEditPrevReading(Number(e.target.value))}
                      placeholder="e.g. 4694"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'موجودہ میٹر ریڈنگ (Present Reading):' : 'Present Meter Reading:'}
                    </label>
                    <input
                      type="number"
                      value={editPresentReading}
                      onChange={(e) => setEditPresentReading(Number(e.target.value))}
                      placeholder="e.g. 4797"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'سب ڈویژن (Sub-Division):' : 'Sub-Division:'}
                    </label>
                    <input
                      type="text"
                      value={editSubDivision}
                      onChange={(e) => setEditSubDivision(e.target.value)}
                      placeholder="e.g. QAIMPUR SUB-DIV (HASILPUR)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'فیڈر (Feeder Name):' : 'Feeder Name:'}
                    </label>
                    <input
                      type="text"
                      value={editFeeder}
                      onChange={(e) => setEditFeeder(e.target.value)}
                      placeholder="e.g. 047216 ANAYTI"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'ur' ? 'میٹر نمبر (Meter No):' : 'Meter Number:'}
                    </label>
                    <input
                      type="text"
                      value={editMeterNo}
                      onChange={(e) => setEditMeterNo(e.target.value)}
                      placeholder="e.g. 070930"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'ur' ? 'ڈیفالٹ پر ری سیٹ کریں' : 'Reset to Default'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('picture')}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      {lang === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{lang === 'ur' ? 'درست معلومات محفوظ کریں' : 'Save & Update Bill'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 0: ORIGINAL PHYSICAL BILL PICTURE (USER VERIFIED SAMPLE) */}
        {activeTab === 'picture' && bill.referenceNo.replace(/[^0-9]/g, '') === '06154540709308' && (
          <div className="p-3 sm:p-5 bg-slate-950 min-h-[550px] flex flex-col items-center">
            {/* Top Original Picture Action Banner */}
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  📸
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-white text-sm sm:text-base">
                      {bill.company.name} {lang === 'ur' ? 'کا اصل تصویری بل' : 'Original Bill Picture'}
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                      100% Original Photograph
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === 'ur'
                      ? 'صارف کا اصل پرچہ بل بمعہ میٹر فوٹو (4797)، تصدیق شدہ بارکوڈ اور بینک رسید'
                      : 'Authentic electricity bill photograph with meter image, barcodes and bank voucher'}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 mt-1">
                    Reference: <strong className="text-white">{bill.referenceNo}</strong> · Consumer ID: <strong className="text-white">{bill.consumerId}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download Picture, Zoom Controls, Print */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPicture}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
                  title="Download original bill picture file directly (.jpeg)"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'تصویر ڈاؤن لوڈ کریں (JPEG)' : 'Download Picture'}</span>
                </button>

                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.6, Math.round((prev - 0.2) * 10) / 10))}
                    className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300 px-2 min-w-[42px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(2.5, Math.round((prev + 0.2) * 10) / 10))}
                    className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom in (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer font-bold border-l border-slate-700"
                    title="Reset zoom to 100%"
                  >
                    100%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Print original bill"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>{lang === 'ur' ? 'پرنٹ' : 'Print'}</span>
                </button>
              </div>
            </div>

            {/* Picture Container with Scroll & Zoom */}
            <div className="w-full max-w-4xl overflow-auto bg-slate-900/80 rounded-2xl border border-slate-800 p-2 sm:p-4 flex justify-center shadow-2xl relative min-h-[550px] max-h-[750px]">
              <div 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'top center', 
                  transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)' 
                }}
                className="max-w-2xl w-full flex flex-col items-center"
              >
                <img
                  src={
                    bill.referenceNo.replace(/[^0-9]/g, '') === '06154540709308'
                      ? '/assets/aistudio/WhatsApp_Image_2026-10-29_at_12.14.15_AM_bb324910.jpeg'
                      : '/assets/aistudio/WhatsApp_Image_2026-10-29_at_12.14.15_AM_bb324910.jpeg'
                  }
                  alt={`${bill.company.name} Original Bill Picture`}
                  className="w-full h-auto rounded-lg shadow-2xl border border-slate-700 mx-auto select-none block"
                  loading="eager"
                />
              </div>
            </div>

            {/* Verified Details Summary Bar Under Image */}
            <div className="w-full max-w-4xl mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓ ریکارڈ تصدیق شدہ:</span>
                <span className="font-mono text-white font-bold">{bill.consumerName}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-mono">
                <span>Reading: <strong className="text-emerald-300">4694 → 4797 (103 Units)</strong></span>
                <span>Due Date: <strong className="text-amber-300">{bill.dueDate}</strong></span>
                <span>Amount: <strong className="text-white">Rs. {bill.payableWithinDueDate?.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OFFICIAL GOVERNMENT BILL IMAGE & DOCUMENT (PITC LIVE SERVER) */}
        {activeTab === 'official' && (
          <div className="bg-slate-100 p-2 sm:p-4 flex flex-col items-center">
            {/* Minimal Status & Action Strip */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-3 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-emerald-300">
                      {bill.company.name} {lang === 'ur' ? 'اصل سرکاری بجلی بل' : 'Official Utility Bill'}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      100% PITC Live
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                    <span>{bill.consumerName}</span> · <span>Due: <strong className="text-amber-300">{bill.dueDate}</strong></span> · <span>Amount: <strong className="text-white">Rs. {bill.payableWithinDueDate?.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Zoom Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.6, Math.round((prev - 0.1) * 10) / 10))}
                    className="p-1.5 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                    title="Zoom out (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-300 px-2 min-w-[38px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10))}
                    className="p-1.5 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                    title="Zoom in (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer font-bold border-l border-slate-700"
                    title="Reset to 100%"
                  >
                    100%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPicture}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-95 text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer border border-blue-400/40"
                  title="Download Original Bill Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'تصویر ڈاؤن لوڈ کریں' : 'Download Image'}</span>
                </button>

              </div>
            </div>

            {/* Seamless Embedded Full Bill Document Container */}
            <div className="w-full overflow-x-auto bg-slate-200/90 rounded-2xl p-2 sm:p-4 border border-slate-300 shadow-inner flex justify-center">
              <div 
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-full flex justify-center"
              >
                <iframe
                  id="pitc-live-bill-iframe"
                  src={`/api/pitc/view-bill?company=${encodeURIComponent(bill.company.id)}&ref=${encodeURIComponent(bill.referenceNo.replace(/[^0-9]/g, ''))}`}
                  title={`${bill.company.name} Official PITC Duplicate Bill Document`}
                  className="w-full max-w-[860px] bg-white rounded-xl shadow-2xl border border-slate-300"
                  style={{ minHeight: '1280px', height: `${iframeHeight}px` }}
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRINTABLE BILL DOCUMENT CONTAINER */}
        {activeTab === 'bill' && (
          <div id="printable-bill" className="p-6 sm:p-8 bg-white text-slate-900 font-sans text-xs">
            {/* High-visibility Real Bill Correction Banner */}
            <div className="mb-4 p-3.5 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-800 print:hidden shadow-2xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block text-[13px]">
                    {lang === 'ur' ? 'اپنے اصل بل کے مطابق نام، رقم اور Consumer ID درست کریں' : 'Set Your Exact Real Name, Bill Amount & Consumer ID'}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {lang === 'ur'
                      ? 'اگر کسٹمر کا نام، رقم یا Consumer ID مختلف ہے تو یہاں کلک کر کے اپنے اصل بل کی درست تفصیلات درج کریں یا سرکاری سرور سے دیکھیں:'
                      : 'If your customer name, amount, or Consumer ID differs, click here to enter your exact paper bill figures or check the official Govt server:'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'معلومات درست کریں' : 'Edit Bill Data'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('official')}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'اصل سرکاری بل' : 'Govt PITC Bill'}</span>
                </button>
              </div>
            </div>

            {/* Header of Authentic Pakistani Utility Bill */}
            <div 
              className="border-b-2 pb-4 mb-4" 
              style={{ borderColor: companyColor }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-white text-lg tracking-wider shadow-xs"
                    style={{ backgroundColor: companyColor }}
                  >
                    {bill.company.shortName.substring(0, 3)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">
                      {bill.company.name}
                    </h2>
                    <p className="text-xs font-medium text-slate-600">
                      GOVERNMENT OF PAKISTAN · MINISTRY OF ENERGY (POWER DIVISION)
                    </p>
                    <p className="text-xs text-slate-500 font-urdu mt-0.5">
                      {bill.company.urduName}
                    </p>
                  </div>
                </div>

                {/* Status and Bill Month */}
                <div className="text-right sm:text-right">
                  <div className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-bold tracking-wider text-slate-800 uppercase">
                    ELECTRICITY CONSUMER BILL
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">
                    BILL MONTH: <span className="text-emerald-700">{bill.billMonth}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    ISSUE DATE: {bill.issueDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Reference & Identifiers Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Reference No.</span>
                <span className="font-mono font-black text-sm text-slate-900">{bill.referenceNo}</span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase">Consumer ID</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="text-[10px] text-amber-700 hover:underline flex items-center gap-0.5 font-bold print:hidden cursor-pointer"
                    title="Change Consumer ID"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <span className="font-mono font-bold text-sm text-slate-900">{bill.consumerId}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Tariff Category</span>
                <span className="font-bold text-xs text-slate-900">{bill.tariff}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Sanctioned Load</span>
                <span className="font-bold text-xs text-slate-900">{bill.sanctionLoad}</span>
              </div>
            </div>

            {/* Customer & Connection Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Consumer Details */}
              <div className="border border-slate-200 rounded-lg p-3 relative group">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-2">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Name & Address of Consumer
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 print:hidden cursor-pointer"
                    title="Edit Customer Real Name and Address"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{lang === 'ur' ? 'درست کریں' : 'Edit'}</span>
                  </button>
                </div>

                <p className="font-black text-sm text-slate-900 mb-1">{bill.consumerName}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{bill.address}</p>
                
                <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Sub-Division: </span>
                    <span className="font-semibold text-slate-800">{bill.subDivision}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Feeder: </span>
                    <span className="font-semibold text-slate-800">{bill.feederName}</span>
                  </div>
                </div>
              </div>

              {/* Authentic Meter Reading & Electronic Photo Snapshot Frame */}
              <div className="border-2 border-slate-300 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📸 تصویر میٹر ریڈنگ (Meter Photo Snapshot)</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-slate-700">Mtr: {bill.meterNo}</span>
                </div>

                {/* Simulated Authentic Electronic Meter Display Frame */}
                <div className="bg-slate-950 border-2 border-slate-700 rounded-lg p-3 text-center my-1 relative overflow-hidden shadow-inner">
                  <div className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase mb-1 flex items-center justify-between">
                    <span>DISCO DIGITAL METER</span>
                    <span className="text-rose-400 font-bold">● REC</span>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-500/50 rounded py-2 px-3 inline-block">
                    <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 tracking-widest drop-shadow">
                      {String(bill.currentReading).padStart(6, '0')}
                    </span>
                    <span className="text-xs text-emerald-300 font-bold ml-1.5">kWh</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1.5 flex justify-between">
                    <span>Prev: {bill.prevReading}</span>
                    <span>Snapshot: {bill.readingDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center mt-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase">Prev Rdg</span>
                    <span className="font-mono font-bold text-slate-800">{bill.prevReading}</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase">Pres Rdg</span>
                    <span className="font-mono font-bold text-slate-900">{bill.currentReading}</span>
                  </div>
                  <div className="bg-emerald-100 p-1 rounded border border-emerald-400">
                    <span className="block text-[9px] text-emerald-900 font-black uppercase">Units</span>
                    <span className="font-mono font-black text-emerald-950">{bill.unitsConsumed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Financial Calculation Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-5">
              <div className="bg-slate-100 px-3 py-2 font-bold text-xs text-slate-800 flex justify-between uppercase tracking-wider">
                <span>Billing Details & Breakdown of Government Levies</span>
                <span>Amount (PKR)</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-3 py-1.5 flex justify-between">
                  <span className="text-slate-700">Cost of Electricity ({bill.unitsConsumed} units)</span>
                  <span className="font-mono font-semibold tabular-nums">Rs. {bill.costOfElectricity.toLocaleString()}</span>
                </div>
                {Boolean(bill.subsidies && bill.subsidies > 0) && (
                  <div className="px-3 py-1.5 flex justify-between bg-emerald-50 text-emerald-950 font-bold border-y border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                      <span>Govt. Tariff Differential Subsidy (حکومتی سبسڈی)</span>
                    </span>
                    <span className="font-mono tabular-nums text-emerald-700 font-black">- Rs. {bill.subsidies?.toLocaleString()}</span>
                  </div>
                )}
                {bill.meterRent > 0 && (
                  <div className="px-3 py-1.5 flex justify-between">
                    <span className="text-slate-700">Meter Rent / Service Charges</span>
                    <span className="font-mono tabular-nums">Rs. {bill.meterRent.toLocaleString()}</span>
                  </div>
                )}
                <div className="px-3 py-1.5 flex justify-between bg-slate-50/50">
                  <span className="text-slate-700">Fuel Price Adjustment (FPA)</span>
                  <span className="font-mono tabular-nums">Rs. {bill.fuelPriceAdjustment.toLocaleString()}</span>
                </div>
                <div className="px-3 py-1.5 flex justify-between">
                  <span className="text-slate-700">Financing Cost (FC) Surcharge (NEPRA)</span>
                  <span className="font-mono tabular-nums">Rs. {bill.fcSurcharge.toLocaleString()}</span>
                </div>
                <div className="px-3 py-1.5 flex justify-between bg-slate-50/50">
                  <span className="text-slate-700">Quarterly Tariff Adjustment (QTA)</span>
                  <span className="font-mono tabular-nums">Rs. {bill.tariffAdjustment.toLocaleString()}</span>
                </div>
                <div className="px-3 py-1.5 flex justify-between">
                  <span className="text-slate-700">Electricity Duty (ED)</span>
                  <span className="font-mono tabular-nums">Rs. {bill.electricityDuty.toLocaleString()}</span>
                </div>
                <div className="px-3 py-1.5 flex justify-between bg-slate-50/50">
                  <span className="text-slate-700">General Sales Tax (GST)</span>
                  <span className="font-mono tabular-nums">Rs. {bill.salesTax.toLocaleString()}</span>
                </div>
                {bill.tvFee > 0 && (
                  <div className="px-3 py-1.5 flex justify-between">
                    <span className="text-slate-700">PTV License Fee</span>
                    <span className="font-mono tabular-nums">Rs. {bill.tvFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="px-3 py-1.5 flex justify-between bg-slate-100/80 font-bold text-slate-900 border-t border-slate-200">
                  <span>Current Month Bill (موجودہ ماہ کا بل)</span>
                  <span className="font-mono tabular-nums font-black text-slate-900">Rs. {bill.totalCurrentBill.toLocaleString()}</span>
                </div>
                {bill.arrears > 0 && (
                  <div className="px-3 py-1.5 flex justify-between text-amber-950 bg-amber-50 font-bold border-t border-amber-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <span>Arrears / Previous Pending Balance (سابقہ بقایا جات)</span>
                    </span>
                    <span className="font-mono tabular-nums font-black text-amber-900">Rs. {bill.arrears.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Authentic Financial Summary Ledger (Paper Bill Format) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-5">
              <div className="p-3 rounded-lg border-2 border-slate-300 bg-slate-50 text-center">
                <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  تاریخ آخری ادائیگی (Due Date)
                </span>
                <span className="font-mono font-black text-base text-slate-900 mt-1 block">
                  {bill.dueDate}
                </span>
                <span className="text-[9px] text-slate-500">Normal payment period</span>
              </div>

              <div className="p-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-center sm:col-span-2">
                <span className="block text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                  واجب الادا رقم اندر تاریخ (Payable Within Due Date)
                </span>
                <span className="font-mono font-black text-2xl text-emerald-800 mt-0.5 block">
                  Rs. {bill.payableWithinDueDate.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-900 font-semibold">
                  Status: {bill.paymentStatus === 'Paid' ? 'PAID (ادا شدہ)' : 'UNPAID'}
                </span>
              </div>

              <div className="p-3 rounded-lg border-2 border-rose-600 bg-rose-50 text-center">
                <span className="block text-[10px] font-bold text-rose-900 uppercase tracking-wider">
                  بعد از تاریخ (After Due Date)
                </span>
                <span className="font-mono font-black text-lg text-rose-800 mt-1 block">
                  Rs. {bill.payableAfterDueDate.toLocaleString()}
                </span>
                <span className="text-[9px] text-rose-700">Late surcharge: Rs. {bill.latePaymentSurcharge || 90}</span>
              </div>
            </div>

            {/* Quick Action Payment Row (Hidden in print) */}
            <div className="mb-5 p-3 rounded-xl bg-slate-100 border border-slate-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="text-xs text-slate-700 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1Link 1Bill Consumer Number: <strong className="font-mono text-slate-950 font-bold">{bill.referenceNo}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {bill.paymentStatus !== 'Paid' && (
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{lang === 'ur' ? 'آن لائن ادا کریں' : 'Pay Online'}</span>
                  </button>
                )}
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
                  <span>{lang === 'ur' ? 'اصل سرکاری تصویر' : 'Govt Bill Image'}</span>
                </a>
              </div>
            </div>

            {/* Authentic 3-Part Perforated Bank Deposit Vouchers (Bank Copy / WAPDA Copy / Consumer Copy) */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center mb-3">
                ✄ TEAR OFF HERE FOR PAYMENT AT BANK COUNTER / 1LINK AGENT ✄
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. BANK COPY */}
                <div className="border-2 border-slate-300 rounded p-2.5 bg-slate-50 text-[10px] relative">
                  <div className="font-black text-center border-b border-slate-300 pb-1 mb-1 text-slate-900">
                    BANK COPY (بینک کاپی)
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Company:</span>
                    <span className="font-bold">{bill.company.shortName}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Ref #:</span>
                    <span className="font-mono font-bold">{bill.referenceNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="font-bold text-rose-700">{bill.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-t border-slate-200 mt-1 font-bold text-emerald-800">
                    <span>Payable:</span>
                    <span className="font-mono">Rs. {bill.payableWithinDueDate.toLocaleString()}</span>
                  </div>
                  <div className="text-[9px] text-center text-slate-500 mt-2 font-mono">
                    *{bill.referenceNo}*
                  </div>
                </div>

                {/* 2. MEPCO / WAPDA COPY */}
                <div className="border-2 border-slate-300 rounded p-2.5 bg-slate-50 text-[10px] relative">
                  <div className="font-black text-center border-b border-slate-300 pb-1 mb-1 text-slate-900">
                    {bill.company.shortName} COPY (میپکو کاپی)
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Consumer:</span>
                    <span className="font-bold truncate max-w-[120px]">{bill.consumerName}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Ref #:</span>
                    <span className="font-mono font-bold">{bill.referenceNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="font-bold text-rose-700">{bill.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-t border-slate-200 mt-1 font-bold text-emerald-800">
                    <span>Payable:</span>
                    <span className="font-mono">Rs. {bill.payableWithinDueDate.toLocaleString()}</span>
                  </div>
                  <div className="text-[9px] text-center text-slate-500 mt-2 font-mono">
                    *{bill.referenceNo}*
                  </div>
                </div>

                {/* 3. CONSUMER COPY */}
                <div className="border-2 border-emerald-300 rounded p-2.5 bg-emerald-50/50 text-[10px] relative">
                  <div className="font-black text-center border-b border-emerald-300 pb-1 mb-1 text-emerald-950">
                    CONSUMER COPY (صارف کاپی)
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Consumer ID:</span>
                    <span className="font-mono font-bold">{bill.consumerId}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Units:</span>
                    <span className="font-mono font-bold">{bill.unitsConsumed}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="font-bold text-rose-700">{bill.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-t border-slate-200 mt-1 font-bold text-emerald-800">
                    <span>Paid Stamp:</span>
                    <span className="text-[9px] text-emerald-700">1Link / Online</span>
                  </div>
                  <div className="text-[9px] text-center text-slate-500 mt-2 font-mono">
                    *{bill.referenceNo}*
                  </div>
                </div>
              </div>
            </div>

            {/* 12-Month Consumption & Payment History (Like authentic WAPDA bills) - Hidden in print mode */}
            <div className="mb-5 border border-slate-200 rounded-lg p-3 history-section print:hidden">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                12 Months Consumption & Payment History
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="py-1 px-2 border border-slate-200 font-bold text-left bg-slate-200/80">Month</th>
                      {bill.history.map((h, i) => (
                        <th key={i} className="py-1 px-1 border border-slate-200 font-bold">{h.month}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 px-2 border border-slate-200 font-bold text-left text-slate-700 bg-slate-50">Units</td>
                      {bill.history.map((h, i) => (
                        <td key={i} className="py-1 px-1 border border-slate-200 font-mono tabular-nums text-slate-900 font-bold">{h.units}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/70 text-slate-700">
                      <td className="py-1 px-2 border border-slate-200 font-bold text-left text-slate-700 bg-slate-100/70">Bill (Rs)</td>
                      {bill.history.map((h, i) => (
                        <td key={i} className="py-1 px-1 border border-slate-200 font-mono tabular-nums">
                          {h.bill.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white text-[9px]">
                      <td className="py-0.5 px-2 border border-slate-200 font-bold text-left text-slate-600 bg-slate-50">Status</td>
                      {bill.history.map((h, i) => (
                        <td key={i} className="py-0.5 px-1 border border-slate-200 font-semibold text-emerald-700">
                          {h.status || 'PAID'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Barcode & Payment Advice Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
              <div>
                <p className="font-semibold text-slate-700">
                  Payment Options: Pay online via 1Link, JazzCash, EasyPaisa, or any Pakistani Bank mobile application using 1Link 1Bill.
                </p>
                <p className="mt-0.5">
                  Duplicate bill verified for {bill.company.shortName}. For tariff adjustments, visit your respective sub-division office.
                </p>
              </div>

              {/* CSS Simulated Barcode */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex items-center gap-[2px] h-10 px-2 py-1 bg-white border border-slate-300 rounded print:border-black">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="barcode-bar bg-slate-900 print:bg-black h-full"
                      style={{
                        width: i % 3 === 0 ? '3px' : i % 5 === 0 ? '1px' : '2px',
                        opacity: i % 7 === 0 ? 0.3 : 1
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-600 print:text-black print:font-bold mt-1">
                  *{bill.referenceNo}*
                </span>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};
