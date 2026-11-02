import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Search, 
  RotateCcw,
  Building,
  ExternalLink,
  Download,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { GeneratedBill } from '../types';
import { Language } from '../utils/translations';
import { UTILITY_COMPANIES } from '../data/utilityCompanies';

interface BankAppInfo {
  id: string;
  name: string;
  shortName: string;
  appScheme: string;
  androidPackage: string;
  playStoreUrl: string;
  appStoreUrl: string;
  webPortalUrl: string;
  color: string;
  logoBg: string;
  logoText: string;
}

export const BANK_PACKAGES: Record<string, string> = {
  // Mobile Wallets (Verified & Working):
  'JazzCash': 'com.techlogix.mobilinkcustomer',
  'jazzcash': 'com.techlogix.mobilinkcustomer',
  'com.techlogix.mobilink': 'com.techlogix.mobilinkcustomer',
  'com.techlogix.mobilinkcustomer': 'com.techlogix.mobilinkcustomer',
  'Easypaisa': 'pk.com.telenor.phoenix',
  'easypaisa': 'pk.com.telenor.phoenix',
  'EasyPaisa': 'pk.com.telenor.phoenix',
  'pk.com.telenor.phoenix': 'pk.com.telenor.phoenix',
  'SadaPay': 'pk.sadapay.app',
  'sadapay': 'pk.sadapay.app',
  'NayaPay': 'com.nayapay.app',
  'nayapay': 'com.nayapay.app',

  // Major Pakistani Commercial & Islamic Banks (Real Play Store Packages):
  'Meezan Mobile': 'invo8.meezan.mb',
  'Meezan Bank': 'invo8.meezan.mb',
  'meezan': 'invo8.meezan.mb',
  'invo8.meezan.mb': 'invo8.meezan.mb',
  'pk.com.meezanbank.mobile': 'invo8.meezan.mb',

  'HBL Mobile': 'com.hbl.android.hblmobilebanking',
  'Habib Bank Limited (HBL)': 'com.hbl.android.hblmobilebanking',
  'hbl': 'com.hbl.android.hblmobilebanking',
  'com.hbl.android.hblmobilebanking': 'com.hbl.android.hblmobilebanking',

  'Alfa App': 'com.base.bankalfalah',
  'Bank Alfalah': 'com.base.bankalfalah',
  'alfalah': 'com.base.bankalfalah',
  'com.base.bankalfalah': 'com.base.bankalfalah',

  'MCB Live': 'com.mcb.mcblive',
  'MCB Bank': 'com.mcb.mcblive',
  'mcb': 'com.mcb.mcblive',
  'com.mcb.mcblive': 'com.mcb.mcblive',

  'UBL Digital': 'app.com.brd',
  'United Bank Limited (UBL)': 'app.com.brd',
  'ubl': 'app.com.brd',
  'app.com.brd': 'app.com.brd',

  'myABL': 'com.ofss.digx.mobile.android.allied',
  'Allied Bank Limited': 'com.ofss.digx.mobile.android.allied',
  'abl': 'com.ofss.digx.mobile.android.allied',
  'com.ofss.digx.mobile.android.allied': 'com.ofss.digx.mobile.android.allied',

  'JS Mobile App': 'com.jsbl.jsmobile',
  'JS Bank': 'com.jsbl.jsmobile',
  'jsbank': 'com.jsbl.jsmobile',
  'com.jsbl.jsmobile': 'com.jsbl.jsmobile',

  'Faysal Digibank': 'pk.com.faysalbank.digibank',
  'Faysal Bank': 'pk.com.faysalbank.digibank',
  'faysal': 'pk.com.faysalbank.digibank',
  'pk.com.faysalbank.digibank': 'pk.com.faysalbank.digibank',

  'BOP Mobile': 'com.digibop.mobile',
  'The Bank of Punjab': 'com.digibop.mobile',
  'bop': 'com.digibop.mobile',
  'com.digibop.mobile': 'com.digibop.mobile',

  'NBP Digital': 'com.paysys.nbpdigital',
  'National Bank of Pakistan (NBP)': 'com.paysys.nbpdigital',
  'nbp': 'com.paysys.nbpdigital',
  'com.paysys.nbpdigital': 'com.paysys.nbpdigital',

  'Bank AL Habib App': 'com.bankalhabib.digital',
  'Bank AL Habib (AL Habib)': 'com.bankalhabib.digital',
  'Bank AL Habib': 'com.bankalhabib.digital',
  'bankalhabib': 'com.bankalhabib.digital',
  'com.bankalhabib.digital': 'com.bankalhabib.digital',

  'SC Mobile': 'com.scb.pk.bmw',
  'Standard Chartered Pakistan': 'com.scb.pk.bmw',
  'scb': 'com.scb.pk.bmw',
  'com.scb.pk.bmw': 'com.scb.pk.bmw',

  'Askari Digital': 'com.askari',
  'Askari Bank': 'com.askari',
  'askari': 'com.askari',
  'com.askari': 'com.askari',

  'Soneri Digital': 'com.p3.soneridigital',
  'Soneri Bank': 'com.p3.soneridigital',
  'soneri': 'com.p3.soneridigital',
  'com.p3.soneridigital': 'com.p3.soneridigital',

  'Al Baraka App': 'pk.com.albaraka.mobileapp',
  'Al Baraka': 'pk.com.albaraka.mobileapp',
  'Al Baraka Bank Pakistan': 'pk.com.albaraka.mobileapp',
  'albaraka': 'pk.com.albaraka.mobileapp',
  'pk.com.albaraka.mobileapp': 'pk.com.albaraka.mobileapp',

  'SambaSmart App': 'com.samba.smart',
  'SambaSmart': 'com.samba.smart',
  'Samba Bank Pakistan': 'com.samba.smart',
  'samba': 'com.samba.smart',
  'com.samba.smart': 'com.samba.smart',

  'MIB Digital': 'com.mcbislamicbank.mobileapp',
  'MCB Islamic Bank': 'com.mcbislamicbank.mobileapp',
  'mcbislamic': 'com.mcbislamicbank.mobileapp',
  'com.mcbislamicbank.mobileapp': 'com.mcbislamicbank.mobileapp',

  'BankIslami App': 'com.bi.digitalbanking',
  'BankIslami Pakistan': 'com.bi.digitalbanking',
  'BankIslami': 'com.bi.digitalbanking',
  'bankislami': 'com.bi.digitalbanking',
  'com.bi.digitalbanking': 'com.bi.digitalbanking',

  'BoK Digital': 'com.temenos.bok',
  'Bank of Khyber (BoK)': 'com.temenos.bok',
  'bok': 'com.temenos.bok',
  'com.temenos.bok': 'com.temenos.bok',

  'Sindh Bank Mobile': 'com.SindhBank.MobileBanking',
  'Sindh Bank': 'com.SindhBank.MobileBanking',
  'sindhbank': 'com.SindhBank.MobileBanking',
  'com.SindhBank.MobileBanking': 'com.SindhBank.MobileBanking',

  'ZTBL Mobile': 'com.ztbl.android',
  'Zarai Taraqiati Bank Limited (ZTBL)': 'com.ztbl.android',
  'ztbl': 'com.ztbl.android',
  'com.ztbl.android': 'com.ztbl.android',

  'DIB Pakistan App': 'com.dibpak.mobilebanking',
  'Dubai Islamic Bank Pakistan (DIB)': 'com.dibpak.mobilebanking',
  'dib': 'com.dibpak.mobilebanking',
  'com.dibpak.mobilebanking': 'com.dibpak.mobilebanking',

  'HabibMetro App': 'com.avanza.ambitwizhmb',
  'Habib Metropolitan Bank (HabibMetro)': 'com.avanza.ambitwizhmb',
  'habibmetro': 'com.avanza.ambitwizhmb',
  'com.avanza.ambitwizhmb': 'com.avanza.ambitwizhmb',
};

