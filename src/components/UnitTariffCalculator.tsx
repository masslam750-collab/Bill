import React, { useState, useMemo, memo } from 'react';
import { Calculator, ShieldCheck, Zap, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { calculateNepraElectricityBill } from '../utils/tariffCalculator';
import { Language } from '../utils/translations';

interface UnitTariffCalculatorProps {
  lang: Language;
}

export const UnitTariffCalculator: React.FC<UnitTariffCalculatorProps> = memo(({ lang }) => {
  const [units, setUnits] = useState<number>(240);
  const [category, setCategory] = useState<'domestic_protected' | 'domestic_unprotected' | 'commercial' | 'industrial'>('domestic_unprotected');
  const [isTou, setIsTou] = useState<boolean>(false);
  const [peakUnits, setPeakUnits] = useState<number>(60);
  const [offPeakUnits, setOffPeakUnits] = useState<number>(180);

  const calc = useMemo(() => {
    return calculateNepraElectricityBill(
      units,
      category,
      isTou,
      peakUnits,
      offPeakUnits
    );
  }, [units, category, isTou, peakUnits, offPeakUnits]);

  const presets = [100, 195, 250, 350, 500, 750];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>{lang === 'ur' ? 'نیپرا منظور شدہ ٹیرف شیڈول' : 'NEPRA Notified Tariff Schedule'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'ur' ? 'بجلی کا یونٹ اور بل کیلکولیٹر' : 'Electricity Unit & Bill Calculator'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ur'
              ? 'اپنے متوقع یونٹس درج کریں اور فیول پرائس، جی ایس ٹی، ایف سی سرچارج اور ٹی وی فیس سمیت مکمل بل معلوم کریں۔'
              : 'Calculate estimated electricity bill including Fuel Adjustment, GST, FC Surcharge, and PTV fee.'}
          </p>
        </div>

        {/* Protected vs Unprotected explanation pill */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 max-w-xs shrink-0">
          <span className="font-bold block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'ur' ? 'پروٹیکٹڈ صارف کون ہے؟' : 'Who is a Protected Consumer?'}
          </span>
          <p className="mt-0.5 text-[11px] text-emerald-800 leading-tight">
            {lang === 'ur'
              ? 'وہ صارفین جو پچھلے 6 ماہ سے مسلسل 200 یا اس سے کم یونٹ استعمال کر رہے ہیں۔'
              : 'Domestic consumers consuming <= 200 units consecutively for the past 6 months.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {lang === 'ur' ? 'کنکشن کی کیٹیگری منتخب کریں' : 'Connection Category:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setCategory('domestic_protected'); setIsTou(false); }}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                  category === 'domestic_protected' && !isTou
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">{lang === 'ur' ? 'گھریلو (پروٹیکٹڈ)' : 'Domestic (Protected)'}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">&le; 200 Units for 6 Months</div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('domestic_unprotected')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                  category === 'domestic_unprotected' && !isTou
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">{lang === 'ur' ? 'گھریلو (نان پروٹیکٹڈ)' : 'Domestic (Unprotected)'}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">Standard Domestic Slabs</div>
              </button>

              <button
                type="button"
                onClick={() => { setCategory('commercial'); setIsTou(false); }}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                  category === 'commercial' && !isTou
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">{lang === 'ur' ? 'کمرشل کنکشن' : 'Commercial (A-2a)'}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">Shops, Offices, Plazas</div>
              </button>

              <button
                type="button"
                onClick={() => setIsTou(!isTou)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                  isTou
                    ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">{lang === 'ur' ? 'ٹائم آف یوز (TOU میٹر)' : 'Time of Use (TOU)'}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">3-Phase Peak / Off-Peak</div>
              </button>
            </div>
          </div>

          {/* Unit Inputs */}
          {!isTou ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'ur' ? 'ماہانہ استعمال شدہ یونٹس (kWh)' : 'Monthly Units Consumed (kWh):'}
                </label>
                <span className="font-mono text-lg font-black text-emerald-700 tabular-nums">
                  {units} <span className="text-xs font-normal text-slate-500">Units</span>
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10"
                max="1200"
                step="5"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              {/* Direct number input & Presets */}
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={units}
                  onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
                  className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5">
                  {presets.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUnits(p)}
                      className={`px-2 py-1 text-xs font-semibold rounded border cursor-pointer ${
                        units === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p} U
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-purple-50/50 rounded-xl border border-purple-200">
              <span className="block text-xs font-bold text-purple-900 uppercase tracking-wider">
                TOU 3-Phase Meter Separate Readings:
              </span>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Peak Units (Evening 4 Hours @ Rs 42.12/U):</span>
                  <span className="font-mono font-bold">{peakUnits} Units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  value={peakUnits}
                  onChange={(e) => setPeakUnits(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Off-Peak Units (Remaining 20 Hours @ Rs 35.85/U):</span>
                  <span className="font-mono font-bold">{offPeakUnits} Units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  value={offPeakUnits}
                  onChange={(e) => setOffPeakUnits(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          )}

          {/* Quick NEPRA Slab Notice */}
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-0.5">
              NEPRA Slab Mechanism:
            </span>
            <span>
              If you cross 200 units, all previous units are charged according to higher unprotected slab rates plus 18% General Sales Tax.
            </span>
          </div>
        </div>

        {/* Breakdown Output Column */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Estimated Bill Breakdown
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                Total: {calc.units} kWh
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Energy Cost</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  Rs. {calc.baseCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Fuel Price Adjustment (FPA ~ Rs 2.85/U)</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  Rs. {calc.fpa.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">FC Surcharge (Rs 3.23/U)</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  Rs. {calc.fcSurcharge.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Quarterly Tariff Adjustment (QTA)</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  Rs. {calc.qtrAdjustment.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Electricity Duty (ED 1.5%)</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  Rs. {calc.electricityDuty.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">General Sales Tax (GST 18%)</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  {calc.salesTax > 0 ? `Rs. ${calc.salesTax.toLocaleString()}` : 'Exempt (Protected)'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">PTV License Fee</span>
                <span className="font-mono text-slate-800 tabular-nums">
                  Rs. {calc.tvFee}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="mt-6 pt-4 border-t-2 border-slate-200">
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  ESTIMATED PAYABLE AMOUNT
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                  Rs. {calc.totalPayable.toLocaleString()}
                </span>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="block font-medium">Avg Effective Rate:</span>
                <span className="font-mono text-sm font-bold text-white">
                  Rs. {(calc.totalPayable / (calc.units || 1)).toFixed(2)}/unit
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
});
