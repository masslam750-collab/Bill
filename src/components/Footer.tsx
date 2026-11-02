import React from 'react';
import { Zap, Shield, ExternalLink, HelpCircle } from 'lucide-react';
import { Language } from '../utils/translations';

interface FooterProps {
  lang: Language;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenGuide
}) => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto pb-8 text-xs print:hidden">
      <div className="bg-slate-950 text-slate-400 border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Naurdu<span className="text-emerald-500">inbox</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official online duplicate bill inquiry service for all electricity DISCOs, gas, water, and telecom services across Pakistan.
            </p>
            <div className="text-[11px] text-slate-500">
              Compliant with NEPRA &amp; PITC public billing standards.
            </div>
          </div>

          {/* Electricity Companies */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
              Electricity DISCOs
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="https://bill.pitc.com.pk/mepcobill" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">MEPCO Online Bill (Multan)</a></li>
              <li><a href="https://bill.pitc.com.pk/lescobill" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">LESCO Bill (Lahore)</a></li>
              <li><a href="https://bill.pitc.com.pk/fescobill" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">FESCO Bill (Faisalabad)</a></li>
              <li><a href="https://bill.pitc.com.pk/iescobill" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">IESCO Bill (Islamabad)</a></li>
              <li><a href="https://bill.pitc.com.pk/gepcobill" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">GEPCO Bill (Gujranwala)</a></li>
              <li><a href="https://www.ke.com.pk" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">K-Electric (KE Karachi)</a></li>
            </ul>
          </div>

          {/* Gas, Water & Resources */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
              Gas &amp; Water Services
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="https://www.sngpl.com.pk" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">SNGPL Sui Northern Gas</a></li>
              <li><a href="https://www.ssgc.com.pk" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">SSGC Sui Southern Gas</a></li>
              <li><a href="https://wasa.punjab.gov.pk" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">WASA Lahore Water Bill</a></li>
              <li><a href="https://dbill.ptcl.com.pk" target="_blank" rel="noopener" className="hover:text-emerald-400 transition-colors">PTCL Landline &amp; Flash Fiber</a></li>
              <li><button onClick={onOpenGuide} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Find 14-Digit Reference No</button></li>
            </ul>
          </div>

          {/* Security & Private Rights */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
              Security &amp; Exclusivity
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              Exclusive online bill portal for <strong>Naurduinbox</strong> users.
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Anti-Theft Protection Active</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Unauthorized iframe embedding, hotlinking, or scraping on external websites is restricted.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Naurduinbox. Not affiliated with the Government of Pakistan. All company logos &amp; trademarks belong to their respective power distribution companies.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>SSL 256-bit Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
