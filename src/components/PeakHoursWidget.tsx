import React, { useState, useEffect, memo } from 'react';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language } from '../utils/translations';

interface PeakHoursWidgetProps {
  lang: Language;
}

export const PeakHoursWidget: React.FC<PeakHoursWidgetProps> = memo(({ lang }) => {
  const [pktTime, setPktTime] = useState<Date>(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * 5);
  });
  const [isPeak, setIsPeak] = useState<boolean>(false);
  const [currentSeasonSchedule, setCurrentSeasonSchedule] = useState<{ season: string; time: string; urSeason: string }>({
    season: 'Mar to May',
    time: '6:00 PM - 10:00 PM',
    urSeason: 'مارچ تا مئی: شام 6 تا رات 10 بجے'
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pakTime = new Date(utc + 3600000 * 5);
      setPktTime(pakTime);

      const month = pakTime.getMonth();
      const hours = pakTime.getHours();
      let startH = 18;
      let endH = 22;
      let seasonName = 'Mar to May';
      let urduSeason = 'مارچ تا مئی';

      if (month >= 11 || month <= 1) {
        startH = 17;
        endH = 21;
        seasonName = 'Dec to Feb (Winter)';
        urduSeason = 'دسمبر تا فروری (سردیاں)';
      } else if (month >= 2 && month <= 4) {
        startH = 18;
        endH = 22;
        seasonName = 'Mar to May (Spring)';
        urduSeason = 'مارچ تا مئی (بہار)';
      } else if (month >= 5 && month <= 7) {
        startH = 19;
        endH = 23;
        seasonName = 'Jun to Aug (Summer)';
        urduSeason = 'جون تا اگست (گرمیاں)';
      } else {
        startH = 18;
        endH = 22;
        seasonName = 'Sep to Nov (Autumn)';
        urduSeason = 'ستمبر تا نومبر (خزاں)';
      }

      setCurrentSeasonSchedule({
        season: seasonName,
        time: `${startH > 12 ? startH - 12 : startH}:00 PM to ${endH > 12 ? endH - 12 : endH}:00 PM`,
        urSeason: `${urduSeason}: شام ${startH > 12 ? startH - 12 : startH} تا رات ${endH > 12 ? endH - 12 : endH} بجے`
      });

      setIsPeak(hours >= startH && hours < endH);
    };

    updateTime();
    // Update every second so clock seconds tick smoothly
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = pktTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className={`border rounded-xl p-4 transition-all shadow-inner backdrop-blur-xs ${
      isPeak 
        ? 'bg-slate-950/95 border-amber-500/40 shadow-amber-950/20' 
        : 'bg-slate-950/95 border-emerald-500/35 shadow-emerald-950/20'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Clock Icon + PKT Time with Seconds + Peak/Off-Peak status */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 border ${
            isPeak 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {isPeak ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <Clock className="w-5 h-5 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {lang === 'ur' ? 'پاکستان معیاری وقت (PKT)' : 'Pakistan Standard Time (PKT)'}
              </span>
              <span className="font-mono text-xs font-black tabular-nums px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-emerald-300 shadow-inner flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{formattedTime}</span>
              </span>
            </div>

            <p className="text-sm sm:text-base font-extrabold mt-1">
              {isPeak ? (
                <span className="text-amber-400 flex items-center gap-1.5 drop-shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-400 inline" />
                  {lang === 'ur' ? 'پیک آورز جاری ہیں! بجلی کا ٹیرف زیادہ ہے' : 'Peak Hours are ACTIVE! Tariff is at highest rate'}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5 drop-shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  {lang === 'ur' ? 'آف پیک آورز - عام نارمل ٹیرف لاگو ہے' : 'Off-Peak Hours - Standard normal tariff applies'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Current Season Schedule + Energy Saving Advice */}
        <div className="flex items-center gap-5 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2">
            <span className="block text-slate-400 font-semibold text-[11px] mb-0.5">
              {lang === 'ur' ? 'موجودہ سیزن کا پیک ٹائم' : 'Current Season Peak Time'}
            </span>
            <span className="font-bold text-amber-300 font-mono text-xs">
              {lang === 'ur' ? currentSeasonSchedule.urSeason : `${currentSeasonSchedule.season}: ${currentSeasonSchedule.time}`}
            </span>
          </div>

          <div className="hidden sm:block border-l border-slate-800 pl-4 text-slate-300 max-w-xs text-xs leading-relaxed">
            {lang === 'ur' 
              ? 'پیک آورز میں اے سی، موٹر، استری اور واشنگ مشین کا استعمال کم کریں تاکہ بل 40٪ کم آئے۔' 
              : 'Avoid ACs, water pumps & irons during peak hours to save up to 40% on your monthly bill.'}
          </div>
        </div>
      </div>
    </div>
  );
});
