import React, { useState } from 'react';
import { X, HelpCircle, Check, MapPin, Zap, Flame, Droplet } from 'lucide-react';
import { Language } from '../utils/translations';

interface ReferenceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ReferenceGuideModal: React.FC<ReferenceGuideModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [guideCategory, setGuideCategory] = useState<'disco' | 'ke' | 'gas' | 'wasa'>('disco');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/30 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {lang === 'ur' ? 'ریفرنس نمبر تلاش کرنے کا طریقہ' : 'Where to Find Your Reference Number'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'بجلی، گیس، پی ٹی سی ایل اور واسا کے بل پر ریفرنس نمبر کا مقام'
                  : 'Visual visual reference guide for Pakistani utility bills'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setGuideCategory('disco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              guideCategory === 'disco'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            MEPCO / LESCO / FESCO / IESCO (14 Digits)
          </button>

          <button
            onClick={() => setGuideCategory('ke')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              guideCategory === 'ke'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            K-Electric (13-Digit Account No)
          </button>

          <button
            onClick={() => setGuideCategory('gas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              guideCategory === 'gas'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            SNGPL & SSGC Gas (10-11 Digits)
          </button>

          <button
            onClick={() => setGuideCategory('wasa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              guideCategory === 'wasa'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            WASA & Water (8-10 Digits)
          </button>
        </div>

        {/* Visual Bill Mockup Diagram */}
        <div className="p-6">
          {guideCategory === 'disco' && (
            <div>
              <div className="relative bg-slate-50 border-2 border-dashed border-emerald-500 rounded-xl p-5 mb-4">
                {/* Visual Representation of Bill Header */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <span className="font-extrabold text-xs text-slate-800">
                      ELECTRICITY DISTRIBUTION COMPANY (MEPCO/LESCO/IESCO/FESCO...)
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                      OCT 2026
                    </span>
                  </div>

                  {/* Highlighted Reference Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 rounded-lg relative">
                      <span className="absolute -top-2.5 right-2 px-1.5 bg-emerald-600 text-white font-bold text-[9px] rounded">
                        ★ YOUR 14-DIGIT REFERENCE NUMBER
                      </span>
                      <span className="block text-[10px] text-emerald-800 font-bold uppercase">
                        REFERENCE NO. (حوالہ نمبر)
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-950 tracking-wider">
                        14 15111 0234500 U
                      </span>
                    </div>

                    <div className="p-2.5 bg-blue-50 border border-blue-300 rounded-lg">
                      <span className="block text-[10px] text-blue-800 font-bold uppercase">
                        CONSUMER ID (صارف آئی ڈی)
                      </span>
                      <span className="font-mono font-bold text-sm text-blue-950">
                        1092837465
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2">
                    <div>Consumer Name: <strong>MUHAMMAD ASLAM</strong></div>
                    <div>Due Date: <strong>18-OCT-2026</strong></div>
                    <div>Payable: <strong>Rs. 8,450</strong></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">
                  {lang === 'ur' ? 'اہم نکات:' : 'Key Information for DISCO Bills:'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>
                    {lang === 'ur'
                      ? 'تمام واپڈا ڈسکوز (میپکو، لیسکو، فیسکو، آئیسکو، گیپکو، پیسکو، حیسکو، سیپکو، کیسکو، ٹیسکو) پر 14 ہندسوں کا ریفرنس نمبر استعمال ہوتا ہے۔'
                      : 'All WAPDA DISCOs use a 14-digit numeric reference string printed at the top-left portion of the bill.'}
                  </li>
                  <li>
                    {lang === 'ur'
                      ? 'ریفرنس نمبر کے آخر میں "U" (Urban/شہری) یا "R" (Rural/دیہی) لکھا ہوتا ہے۔ ان پٹ میں صرف 14 ہندسے درج کریں یا حرف کے ساتھ درج کریں۔'
                      : 'The letter at the end indicates Urban (U) or Rural (R). You can enter the 14 numbers without spaces.'}
                  </li>
                  <li>
                    {lang === 'ur'
                      ? 'میپکو، لیسکو اور آئیسکو کے بلز پر 10 ہندسوں کا کنزیومر آئی ڈی بھی درج ہوتا ہے جس سے بل چیک کیا جا سکتا ہے۔'
                      : 'Consumer ID (10 digits) can also be used for MEPCO, LESCO, and IESCO bills.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {guideCategory === 'ke' && (
            <div>
              <div className="relative bg-slate-50 border-2 border-dashed border-emerald-500 rounded-xl p-5 mb-4">
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <span className="font-extrabold text-xs text-slate-800">
                      K-ELECTRIC (KE) CONSUMER INVOICE
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                      KARACHI
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-lg mb-3">
                    <span className="block text-[10px] text-emerald-800 font-bold uppercase">
                      13-DIGIT ACCOUNT NUMBER (کے الیکٹرک اکاؤنٹ نمبر)
                    </span>
                    <span className="font-mono font-black text-base text-emerald-950 tracking-wider">
                      0400012345678
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Printed at the top right in prominent bold text starting with &quot;04&quot;.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">How K-Electric Bills Work:</p>
                <p>K-Electric Karachi uses a 13-digit Account Number (not a 14-digit WAPDA reference number). It usually starts with 04000... Make sure to enter all 13 digits.</p>
              </div>
            </div>
          )}

          {guideCategory === 'gas' && (
            <div>
              <div className="relative bg-slate-50 border-2 border-dashed border-red-500 rounded-xl p-5 mb-4">
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <span className="font-extrabold text-xs text-red-700">
                      SUI NORTHERN (SNGPL) / SUI SOUTHERN (SSGC) GAS BILL
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-800 px-2 py-0.5 rounded font-semibold">
                      NATURAL GAS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                      <span className="block text-[10px] text-red-800 font-bold uppercase">
                        SNGPL Consumer ID (11 Digits)
                      </span>
                      <span className="font-mono font-black text-sm text-red-950">
                        98432109876
                      </span>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                      <span className="block text-[10px] text-red-800 font-bold uppercase">
                        SSGC Customer No (10 Digits)
                      </span>
                      <span className="font-mono font-black text-sm text-red-950">
                        8765432109
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">Gas Bill Customer Number Location:</p>
                <p>For SNGPL (Punjab, KP, Islamabad): Look for the 11-digit Consumer No at the top left of your gas bill.</p>
                <p>For SSGC (Sindh & Balochistan): Look for the 10-digit Customer Number in the top center.</p>
              </div>
            </div>
          )}

          {guideCategory === 'wasa' && (
            <div>
              <div className="relative bg-slate-50 border-2 border-dashed border-blue-500 rounded-xl p-5 mb-4">
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <span className="font-extrabold text-xs text-blue-700">
                      WASA WATER & SANITATION AGENCY BILL
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50 border-2 border-blue-500 rounded-lg">
                    <span className="block text-[10px] text-blue-800 font-bold uppercase">
                      WASA 8-Digit Account No / Consumer No
                    </span>
                    <span className="font-mono font-black text-base text-blue-950">
                      84729103
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">WASA Water Bills:</p>
                <p>WASA Lahore water bills contain an 8-digit account number at the top right. WASA Rawalpindi and Karachi Water (KW&SC) use 8-10 digit consumer numbers.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Got it, Back to Checker
          </button>
        </div>

      </div>
    </div>
  );
};