const PAKISTANI_BANKS: BankAppInfo[] = [
  {
    id: 'meezan',
    name: 'Meezan Bank',
    shortName: 'Meezan Mobile',
    appScheme: 'meezan://',
    androidPackage: 'invo8.meezan.mb',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=invo8.meezan.mb',
    appStoreUrl: 'https://apps.apple.com/pk/app/meezan-bank-mobile-app/id1453297592',
    webPortalUrl: 'https://www.meezanbank.com/bill-payment/',
    color: '#065f46',
    logoBg: 'bg-emerald-900',
    logoText: 'MB',
  },
  {
    id: 'hbl',
    name: 'Habib Bank Limited (HBL)',
    shortName: 'HBL Mobile',
    appScheme: 'hblmobile://',
    androidPackage: 'com.hbl.android.hblmobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hbl.android.hblmobilebanking',
    appStoreUrl: 'https://apps.apple.com/pk/app/hbl-mobile/id1227387114',
    webPortalUrl: 'https://www.hbl.com/personal/ways-to-bank/digital-banking/bill-payment',
    color: '#047857',
    logoBg: 'bg-teal-700',
    logoText: 'HBL',
  },
  {
    id: 'alfalah',
    name: 'Bank Alfalah',
    shortName: 'Alfa App',
    appScheme: 'alfa://',
    androidPackage: 'com.base.bankalfalah',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.base.bankalfalah',
    appStoreUrl: 'https://apps.apple.com/pk/app/alfa-by-bank-alfalah/id1118331165',
    webPortalUrl: 'https://www.bankalfalah.com/personal-banking/digital-banking/bill-payments/',
    color: '#b91c1c',
    logoBg: 'bg-red-700',
    logoText: 'ALFA',
  },
  {
    id: 'mcb',
    name: 'MCB Bank',
    shortName: 'MCB Live',
    appScheme: 'mcblive://',
    androidPackage: 'com.mcb.mcblive',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mcb.mcblive',
    appStoreUrl: 'https://apps.apple.com/pk/app/mcb-live/id1527011400',
    webPortalUrl: 'https://www.mcb.com.pk/consumer/bill-payment',
    color: '#c2410c',
    logoBg: 'bg-orange-700',
    logoText: 'MCB',
  },
  {
    id: 'abl',
    name: 'Allied Bank Limited',
    shortName: 'myABL',
    appScheme: 'myabl://',
    androidPackage: 'com.ofss.digx.mobile.android.allied',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ofss.digx.mobile.android.allied',
    appStoreUrl: 'https://apps.apple.com/pk/app/myabl-digital-banking/id1220377041',
    webPortalUrl: 'https://www.abl.com/personal-banking/digital-banking/bill-payments/',
    color: '#1d4ed8',
    logoBg: 'bg-blue-700',
    logoText: 'myABL',
  },
  {
    id: 'ubl',
    name: 'United Bank Limited (UBL)',
    shortName: 'UBL Digital',
    appScheme: 'ubldigital://',
    androidPackage: 'app.com.brd',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.com.brd',
    appStoreUrl: 'https://apps.apple.com/pk/app/ubl-digital/id1382424915',
    webPortalUrl: 'https://www.ubldigital.com/Ways-to-Bank/Digital-Banking/Bill-Payment',
    color: '#0284c7',
    logoBg: 'bg-sky-700',
    logoText: 'UBL',
  },
  {
    id: 'faysal',
    name: 'Faysal Bank',
    shortName: 'Faysal Digibank',
    appScheme: 'faysaldigibank://',
    androidPackage: 'pk.com.faysalbank.digibank',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=pk.com.faysalbank.digibank',
    appStoreUrl: 'https://apps.apple.com/pk/app/faysal-digibank/id1507727192',
    webPortalUrl: 'https://www.faysalbank.com/en/personal/ways-to-bank/digital-banking/bill-payment/',
    color: '#1e3a8a',
    logoBg: 'bg-indigo-800',
    logoText: 'FBL',
  },
  {
    id: 'bop',
    name: 'The Bank of Punjab',
    shortName: 'BOP Mobile',
    appScheme: 'bopmobile://',
    androidPackage: 'com.digibop.mobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.digibop.mobile',
    appStoreUrl: 'https://apps.apple.com/pk/app/bop-mobile-banking/id1455437882',
    webPortalUrl: 'https://www.bop.com.pk/bill-payment',
    color: '#b45309',
    logoBg: 'bg-amber-700',
    logoText: 'BOP',
  },
  {
    id: 'nbp',
    name: 'National Bank of Pakistan (NBP)',
    shortName: 'NBP Digital',
    appScheme: 'nbpdigital://',
    androidPackage: 'com.paysys.nbpdigital',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.paysys.nbpdigital',
    appStoreUrl: 'https://apps.apple.com/pk/app/nbp-digital/id1459424422',
    webPortalUrl: 'https://www.nbp.com.pk/digital/billpayment.aspx',
    color: '#047857',
    logoBg: 'bg-emerald-800',
    logoText: 'NBP',
  },
  {
    id: 'bok',
    name: 'Bank of Khyber (BoK)',
    shortName: 'BoK Digital',
    appScheme: 'bokdigital://',
    androidPackage: 'com.temenos.bok',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.temenos.bok',
    appStoreUrl: 'https://apps.apple.com/pk/app/bok-digital/id1544315266',
    webPortalUrl: 'https://www.bok.com.pk/digital-banking/bill-payment',
    color: '#15803d',
    logoBg: 'bg-green-700',
    logoText: 'BOK',
  },
  {
    id: 'sindhbank',
    name: 'Sindh Bank',
    shortName: 'Sindh Bank Mobile',
    appScheme: 'sindhbank://',
    androidPackage: 'com.SindhBank.MobileBanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.SindhBank.MobileBanking',
    appStoreUrl: 'https://apps.apple.com/pk/app/sindh-bank-mobile-banking/id1499528751',
    webPortalUrl: 'https://sindhbank.com.pk/digital-banking/',
    color: '#b91c1c',
    logoBg: 'bg-red-800',
    logoText: 'SINDH',
  },
  {
    id: 'ztbl',
    name: 'Zarai Taraqiati Bank Limited (ZTBL)',
    shortName: 'ZTBL Mobile',
    appScheme: 'ztblmobile://',
    androidPackage: 'com.ztbl.android',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ztbl.android',
    appStoreUrl: 'https://apps.apple.com/pk/app/ztbl-mobile-banking/id1552084533',
    webPortalUrl: 'https://www.ztbl.com.pk/digital-banking/',
    color: '#166534',
    logoBg: 'bg-green-800',
    logoText: 'ZTBL',
  },
  {
    id: 'bankislami',
    name: 'BankIslami Pakistan',
    shortName: 'BankIslami App',
    appScheme: 'bankislami://',
    androidPackage: 'com.bi.digitalbanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bi.digitalbanking',
    appStoreUrl: 'https://apps.apple.com/pk/app/bankislami-mobile-banking/id1435777717',
    webPortalUrl: 'https://bankislami.com.pk/digital-banking/bill-payment/',
    color: '#7c2d12',
    logoBg: 'bg-amber-900',
    logoText: 'ISLAMI',
  },
  {
    id: 'dib',
    name: 'Dubai Islamic Bank Pakistan (DIB)',
    shortName: 'DIB Pakistan App',
    appScheme: 'dibpakistan://',
    androidPackage: 'com.dibpak.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dibpak.mobilebanking',
    appStoreUrl: 'https://apps.apple.com/pk/app/dib-pakistan-mobile-banking/id1478726588',
    webPortalUrl: 'https://www.dibpak.com/personal/ways-to-bank/electronic-banking/bill-payment/',
    color: '#854d0e',
    logoBg: 'bg-yellow-800',
    logoText: 'DIB',
  },
  {
    id: 'habibmetro',
    name: 'Habib Metropolitan Bank (HabibMetro)',
    shortName: 'HabibMetro App',
    appScheme: 'habibmetro://',
    androidPackage: 'com.avanza.ambitwizhmb',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.avanza.ambitwizhmb',
    appStoreUrl: 'https://apps.apple.com/pk/app/habibmetro-mobile/id1489146194',
    webPortalUrl: 'https://www.habibmetro.com/personal-banking/digital-banking/bill-payment/',
    color: '#0e7490',
    logoBg: 'bg-cyan-800',
    logoText: 'HMB',
  },
  {
    id: 'bankalhabib',
    name: 'Bank AL Habib (AL Habib)',
    shortName: 'Bank AL Habib App',
    appScheme: 'bankalhabib://',
    androidPackage: 'com.bankalhabib.digital',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bankalhabib.digital',
    appStoreUrl: 'https://apps.apple.com/pk/app/al-habib-digital/id1527376043',
    webPortalUrl: 'https://www.bankalhabib.com.pk/ways-to-bank/bill-payment',
    color: '#0369a1',
    logoBg: 'bg-sky-800',
    logoText: 'BAHL',
  },
  {
    id: 'scb',
    name: 'Standard Chartered Pakistan',
    shortName: 'SC Mobile',
    appScheme: 'scmobilepk://',
    androidPackage: 'com.scb.pk.bmw',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.scb.pk.bmw',
    appStoreUrl: 'https://apps.apple.com/pk/app/sc-mobile-pakistan/id948624135',
    webPortalUrl: 'https://www.sc.com/pk/ways-to-bank/online-banking/utility-bill-payment/',
    color: '#059669',
    logoBg: 'bg-teal-800',
    logoText: 'SCB',
  },
  {
    id: 'askari',
    name: 'Askari Bank',
    shortName: 'Askari Digital',
    appScheme: 'askaridigital://',
    androidPackage: 'com.askari',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.askari',
    appStoreUrl: 'https://apps.apple.com/pk/app/askari-digital-banking/id1447035654',
    webPortalUrl: 'https://askaribank.com/personal-banking/digital-banking/bill-payment/',
    color: '#1e40af',
    logoBg: 'bg-blue-800',
    logoText: 'AKBL',
  },
  {
    id: 'jsbank',
    name: 'JS Bank',
    shortName: 'JS Mobile App',
    appScheme: 'jsmobile://',
    androidPackage: 'com.jsbl.jsmobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.jsbl.jsmobile',
    appStoreUrl: 'https://apps.apple.com/pk/app/js-mobile-banking/id1156826955',
    webPortalUrl: 'https://jsbl.com/personal-banking/digital-banking/bill-payments/',
    color: '#ea580c',
    logoBg: 'bg-amber-600',
    logoText: 'JS',
  },
  {
    id: 'soneri',
    name: 'Soneri Bank',
    shortName: 'Soneri Digital',
    appScheme: 'soneridigital://',
    androidPackage: 'com.p3.soneridigital',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.p3.soneridigital',
    appStoreUrl: 'https://apps.apple.com/pk/app/soneri-digital/id1535973307',
    webPortalUrl: 'https://www.soneribank.com/digital-banking/bill-payments/',
    color: '#d97706',
    logoBg: 'bg-yellow-700',
    logoText: 'SNBL',
  },
  {
    id: 'albaraka',
    name: 'Al Baraka Bank Pakistan',
    shortName: 'Al Baraka App',
    appScheme: 'albaraka://',
    androidPackage: 'pk.com.albaraka.mobileapp',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=pk.com.albaraka.mobileapp',
    appStoreUrl: 'https://apps.apple.com/pk/app/albaraka-pakistan/id1546944321',
    webPortalUrl: 'https://www.albaraka.com.pk/digital-banking/bill-payment/',
    color: '#4d7c0f',
    logoBg: 'bg-lime-800',
    logoText: 'BARAKA',
  },
  {
    id: 'samba',
    name: 'Samba Bank Pakistan',
    shortName: 'SambaSmart App',
    appScheme: 'sambasmart://',
    androidPackage: 'com.samba.smart',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.samba.smart',
    appStoreUrl: 'https://apps.apple.com/pk/app/sambasmart-pakistan/id1485605510',
    webPortalUrl: 'https://www.samba.com.pk/digital-banking/bill-payment/',
    color: '#4338ca',
    logoBg: 'bg-indigo-700',
    logoText: 'SAMBA',
  },
  {
    id: 'mcbislamic',
    name: 'MCB Islamic Bank',
    shortName: 'MIB Digital',
    appScheme: 'mibdigital://',
    androidPackage: 'com.mcbislamicbank.mobileapp',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mcbislamicbank.mobileapp',
    appStoreUrl: 'https://apps.apple.com/pk/app/mib-digital-mobile-banking/id1527415309',
    webPortalUrl: 'https://www.mcbislamicbank.com/digital-banking/bill-payment/',
    color: '#047857',
    logoBg: 'bg-emerald-700',
    logoText: 'MIB',
  },
];

