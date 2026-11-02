import { UtilityCompany } from '../types';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';

export interface DetectionResult {
  company: UtilityCompany;
  subdivisionPrefix?: string;
  messageUrdu: string;
  messageRoman: string;
  messageEn: string;
  confidence: 'high' | 'probable';
}

/**
 * Auto-detects Pakistani Utility Company (DISCO, K-Electric, Gas, Water)
 * from the reference number / account ID.
 *
 * PITC Standard for Electricity DISCOs (14 digits):
 * Digits 1-2: Batch No (01 to 24)
 * Digits 3-4: Sub-division major code prefix:
 *   11 -> LESCO (Lahore)
 *   12 -> GEPCO (Gujranwala)
 *   13 -> FESCO (Faisalabad)
 *   14 -> IESCO (Islamabad/Rawalpindi)
 *   15 -> MEPCO (Multan/South Punjab)
 *   18 / 25 -> TESCO (Tribal Areas)
 *   26 / 27 / 28 -> PESCO (Peshawar/KP)
 *   37 -> HESCO (Hyderabad/South Sindh)
 *   48 -> SEPCO (Sukkur/Upper Sindh)
 *   59 -> QESCO (Quetta/Balochistan)
 *
 * K-Electric: 13 digits starting with 04
 * SNGPL: 11 digits
 * SSGC / PTCL: 10 digits
 * WASA: 8 digits
 */
export function detectCompanyFromReference(rawInput: string): DetectionResult | null {
  if (!rawInput) return null;
  const clean = rawInput.replace(/[^0-9]/g, '');
  if (clean.length < 3) return null;

  // 1. K-Electric: 13 digits or starts with 04 (10+ digits)
  if ((clean.length === 13 && clean.startsWith('04')) || (clean.startsWith('04') && clean.length >= 8)) {
    const ke = UTILITY_COMPANIES.find(c => c.id === 'ke');
    if (ke) {
      return {
        company: ke,
        messageUrdu: 'یہ کے الیکٹرک (K-Electric) کا اکاؤنٹ نمبر ہے',
        messageRoman: 'Ye K-Electric (KE) ka number hai',
        messageEn: 'This is a K-Electric Account Number',
        confidence: 'high'
      };
    }
  }

  // 2. DISCOs (Sub-division prefixes)
  // Mapping of 2-digit sub-division prefix to DISCO
  const prefixMap: Record<string, { id: string; name: string; urduName: string; region: string }> = {
    '15': { id: 'mepco', name: 'MEPCO', urduName: 'میپکو (ملتان)', region: 'ملتان و جنوبی پنجاب' },
    '11': { id: 'lesco', name: 'LESCO', urduName: 'لیسکو (لاہور)', region: 'لاہور، قصور، شیخوپورہ' },
    '12': { id: 'gepco', name: 'GEPCO', urduName: 'گیپکو (گوجرانوالہ)', region: 'گوجرانوالہ، سیالکوٹ، گجرات' },
    '13': { id: 'fesco', name: 'FESCO', urduName: 'فیسکو (فیصل آباد)', region: 'فیصل آباد، سرگودھا، جھنگ' },
    '14': { id: 'iesco', name: 'IESCO', urduName: 'آئیسکو (اسلام آباد)', region: 'اسلام آباد، راولپنڈی، اٹک' },
    '18': { id: 'tesco', name: 'TESCO', urduName: 'ٹیسکو (قبائلی علاقہ جات)', region: 'قبائلی علاقہ جات (فاٹا)' },
    '25': { id: 'tesco', name: 'TESCO', urduName: 'ٹیسکو (قبائلی علاقہ جات)', region: 'قبائلی علاقہ جات' },
    '26': { id: 'pesco', name: 'PESCO', urduName: 'پیسکو (پشاور)', region: 'پشاور، مردان، سوات' },
    '27': { id: 'pesco', name: 'PESCO', urduName: 'پیسکو (پشاور)', region: 'خیبر پختونخوا ریجن' },
    '28': { id: 'pesco', name: 'PESCO', urduName: 'پیسکو (پشاور)', region: 'خیبر پختونخوا ریجن' },
    '37': { id: 'hesco', name: 'HESCO', urduName: 'حیسکو (حیدرآباد)', region: 'حیدرآباد، میرپورخاص' },
    '48': { id: 'sepco', name: 'SEPCO', urduName: 'سیپکو (سکھر)', region: 'سکھر، لاڑکانہ، خیرپور' },
    '59': { id: 'qesco', name: 'QESCO', urduName: 'کیسکو (کوئٹہ)', region: 'کوئٹہ و پورا بلوچستان' },
  };

  // Check 14-digit standard format: digits at index 2..4 (after 2-digit batch)
  if (clean.length >= 4) {
    const batchSubdivPrefix = clean.substring(2, 4);
    if (prefixMap[batchSubdivPrefix]) {
      const meta = prefixMap[batchSubdivPrefix];
      const comp = UTILITY_COMPANIES.find(c => c.id === meta.id);
      if (comp) {
        return {
          company: comp,
          subdivisionPrefix: batchSubdivPrefix,
          messageUrdu: `یہ ${comp.name} کا نمبر ہے (${meta.region})`,
          messageRoman: `Ye ${comp.name} ka number hai`,
          messageEn: `This is a ${comp.name} Reference Number (${meta.name})`,
          confidence: 'high'
        };
      }
    }
  }

  // Check format without batch (if user enters starting directly with subdivision: e.g. 15454...)
  if (clean.length >= 4) {
    const directPrefix = clean.substring(0, 2);
    if (prefixMap[directPrefix]) {
      const meta = prefixMap[directPrefix];
      const comp = UTILITY_COMPANIES.find(c => c.id === meta.id);
      if (comp) {
        return {
          company: comp,
          subdivisionPrefix: directPrefix,
          messageUrdu: `یہ ${comp.name} کا نمبر ہے`,
          messageRoman: `Ye ${comp.name} ka number hai`,
          messageEn: `This is a ${comp.name} Reference Number`,
          confidence: 'probable'
        };
      }
    }
  }

  // 3. SNGPL Gas (11 digits)
  if (clean.length === 11) {
    const sngpl = UTILITY_COMPANIES.find(c => c.id === 'sngpl');
    if (sngpl) {
      return {
        company: sngpl,
        messageUrdu: 'یہ سوئی ناردرن گیس (SNGPL) کا کنزیومر نمبر ہے',
        messageRoman: 'Ye SNGPL Gas ka number hai',
        messageEn: 'This is an SNGPL Gas Consumer Number',
        confidence: 'probable'
      };
    }
  }

  // 4. SSGC Gas / PTCL (10 digits)
  if (clean.length === 10) {
    const ssgc = UTILITY_COMPANIES.find(c => c.id === 'ssgc');
    if (ssgc) {
      return {
        company: ssgc,
        messageUrdu: 'یہ سوئی سدرن گیس (SSGC) کا کسٹمر نمبر ہے',
        messageRoman: 'Ye SSGC Gas ka number hai',
        messageEn: 'This is an SSGC Gas Customer Number',
        confidence: 'probable'
      };
    }
  }

  // 5. WASA Lahore (8 digits)
  if (clean.length === 8) {
    const wasa = UTILITY_COMPANIES.find(c => c.id === 'wasa-lahore');
    if (wasa) {
      return {
        company: wasa,
        messageUrdu: 'یہ واسا لاہور (WASA) کا اکاؤنٹ نمبر ہے',
        messageRoman: 'Ye WASA Lahore ka number hai',
        messageEn: 'This is a WASA Lahore Account Number',
        confidence: 'probable'
      };
    }
  }

  return null;
}
