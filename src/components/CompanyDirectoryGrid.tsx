import React, { useState, useMemo, memo } from 'react';
import { Search, ExternalLink, PhoneCall, Zap, Flame, Droplet, Phone, MapPin, ArrowRight } from 'lucide-react';
import { UtilityCompany, UtilityCategory } from '../types';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';
import { Language } from '../utils/translations';

interface CompanyDirectoryGridProps {
  onSelectCompany: (company: UtilityCompany) => void;
  lang: Language;
}

export const CompanyDirectoryGrid: React.FC<CompanyDirectoryGridProps> = memo(({
  onSelectCompany,
  lang
}) => {
  const [filterCategory, setFilterCategory] = useState<UtilityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return UTILITY_COMPANIES.filter(c => {
      if (filterCategory !== 'all' && c.category !== filterCategory) return false;
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(query);
      const matchShort = c.shortName.toLowerCase().includes(query);
      const matchCoverage = c.coverage.some(city => city.toLowerCase().includes(query));
      const matchUrdu = c.urduName.includes(query) || c.urduCoverage.includes(query);
      return matchName || matchShort || matchCoverage || matchUrdu;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'ur' ? 'پاکستان کی تمام یوٹیلٹی کمپنیاں' : 'Pakistan Utility Companies Directory'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ur'
              ? 'اپنے شہر یا ڈویژن کے مطابق متعلقہ بجلی، گیس یا واسا کمپنی تلاش کریں۔'
              : 'Browse all 11 DISCOs, K-Electric, Sui Gas, and WASA agencies by region.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ur' ? 'شہر تلاش کریں (مثلاً لاہور، ملتان، کراچی)...' : 'Search by city or company...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filterCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang === 'ur' ? 'تمام کمپنیاں (15)' : 'All Companies (15)'}
        </button>

        <button
          onClick={() => setFilterCategory('electricity')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterCategory === 'electricity' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'ur' ? 'بجلی (11 ڈسکوز)' : 'Electricity (11 DISCOs & KE)'}</span>
        </button>

        <button
          onClick={() => setFilterCategory('gas')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterCategory === 'gas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>{lang === 'ur' ? 'سوئی گیس (SNGPL / SSGC)' : 'Gas (SNGPL & SSGC)'}</span>
        </button>

        <button
          onClick={() => setFilterCategory('water')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterCategory === 'water' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-3.5 h-3.5 text-sky-500" />
          <span>{lang === 'ur' ? 'واسا و پانی' : 'Water & WASA'}</span>
        </button>

        <button
          onClick={() => setFilterCategory('telecom')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterCategory === 'telecom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'ur' ? 'پی ٹی سی ایل' : 'PTCL'}</span>
        </button>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(comp => (
          <div
            key={comp.id}
            className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between bg-white group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs"
                    style={{ backgroundColor: comp.color }}
                  >
                    {comp.shortName.substring(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {comp.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {lang === 'ur' ? comp.urduName : comp.refLabel}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {comp.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
                {lang === 'ur' ? comp.urduDescription : comp.description}
              </p>

              {/* Coverage list */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {lang === 'ur' ? 'زیر انتظام علاقے:' : 'Areas Served:'}
                </span>
                <p className="text-xs text-slate-700 line-clamp-2">
                  {lang === 'ur' ? comp.urduCoverage : comp.coverage.join(', ')}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${comp.helpline.split('/')[0].trim()}`}
                className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono"
              >
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                <span>{comp.helpline}</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCompany(comp);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Check Bill</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