interface BillPaymentModalProps {
  bill: GeneratedBill | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPaymentSuccess?: (bill: GeneratedBill, transactionId: string) => void;
  onNavigateToAdmin?: () => void;
}

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  bill,
  isOpen,
  onClose,
  lang,
}) => {
  // Active selected app: 'jazzcash' | 'easypaisa' | 'bank'
  const [selectedApp, setSelectedApp] = useState<'jazzcash' | 'easypaisa' | 'bank'>('jazzcash');
  const selectedChannel: 'JazzCash' | 'Easypaisa' | 'BankApp' =
    selectedApp === 'jazzcash' ? 'JazzCash' : (selectedApp === 'easypaisa' ? 'Easypaisa' : 'BankApp');
  const [selectedBank, setSelectedBank] = useState<BankAppInfo>(PAKISTANI_BANKS[0]);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Filtered banks for search
  const filteredBanks = useMemo(() => {
    if (!bankSearchQuery.trim()) return PAKISTANI_BANKS;
    const q = bankSearchQuery.toLowerCase().trim();
    return PAKISTANI_BANKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.logoText.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
    );
  }, [bankSearchQuery]);

  // CHECK STATUS State
  const [showStatusChecker, setShowStatusChecker] = useState(false);
  const [checkRefNo, setCheckRefNo] = useState(bill?.referenceNo || '06154540709308');
  const [checkCompany, setCheckCompany] = useState(bill?.company.id || 'mepco');
  const [checkMonth, setCheckMonth] = useState(bill?.billMonth || 'OCT 26');

  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    status: 'PAID' | 'UNPAID';
    message: string;
    urduMessage: string;
    details: {
      referenceNo: string;
      company: string;
      month: string;
      amount?: number;
      dueDate?: string;
      consumerName?: string;
      source: string;
    };
  } | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Sync state when bill changes
  useEffect(() => {
    if (bill) {
      setCheckRefNo(bill.referenceNo);
      setCheckCompany(bill.company.id);
      setCheckMonth(bill.billMonth || 'OCT 26');
      setCheckResult(null);
      setCheckError(null);
    }
  }, [bill]);

  // Compute last 12 months for dropdown
  const last12Months = useMemo(() => {
    const list: string[] = [];
    const currentMonth = bill?.billMonth || 'OCT 26';
    list.push(currentMonth);

    if (bill?.history && bill.history.length > 0) {
      bill.history.forEach((h) => {
        if (!list.includes(h.month)) {
          list.push(h.month);
        }
      });
    } else {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const now = new Date();
      for (let i = 1; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mStr = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
        if (!list.includes(mStr)) {
          list.push(mStr);
        }
      }
    }
    return list.slice(0, 12);
  }, [bill]);

  if (!isOpen || !bill) return null;

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 3500);
  };

  const handleCopy = (text: string, field: string, toastMessage?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (toastMessage) {
      showToast(toastMessage);
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyBillDetailsAndToast = () => {
    // Write reference number into clipboard so user can immediately paste it into consumer number input
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bill.referenceNo);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = bill.referenceNo;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    setCopiedField('ref');
    showToast(
      lang === 'ur'
        ? (isMobileClient()
            ? `ریفرنس نمبر (${bill.referenceNo}) اور رقم (Rs. ${bill.payableWithinDueDate.toLocaleString()}) کاپی ہو گئے! ایپ میں پیسٹ کریں۔`
            : `ریفرنس نمبر اور رقم کاپی ہو گئے۔ ویب سائٹ اوپن ہو رہی ہے۔`)
        : (isMobileClient()
            ? `Reference #${bill.referenceNo} & Amount Rs. ${bill.payableWithinDueDate.toLocaleString()} copied! Paste in app.`
            : `Reference #${bill.referenceNo} & Amount Rs. ${bill.payableWithinDueDate.toLocaleString()} copied! Opening website.`)
    );
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Device detection helpers
  const isMobileClient = (): boolean => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isTouchWithNarrowScreen = (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
    return mobileRegex.test(ua) || isTouchWithNarrowScreen;
  };

  const isAndroidClient = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /Android/i.test(navigator.userAgent || '');
  };

  const isIOSClient = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  };

  // Copy reference number helper
  const copyRefToClipboard = (refNo: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(refNo);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = refNo;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    setCopiedField('ref');
  };

  // User's exact Pay Bill handler:
  // 1. Reference copy karo bas - toast dikhao
  // 2. Direct App open karo - bas itna hi (intent://#Intent;action=android.intent.action.MAIN;package=${packageName};end)
  // NO PLAY STORE, NO TIMEOUT, NO SECOND REDIRECT
  function onPayBillClick(packageName: string, referenceNo: string, appName?: string) {
    // 1. Reference copy karo bas - toast dikhao
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(referenceNo);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = referenceNo;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
    setCopiedField('ref');
    showToast(
      lang === 'ur'
        ? `ریفرنس نمبر (${referenceNo}) کاپی ہو گیا! ${appName || ''} ایپ اوپن ہو رہی ہے...`
        : `Reference #${referenceNo} copied! Opening ${appName || ''} app...`
    );

    // 2. Direct App open karo - bas itna hi (target _top)
    const intentUrl = `intent://#Intent;action=android.intent.action.MAIN;package=${packageName};end`;
    try {
      if (window.top && window.top !== window) {
        window.top.location.href = intentUrl;
      } else {
        window.location.href = intentUrl;
      }
    } catch {
      window.location.href = intentUrl;
    }
    // NO PLAY STORE, NO TIMEOUT, NO SECOND REDIRECT
  }

  function openBankApp(appName: string) {
    const pkg = BANK_PACKAGES[appName] || selectedBank?.androidPackage || 'invo8.meezan.mb';
    const refNo = bill?.referenceNo || '06154540709308';
    onPayBillClick(pkg, refNo, appName);
  }

  // Direct Pay Bill opener - opens selected app directly
  function payBill(appOverride?: 'jazzcash' | 'easypaisa' | 'bank') {
    const target = appOverride || selectedApp;
    if (target === 'jazzcash') {
      openBankApp('JazzCash');
    } else if (target === 'easypaisa') {
      openBankApp('Easypaisa');
    } else {
      openBankApp(selectedBank?.shortName || selectedBank?.name || 'Alfa App');
    }
  }

  const handleLaunchJazzCash = () => {
    setSelectedApp('jazzcash');
  };

  const handleLaunchEasypaisa = () => {
    setSelectedApp('easypaisa');
  };

  const handleSelectBankApp = (bank: BankAppInfo) => {
    setSelectedBank(bank);
    setSelectedApp('bank');
  };

  // Official PayPro 1LINK Bill Inquiry check
  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanRef = checkRefNo.trim().replace(/[^0-9]/g, '');

    if (!cleanRef || cleanRef.length < 10) {
      setCheckError('Status check nahi ho saka, dobara try karein');
      return;
    }

    setIsChecking(true);
    setCheckError(null);
    setCheckResult(null);

    try {
      // Call real backend 1LINK inquiry API using PayPro & live DISCO gateway
      const res = await fetch('/api/paypro/1link-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNo: cleanRef,
          month: checkMonth,
          company: checkCompany,
        }),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success && responseData.data) {
        const item = responseData.data;
        const isPaid = item.status === 'PAID';

        setCheckResult({
          status: isPaid ? 'PAID' : 'UNPAID',
          message: isPaid
            ? 'IS MONTH KA BILL APKA PAY HO CHUKA HAI'
            : 'IS MONTH KA BILL APKA PAY NAHI HUA',
          urduMessage: isPaid
            ? 'اس مہینے کا بل آپ کا ادا ہو چکا ہے'
            : 'اس مہینے کا بل آپ کا ادا نہیں ہوا',
          details: {
            referenceNo: item.referenceNo || cleanRef,
            company: item.company,
            month: item.month || checkMonth,
            amount: item.amount, // Exact amount from real API
            dueDate: item.dueDate, // Exact due date from real API
            consumerName: item.consumerName,
            source: item.source || 'PayPro 1LINK Live Network',
          },
        });
      } else {
        // If API fails or returns error, show: "Status check nahi ho saka, dobara try karein"
        setCheckResult(null);
        setCheckError('Status check nahi ho saka, dobara try karein');
      }
    } catch (err: any) {
      console.error('1LINK Inquiry network error:', err);
      setCheckResult(null);
      setCheckError('Status check nahi ho saka, dobara try karein');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Floating Notification Toast */}
        {copyToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 text-emerald-200 border border-emerald-500/50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 max-w-[90%] animate-in fade-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{copyToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>{lang === 'ur' ? 'بل کی براہِ راست ادائیگی (Link Model)' : 'Link Model · 1LINK Direct Payment'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  1Link 1Bill
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ur' 
                  ? 'رقم براہِ راست آپ کے بینک یا جاز کیش/ایزی پیسہ ایپ سے کمپنی کے اکاؤنٹ میں جائے گی' 
                  : 'Money goes directly from your own bank/wallet app to utility company'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-6">

          {/* 1. BILL DETAILS SUMMARY (Company, Customer Name, Reference No, Amount, Due Date) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-xl border border-slate-700/80 shadow-xs">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{lang === 'ur' ? 'بل کی تفصیلات' : 'Official Bill Details'}</span>
              <span className="text-slate-300 font-mono">{bill.billMonth}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Company</span>
                <span className="font-extrabold text-white text-sm">{bill.company.shortName || bill.company.name}</span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Customer Name</span>
                <span className="font-bold text-slate-100 truncate block" title={bill.consumerName}>{bill.consumerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Due Date</span>
                <span className="font-bold text-amber-300">{bill.dueDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              {/* Reference Number with Copy */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Reference Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-black text-sm sm:text-base text-white tracking-wide">{bill.referenceNo}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bill.referenceNo, 'ref', `Reference #${bill.referenceNo} copied!`)}
                    className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Copy Reference Number"
                  >
                    {copiedField === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Amount with Copy */}
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Payable Amount</span>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <span className="font-mono font-black text-lg sm:text-xl text-emerald-400">
                    Rs. {bill.payableWithinDueDate.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(String(bill.payableWithinDueDate), 'amt', `Amount Rs. ${bill.payableWithinDueDate} copied!`)}
                    className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title="Copy Amount"
                  >
                    {copiedField === 'amt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. "PAY YOUR BILL - SELECT YOUR APP" SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ur' ? 'اپنا بل ادا کریں - ایپ منتخب کریں' : 'PAY YOUR BILL · SELECT YOUR APP'}</span>
              </h4>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1Link Direct
              </span>
            </div>

            {/* 3 Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Button 1: Pay via JazzCash App */}
              <button
                type="button"
                onClick={() => setSelectedApp('jazzcash')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedApp === 'jazzcash'
                    ? 'border-2 border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/50'
                    : 'border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                }`}
                style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#ED1C24,#FFA500)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                    JC
                  </div>
                  {selectedApp === 'jazzcash' ? (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <span
                  className="font-extrabold text-slate-900 block"
                  style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                >
                  JazzCash App - 1Bill Payment
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Direct 1Bill Utility Payment</span>
              </button>

              {/* Button 2: Pay via Easypaisa App */}
              <button
                type="button"
                onClick={() => setSelectedApp('easypaisa')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedApp === 'easypaisa'
                    ? 'border-2 border-amber-500 bg-emerald-50/70 shadow-md ring-2 ring-amber-400/50'
                    : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                }`}
                style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div style={{ width: '40px', height: '40px', background: '#00B44F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                    EP
                  </div>
                  {selectedApp === 'easypaisa' ? (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <span
                  className="font-extrabold text-slate-900 block"
                  style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                >
                  Easypaisa App - 1Bill Payment
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Direct 1Bill Utility Payment</span>
              </button>

              {/* Button 3: Pay via Bank App (Meezan, HBL, Alfalah, etc) */}
              <button
                type="button"
                onClick={() => setSelectedApp('bank')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedApp === 'bank'
                    ? 'border-2 border-amber-500 bg-indigo-50/70 shadow-md ring-2 ring-amber-400/50'
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                }`}
                style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div style={{ width: '40px', height: '40px', background: '#1a3a5f', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
                    🏦
                  </div>
                  {selectedApp === 'bank' ? (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <span
                  className="font-extrabold text-slate-900 block"
                  style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                >
                  Bank App - 1Bill Payment
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Meezan, HBL, Alfalah, MCB...</span>
              </button>
            </div>

            {/* CHANNEL 1: JAZZCASH ASSISTANT PANEL */}
            {selectedChannel === 'JazzCash' && (
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-3.5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#ED1C24,#FFA500)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }} className="shrink-0">
                      JC
                    </div>
                    <div className="min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                      <h5
                        className="font-extrabold text-slate-900"
                        style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                      >
                        JazzCash App - 1Bill Payment
                      </h5>
                      <p className="text-[11px] text-slate-600">Reference Number & Payable Amount ready to paste</p>
                    </div>
                  </div>

                  {/* Pay Bill Button - JazzCash Direct Opener */}
                  <button
                    type="button"
                    onClick={() => onPayBillClick('com.techlogix.mobilinkcustomer', bill.referenceNo, 'JazzCash')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', fontSize: '14px' }}
                  >
                    <span>Pay Bill - JazzCash</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Pre-populated Copy Boxes for JazzCash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Reference No */}
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">1Link Reference Number</span>
                      <span className="font-mono font-black text-slate-900">{bill.referenceNo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bill.referenceNo, 'ref', `Reference #${bill.referenceNo} copied!`)}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'ref' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'ref' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Payable Amount</span>
                      <span className="font-mono font-black text-emerald-700">Rs. {bill.payableWithinDueDate.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(String(bill.payableWithinDueDate), 'amt', `Amount Rs. ${bill.payableWithinDueDate} copied!`)}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'amt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'amt' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick 3-Step Guide */}
                <div className="text-[11px] text-slate-700 space-y-1 bg-white/60 p-2.5 rounded-xl border border-amber-200/80">
                  <div className="font-bold text-slate-900 mb-0.5">Quick Steps in JazzCash:</div>
                  <p>1. Open JazzCash App &rarr; tap <strong>Utility Bills</strong> &rarr; <strong>Electricity</strong></p>
                  <p>2. Select <strong>{bill.company.shortName || bill.company.name}</strong> (or 1Bill) &rarr; paste Reference No: <strong className="font-mono">{bill.referenceNo}</strong></p>
                  <p>3. Confirm payment of <strong className="font-mono text-emerald-700">Rs. {bill.payableWithinDueDate.toLocaleString()}</strong> with your MPIN.</p>
                </div>

                {/* Official Web Portal Link */}
                <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                  <a
                    href="https://www.jazzcash.com.pk/bill-payment/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1.5 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official JazzCash Bill Payment Portal</span>
                  </a>
                </div>
              </div>
            )}

            {/* CHANNEL 2: EASYPAISA ASSISTANT PANEL */}
            {selectedChannel === 'Easypaisa' && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3.5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                    <div style={{ width: '40px', height: '40px', background: '#00B44F', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }} className="shrink-0">
                      EP
                    </div>
                    <div className="min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                      <h5
                        className="font-extrabold text-slate-900"
                        style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                      >
                        Easypaisa App - 1Bill Payment
                      </h5>
                      <p className="text-[11px] text-slate-600">Reference Number & Payable Amount ready to paste</p>
                    </div>
                  </div>

                  {/* Pay Bill Button - Easypaisa Direct Opener */}
                  <button
                    type="button"
                    onClick={() => onPayBillClick('pk.com.telenor.phoenix', bill.referenceNo, 'Easypaisa')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', fontSize: '14px' }}
                  >
                    <span>Pay Bill - Easypaisa</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Pre-populated Copy Boxes for Easypaisa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Reference No */}
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">1Link Reference Number</span>
                      <span className="font-mono font-black text-slate-900">{bill.referenceNo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bill.referenceNo, 'ref', `Reference #${bill.referenceNo} copied!`)}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'ref' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'ref' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Payable Amount</span>
                      <span className="font-mono font-black text-emerald-700">Rs. {bill.payableWithinDueDate.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(String(bill.payableWithinDueDate), 'amt', `Amount Rs. ${bill.payableWithinDueDate} copied!`)}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'amt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'amt' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick 3-Step Guide */}
                <div className="text-[11px] text-slate-700 space-y-1 bg-white/60 p-2.5 rounded-xl border border-emerald-200/80">
                  <div className="font-bold text-slate-900 mb-0.5">Quick Steps in Easypaisa:</div>
                  <p>1. Open Easypaisa App &rarr; tap <strong>Bill Payment</strong> &rarr; <strong>Electricity</strong></p>
                  <p>2. Select <strong>{bill.company.shortName || bill.company.name}</strong> &rarr; paste Reference No: <strong className="font-mono">{bill.referenceNo}</strong></p>
                  <p>3. Tap <strong>Pay Now</strong> to pay <strong className="font-mono text-emerald-700">Rs. {bill.payableWithinDueDate.toLocaleString()}</strong> instantly.</p>
                </div>

                {/* Official Web Portal & Verified Store Link */}
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px]">
                  <a
                    href="https://www.easypaisa.com.pk/bill-payments/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-900 hover:text-emerald-950 font-bold flex items-center gap-1.5 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Easypaisa Bill Payments Portal</span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 hover:underline text-[10px]"
                  >
                    <span>Google Play</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* CHANNEL 3: BANK APP SELECTOR & ASSISTANT PANEL */}
            {selectedChannel === 'BankApp' && (
              <div className="p-4 bg-indigo-50/80 border border-indigo-300 rounded-2xl space-y-4 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-200">
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-700" />
                      <span>Select Your Pakistani Bank App (1Link 1Bill):</span>
                    </h5>
                    <p className="text-[11px] text-slate-600">Choose from 23+ major Pakistani banks to pay directly via 1Bill</p>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded w-fit">
                    {filteredBanks.length} / {PAKISTANI_BANKS.length} Banks
                  </span>
                </div>

                {/* Bank Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={bankSearchQuery}
                    onChange={(e) => setBankSearchQuery(e.target.value)}
                    placeholder="Search bank name (e.g. Meezan, NBP, Habib, SCB, Sindh, Askari, ZTBL...)"
                    className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder:text-slate-400 text-slate-800 shadow-2xs"
                  />
                  {bankSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBankSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Scrollable Bank Grid */}
                <div className="max-h-60 overflow-y-auto pr-1">
                  {filteredBanks.length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-500 bg-white/70 rounded-xl border border-indigo-100">
                      No bank found matching "{bankSearchQuery}".
                      <button
                        type="button"
                        onClick={() => setBankSearchQuery('')}
                        className="block mx-auto mt-1.5 text-indigo-600 hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {filteredBanks.map((bank) => {
                        const isSelected = selectedBank.id === bank.id;
                        return (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                onPayBillClick(bank.androidPackage, bill.referenceNo, bank.shortName);
                              } else {
                                handleSelectBankApp(bank);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] group ${
                              isSelected
                                ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-400'
                                : 'bg-white/80 hover:bg-white border-indigo-200/80 hover:border-indigo-400'
                            }`}
                            title={isSelected ? `Tap again to Pay with ${bank.shortName}` : `Select ${bank.name}`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`text-[10px] font-black text-white px-1.5 py-0.5 rounded ${bank.logoBg}`}>
                                {bank.logoText}
                              </span>
                              {isSelected ? (
                                <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1 rounded flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5 text-indigo-600" />
                                  <span>PAY</span>
                                </span>
                              ) : null}
                            </div>
                            <span className="font-bold text-[11px] text-slate-900 truncate block">
                              {bank.shortName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Bank Helper Card */}
                {selectedBank && (
                  <div className="p-3.5 bg-white rounded-xl border border-indigo-200 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                        <span className={`text-xs font-black text-white px-2 py-1 rounded-md shrink-0 ${selectedBank.logoBg}`}>
                          {selectedBank.logoText}
                        </span>
                        <div className="min-w-0 flex-1" style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%' }}>
                          <h6
                            className="font-extrabold text-slate-900"
                            style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', width: '100%', fontSize: '14px' }}
                          >
                            {selectedBank.name} - 1Bill Payment
                          </h6>
                          <span className="text-[10px] text-slate-500">Official Mobile App</span>
                        </div>
                      </div>

                      {/* Pay Bill Action Buttons - Bank Direct Opener & Play Store Link */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const pkg = selectedBank?.androidPackage || BANK_PACKAGES[selectedBank?.shortName] || BANK_PACKAGES[selectedBank?.name] || 'invo8.meezan.mb';
                            onPayBillClick(pkg, bill.referenceNo, selectedBank?.shortName || selectedBank?.name);
                          }}
                          className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                          style={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', fontSize: '14px' }}
                        >
                          <span>Pay Bill - {selectedBank?.shortName || 'Bank App'}</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <a
                          href={selectedBank?.playStoreUrl || `https://play.google.com/store/apps/details?id=${selectedBank?.androidPackage || 'invo8.meezan.mb'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 border border-slate-300"
                          title="Open in Google Play Store"
                        >
                          <span>Play Store</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Pre-populated Copy Boxes for Bank */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Reference No */}
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">1Link Consumer / Ref No:</span>
                          <span className="font-mono font-bold text-slate-900">{bill.referenceNo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(bill.referenceNo, 'ref', `Reference #${bill.referenceNo} copied!`)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-[10px] rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'ref' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'ref' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Amount */}
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Payable Amount:</span>
                          <span className="font-mono font-bold text-emerald-700">Rs. {bill.payableWithinDueDate.toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(String(bill.payableWithinDueDate), 'amt', `Amount Rs. ${bill.payableWithinDueDate} copied!`)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'amt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'amt' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 1Link Instructions */}
                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200">
                      Inside <strong>{selectedBank.shortName}</strong>, navigate to: <strong>Bill Payments &rarr; 1Bill / Utility &rarr; {bill.company.shortName || bill.company.name}</strong>, paste your Reference Number (<strong className="font-mono">{bill.referenceNo}</strong>) and submit.
                    </p>

                    {/* Official Web Portal Link */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                      <a
                        href={selectedBank.webPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{selectedBank.name} Official 1Link Web Portal</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. CHECK STATUS SECTION */}
          <div className="pt-2 border-t border-slate-200">
            {!showStatusChecker ? (
              /* Single "CHECK STATUS" Button */
              <button
                type="button"
                onClick={() => setShowStatusChecker(true)}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-slate-700 hover:border-emerald-500"
              >
                <Search className="w-5 h-5 text-emerald-400" />
                <span className="tracking-wide">CHECK STATUS</span>
              </button>
            ) : (
              /* Check Status Interface */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {lang === 'ur' ? '1LINK سرکاری بل انکوائری' : 'Official 1LINK Bill Status Inquiry'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ur' ? 'کسی بھی مہینے کے بل کی ادائیگی کی تصدیق کریں' : 'Verify real-time PAID / UNPAID status for any billing month'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStatusChecker(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                {checkError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{checkError}</span>
                  </div>
                )}

                <form onSubmit={handleCheck} className="space-y-4">
                  {/* Input 1: Reference Number */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                      {lang === 'ur' ? '1. ریفرنس نمبر (Reference Number):' : '1. Reference Number:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={checkRefNo}
                      onChange={(e) => setCheckRefNo(e.target.value)}
                      placeholder="e.g. 06154540709308"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Input 2: Month Selector (Dropdown with last 12 months) */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1.5 flex items-center justify-between">
                      <span>{lang === 'ur' ? '2. مہینہ منتخب کریں (Select Month):' : '2. Month Selector (Last 12 Months):'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Last 12 Months</span>
                    </label>
                    <div className="relative">
                      <select
                        value={checkMonth}
                        onChange={(e) => setCheckMonth(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
                      >
                        {last12Months.map((m, idx) => (
                          <option key={m} value={m}>
                            {m} {idx === 0 ? '(Current Bill Month / موجودہ بل)' : ''}
                          </option>
                        ))}
                      </select>
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Input 3: Company Selector (MEPCO etc) */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                      {lang === 'ur' ? '3. بجلی کمپنی منتخب کریں (Company):' : '3. Company Selector (MEPCO etc):'}
                    </label>
                    <div className="relative">
                      <select
                        value={checkCompany}
                        onChange={(e) => setCheckCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
                      >
                        {UTILITY_COMPANIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.shortName} - {c.name} ({c.category.toUpperCase()})
                          </option>
                        ))}
                      </select>
                      <Building className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* CHECK Button */}
                  <button
                    type="submit"
                    disabled={isChecking}
                    className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isChecking ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Checking 1LINK Database...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>CHECK</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Inquiry Result Display */}
                {checkResult && (
                  <div
                    className={`mt-4 p-5 rounded-2xl border-2 text-center transition-all ${
                      checkResult.status === 'PAID'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                        : 'bg-rose-50 border-rose-400 text-rose-950 shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ${
                        checkResult.status === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {checkResult.status === 'PAID' ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <AlertCircle className="w-8 h-8" />
                      )}
                    </div>

                    {/* Prominent Exact Result Message */}
                    <div className="space-y-1 mb-3">
                      <h3
                        className={`text-lg sm:text-xl font-black tracking-wide ${
                          checkResult.status === 'PAID' ? 'text-emerald-900' : 'text-rose-900'
                        }`}
                      >
                        {checkResult.message}
                      </h3>
                      <p
                        className={`text-sm font-bold ${
                          checkResult.status === 'PAID' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {checkResult.urduMessage}
                      </p>
                    </div>

                    {/* Inquiry Details Badge */}
                    <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-left max-w-sm mx-auto space-y-1.5 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Reference No:</span>
                        <span className="font-bold">{checkResult.details.referenceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Selected Month:</span>
                        <span className="font-bold text-slate-900">{checkResult.details.month}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Company:</span>
                        <span className="font-bold">{checkResult.details.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Bill Status:</span>
                        <span
                          className={`font-black uppercase px-2 py-0.5 rounded text-[11px] ${
                            checkResult.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {checkResult.status} {checkResult.status === 'PAID' ? '(ادا شدہ)' : '(غیر ادا شدہ)'}
                        </span>
                      </div>
                      {checkResult.details.amount ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">
                            {checkResult.status === 'PAID' ? 'Paid Amount:' : 'Payable Amount:'}
                          </span>
                          <span className="font-bold text-slate-900">
                            Rs. {checkResult.details.amount.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                      {checkResult.status === 'UNPAID' && checkResult.details.dueDate ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">Due Date:</span>
                          <span className="font-bold text-amber-700">{checkResult.details.dueDate}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
