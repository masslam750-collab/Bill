export type UtilityCategory = 'electricity' | 'gas' | 'water' | 'telecom';

export interface UtilityCompany {
  id: string;
  name: string;
  shortName: string;
  urduName: string;
  category: UtilityCategory;
  coverage: string[];
  urduCoverage: string;
  refLabel: string;
  urduRefLabel: string;
  refLength: number | number[]; // e.g. 14 or [14, 10]
  refFormatExample: string;
  sampleRef: string;
  helpline: string;
  website: string;
  officialCheckUrl: string;
  color: string;
  accentBg: string;
  description: string;
  urduDescription: string;
  guidelines: string[];
}

export interface GeneratedBill {
  company: UtilityCompany;
  referenceNo: string;
  consumerId: string;
  consumerName: string;
  address: string;
  feederName: string;
  subDivision: string;
  meterNo: string;
  tariff: string;
  connectionDate: string;
  sanctionLoad: string;
  billMonth: string;
  issueDate: string;
  dueDate: string;
  readingDate: string;
  prevReading: number;
  currentReading: number;
  unitsConsumed: number;
  costOfElectricity: number;
  meterRent: number;
  fuelPriceAdjustment: number;
  fcSurcharge: number;
  tariffAdjustment: number;
  electricityDuty: number;
  salesTax: number;
  tvFee: number;
  subsidies?: number;
  totalCurrentBill: number;
  arrears: number;
  payableWithinDueDate: number;
  latePaymentSurcharge: number;
  payableAfterDueDate: number;
  paymentStatus: 'Unpaid' | 'Paid';
  history: Array<{
    month: string;
    units: number;
    bill: number;
    payment: number;
    status: string;
  }>;
}

export interface SavedBill {
  id: string;
  companyId: string;
  label: string;
  referenceNo: string;
  addedAt: string;
  lastAmount?: number;
  lastDueDate?: string;
}

export interface TariffCalculation {
  units: number;
  category: 'domestic_protected' | 'domestic_unprotected' | 'commercial' | 'industrial';
  isTou: boolean;
  peakUnits?: number;
  offPeakUnits?: number;
  baseCost: number;
  fpa: number;
  fcSurcharge: number;
  qtrAdjustment: number;
  electricityDuty: number;
  salesTax: number;
  tvFee: number;
  totalPayable: number;
}

export interface PaymentSubmission {
  id: string;
  referenceNo: string;
  companyId: string;
  companyName: string;
  customerName: string;
  amount: number;
  dueDate: string;
  channel: 'JazzCash' | 'Easypaisa' | 'BankApp';
  transactionId: string;
  submittedAt: string;
  receiptImage?: string; // base64 or image URL
  receiptFileName?: string;
  status: 'Pending Verification' | 'PAID' | 'Rejected';
  verifiedAt?: string;
  notes?: string;
  autoVerified?: boolean;
}
