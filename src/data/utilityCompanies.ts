import { UtilityCompany } from '../types';

export const UTILITY_COMPANIES: UtilityCompany[] = [
  // Electricity DISCOs
  {
    id: 'mepco',
    name: 'MEPCO',
    shortName: 'MEPCO',
    urduName: 'میپکو (ملتان الیکٹرک پاور کمپنی)',
    category: 'electricity',
    coverage: ['Multan', 'Bahawalpur', 'D.G. Khan', 'Muzaffargarh', 'Sahiwal', 'Rahim Yar Khan', 'Vehari', 'Khanewal', 'Lodhran', 'Layyah', 'Pakpattan'],
    urduCoverage: 'ملتان، بہاولپور، ڈیرہ غازی خان، مظفر گڑھ، ساہیوال، رحیم یار خان، وہاڑی، خانیوال',
    refLabel: '14-Digit Reference No / 10-Digit Consumer ID',
    urduRefLabel: '14 ہندسوں کا حوالہ نمبر یا 10 ہندسوں کی صارف آئی ڈی',
    refLength: [14, 10],
    refFormatExample: '06 15454 0709308 U',
    sampleRef: '06154540709308',
    helpline: '0800-63726 / 118',
    website: 'https://mepco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/mepcobill',
    color: '#0284c7', // Sky / Blue
    accentBg: '#e0f2fe',
    description: 'Multan Electric Power Company provides electricity to southern Punjab, covering 13 districts.',
    urduDescription: 'میپکو جنوبی پنجاب کے 13 اضلاع بشمول ملتان، بہاولپور اور ڈیرہ غازی خان کو بجلی فراہم کرتی ہے۔',
    guidelines: [
      'Enter the 14-digit reference number printed in the top box of your bill without spaces.',
      'You can also check bill via 10-digit Consumer ID.',
      'Check whether your bill ends with "U" (Urban) or "R" (Rural).'
    ]
  },
  {
    id: 'lesco',
    name: 'LESCO',
    shortName: 'LESCO',
    urduName: 'لیسکو (لاہور الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Lahore', 'Kasur', 'Okara', 'Nankana Sahib', 'Sheikhupura'],
    urduCoverage: 'لاہور، قصور، اوکاڑہ، ننکانہ صاحب، شیخوپورہ',
    refLabel: '14-Digit Reference No / 7-8 Digit Customer ID',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر یا کسٹمر آئی ڈی',
    refLength: [14, 8, 7],
    refFormatExample: '08 11223 0987600 U',
    sampleRef: '08112230987600',
    helpline: '118 / 042-99204814',
    website: 'https://lesco.gov.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/lescobill',
    color: '#16a34a', // Emerald
    accentBg: '#dcfce7',
    description: 'Lahore Electric Supply Company delivers power across Lahore division, Kasur, Sheikhupura, and Okara.',
    urduDescription: 'لیسکو لاہور ڈویژن، قصور، شیخوپورہ اور اوکاڑہ کے صارفین کو بجلی کی ترسیل انجام دیتی ہے۔',
    guidelines: [
      'Found right under the consumer name and address in the top left corner.',
      'Ensure you enter all 14 digits or use the 7-digit Customer ID.'
    ]
  },
  {
    id: 'fesco',
    name: 'FESCO',
    shortName: 'FESCO',
    urduName: 'فیسکو (فیصل آباد الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Faisalabad', 'Sargodha', 'Jhang', 'Toba Tek Singh', 'Mianwali', 'Khushab', 'Chiniot', 'Bhakkar'],
    urduCoverage: 'فیصل آباد، سرگودھا، جھنگ، ٹوبہ ٹیک سنگھ، میانوالی، خوشاب، چنیوٹ، بھکر',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '12 13111 0123400 R',
    sampleRef: '12131110123400',
    helpline: '118 / 041-9220184',
    website: 'https://fesco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/fescobill',
    color: '#2563eb',
    accentBg: '#dbeafe',
    description: 'Faisalabad Electric Supply Company powers 8 industrial and agricultural districts of central & western Punjab.',
    urduDescription: 'فیسکو فیصل آباد اور سرگودھا ڈویژن سمیت 8 اضلاع کے 40 لاکھ سے زائد صارفین کو بجلی فراہم کرتی ہے۔',
    guidelines: [
      'Reference number is located in the third row of the header table on the left side.'
    ]
  },
  {
    id: 'gepco',
    name: 'GEPCO',
    shortName: 'GEPCO',
    urduName: 'گیپکو (گوجرانوالہ الیکٹرک پاور کمپنی)',
    category: 'electricity',
    coverage: ['Gujranwala', 'Sialkot', 'Gujrat', 'Hafizabad', 'Narowal', 'Mandi Bahauddin'],
    urduCoverage: 'گوجرانوالہ، سیالکوٹ، گجرات، حافظ آباد، نارووال، منڈی بہاؤالدین',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '07 12111 0543200 U',
    sampleRef: '07121110543200',
    helpline: '118 / 055-9200516',
    website: 'https://gepco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/gepcobill',
    color: '#0d9488',
    accentBg: '#ccfbf1',
    description: 'Gujranwala Electric Power Company serves the industrial Golden Triangle including Gujranwala, Sialkot, and Gujrat.',
    urduDescription: 'گیپکو گوجرانوالہ، سیالکوٹ، گجرات سمیت پنجاب کی اہم صنعتی پٹی کو بجلی سپلائی کرتی ہے۔',
    guidelines: [
      'Locate the 14-digit reference number near the top of your bill next to Sub-Division.'
    ]
  },
  {
    id: 'iesco',
    name: 'IESCO',
    shortName: 'IESCO',
    urduName: 'آئیسکو (اسلام آباد الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Islamabad (ICT)', 'Rawalpindi', 'Attock', 'Jhelum', 'Chakwal'],
    urduCoverage: 'اسلام آباد، راولپنڈی، اٹک، جہلم، چکوال',
    refLabel: '14-Digit Reference No / 10-Digit Consumer ID',
    urduRefLabel: '14 ہندسوں کا حوالہ نمبر یا 10 ہندسوں کی صارف آئی ڈی',
    refLength: [14, 10],
    refFormatExample: '01 14111 0987654 U',
    sampleRef: '01141110987654',
    helpline: '118 / 051-9252937',
    website: 'https://iesco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/iescobill',
    color: '#4f46e5',
    accentBg: '#e0e7ff',
    description: 'Islamabad Electric Supply Company distributes electricity to the federal capital Islamabad and Rawalpindi region.',
    urduDescription: 'آئیسکو وفاقی دارالحکومت اسلام آباد، راولپنڈی، اٹک، جہلم اور چکوال کو بجلی فراہم کرتی ہے۔',
    guidelines: [
      'Enter the 14-digit reference number or 10-digit consumer ID found directly beneath the tariff block.'
    ]
  },
  {
    id: 'pesco',
    name: 'PESCO',
    shortName: 'PESCO',
    urduName: 'پیسکو (پشاور الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Peshawar', 'Mardan', 'Bannu', 'Swat', 'Abbottabad', 'Kohat', 'D.I. Khan', 'Nowshera', 'Charsadda'],
    urduCoverage: 'پشاور، مردان، بنوں، سوات، ایبٹ آباد، کوہاٹ، ڈیرہ اسماعیل خان',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '06 26111 0654321 U',
    sampleRef: '06261110654321',
    helpline: '118 / 091-9211997',
    website: 'https://pesco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/pescobill',
    color: '#0891b2',
    accentBg: '#cffafe',
    description: 'Peshawar Electric Supply Company supplies power across Khyber Pakhtunkhwa province.',
    urduDescription: 'پیسکو خیبر پختونخوا کے تمام اضلاع کو بجلی کی فراہمی اور نیٹ ورک مانیٹرنگ کی ذمہ دار ہے۔',
    guidelines: [
      'Enter the 14 numerical digits printed on the top portion of your monthly PESCO bill.'
    ]
  },
  {
    id: 'hesco',
    name: 'HESCO',
    shortName: 'HESCO',
    urduName: 'حیسکو (حیدرآباد الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Hyderabad', 'Jamshoro', 'Thatta', 'Badin', 'Mirpurkhas', 'Tharparkar', 'Nawabshah', 'Umerkot'],
    urduCoverage: 'حیدرآباد، جامشورو، ٹھٹھہ، بدین، میرپورخاص، تھرپارکر، نوابشاہ',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '24 37111 0345678 R',
    sampleRef: '24371110345678',
    helpline: '118 / 022-9260161',
    website: 'https://hesco.gov.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/hescobill',
    color: '#ca8a04',
    accentBg: '#fef08a',
    description: 'Hyderabad Electric Supply Company distributes electricity to southern Sindh (excluding Karachi).',
    urduDescription: 'حیسکو حیدرآباد، میرپورخاص اور نوابشاہ سمیت جنوبی سندھ کے 12 اضلاع کو بجلی فراہم کرتی ہے۔',
    guidelines: [
      'Find reference number in the upper central column of the physical bill paper.'
    ]
  },
  {
    id: 'sepco',
    name: 'SEPCO',
    shortName: 'SEPCO',
    urduName: 'سیپکو (سکھر الیکٹرک پاور کمپنی)',
    category: 'electricity',
    coverage: ['Sukkur', 'Larkana', 'Khairpur', 'Ghotki', 'Shikarpur', 'Jacobabad', 'Kashmore', 'Qambar Shahdadkot'],
    urduCoverage: 'سکھر، لاڑکانہ، خیرپور، گھوٹکی، شکارپور، جیکب آباد، کشمور',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '23 48111 0123987 U',
    sampleRef: '23481110123987',
    helpline: '118 / 071-9310797',
    website: 'https://sepco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/sepcobill',
    color: '#ea580c',
    accentBg: '#ffedd5',
    description: 'Sukkur Electric Power Company delivers electricity across northern Sindh districts.',
    urduDescription: 'سیپکو سکھر، لاڑکانہ، اور خیرپور سمیت بالائی سندھ کے 8 اضلاع کو بجلی سپلائی کرتی ہے۔',
    guidelines: [
      'Type your 14-digit numeric reference string without batch suffixes.'
    ]
  },
  {
    id: 'qesco',
    name: 'QESCO',
    shortName: 'QESCO',
    urduName: 'کیسکو (کوئٹہ الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Zhob', 'Sibi', 'Chaman', 'Loralai', 'All Balochistan'],
    urduCoverage: 'کوئٹہ، گوادر، تربت، خضدار، ژوب، سبی، چمن، لورالائی (پورا بلوچستان)',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '16 59111 0876543 U',
    sampleRef: '16591110876543',
    helpline: '118 / 081-9201750',
    website: 'https://qesco.com.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/qescobill',
    color: '#9333ea',
    accentBg: '#f3e8ff',
    description: 'Quetta Electric Supply Company is responsible for power transmission across the entire province of Balochistan.',
    urduDescription: 'کیسکو رقبے کے لحاظ سے پاکستان کی سب سے بڑی کمپنی ہے جو پورے صوبہ بلوچستان کو بجلی مہیا کرتی ہے۔',
    guidelines: [
      'Reference number is printed at the top left under consumer identifier.'
    ]
  },
  {
    id: 'tesco',
    name: 'TESCO',
    shortName: 'TESCO',
    urduName: 'ٹیسکو (قبائلی علاقہ جات الیکٹرک سپلائی کمپنی)',
    category: 'electricity',
    coverage: ['Khyber', 'Bajaur', 'Mohmand', 'Kurram', 'Orakzai', 'North Waziristan', 'South Waziristan'],
    urduCoverage: 'خیبر، باجوڑ، مہمند، کرم، اورکزئی، شمالی و جنوبی وزیرستان',
    refLabel: '14-Digit Reference Number',
    urduRefLabel: '14 ہندسوں کا ریفرنس نمبر',
    refLength: 14,
    refFormatExample: '25 18111 0332211 U',
    sampleRef: '25181110332211',
    helpline: '091-9212964 / 118',
    website: 'https://tesco.gov.pk',
    officialCheckUrl: 'https://bill.pitc.com.pk/tescobill',
    color: '#475569',
    accentBg: '#f1f5f9',
    description: 'Tribal Areas Electricity Supply Company supplies electricity to the newly merged tribal districts of KP.',
    urduDescription: 'ٹیسکو ضم شدہ قبائلی اضلاع بشمول وزیرستان، خیبر اور کرم میں بجلی کا نظام چلاتی ہے۔',
    guidelines: [
      'Provide 14-digit reference number found on your TESCO meter billing voucher.'
    ]
  },
  {
    id: 'ke',
    name: 'K-Electric (KE)',
    shortName: 'KE',
    urduName: 'کے الیکٹرک (کراچی الیکٹرک)',
    category: 'electricity',
    coverage: ['Karachi', 'Dhabeji', 'Gharo (Sindh)', 'Hub', 'Uthal', 'Vinder', 'Bela (Balochistan)'],
    urduCoverage: 'کراچی، حب، دھابیجی، گھارو، اوتھل، بیلہ',
    refLabel: '13-Digit Account Number',
    urduRefLabel: '13 ہندسوں کا اکاؤنٹ نمبر',
    refLength: 13,
    refFormatExample: '0400012345678',
    sampleRef: '0400012345678',
    helpline: '118 / 021-99000',
    website: 'https://ke.com.pk',
    officialCheckUrl: 'https://www.ke.com.pk/customer-services/bill-and-payment-options/duplicate-bill/',
    color: '#15803d',
    accentBg: '#dcfce7',
    description: 'K-Electric is the privatized vertically-integrated power utility serving Karachi and adjoining parts of Sindh & Balochistan.',
    urduDescription: 'کے الیکٹرک پاکستان کے سب سے بڑے معاشی حب کراچی اور ملحقہ علاقوں کو بجلی فراہم کرنے والی نجی کمپنی ہے۔',
    guidelines: [
      'Find the 13-digit Account Number printed prominently at the top right of the bill in large bold font.',
      'Enter all 13 digits starting with 04...'
    ]
  },

  // Gas Companies
  {
    id: 'sngpl',
    name: 'SNGPL',
    shortName: 'SNGPL Gas',
    urduName: 'سوئی ناردرن گیس پائپ لائنز (SNGPL)',
    category: 'gas',
    coverage: ['Punjab (All cities)', 'Khyber Pakhtunkhwa (All cities)', 'Islamabad (ICT)'],
    urduCoverage: 'پنجاب، خیبر پختونخوا اور اسلام آباد کے تمام شہر',
    refLabel: '11-Digit Consumer Number',
    urduRefLabel: '11 ہندسوں کا کنزیومر نمبر',
    refLength: 11,
    refFormatExample: '12345678901',
    sampleRef: '98432109876',
    helpline: '1199',
    website: 'https://sngpl.com.pk',
    officialCheckUrl: 'https://www.sngpl.com.pk/login.jsp?md=viewbill',
    color: '#dc2626',
    accentBg: '#fee2e2',
    description: 'Sui Northern Gas Pipelines Limited supplies natural gas & RLNG to north & central Pakistan.',
    urduDescription: 'سوئی ناردرن گیس پنجاب، خیبر پختونخوا اور اسلام آباد کے کروڑوں صارفین کو قدرتی گیس پہنچاتی ہے۔',
    guidelines: [
      'Enter your 11-digit Consumer ID located at the top left of your Sui gas receipt.',
      'Do not confuse it with meter reading or account number.'
    ]
  },
  {
    id: 'ssgc',
    name: 'SSGC',
    shortName: 'SSGC Gas',
    urduName: 'سوئی سدرن گیس کمپنی (SSGC)',
    category: 'gas',
    coverage: ['Sindh (Karachi, Hyderabad, Sukkur)', 'Balochistan (Quetta, Sibi, etc.)'],
    urduCoverage: 'سندھ (کراچی، حیدرآباد، سکھر) اور بلوچستان (کوئٹہ)',
    refLabel: '10-Digit Customer Number',
    urduRefLabel: '10 ہندسوں کا کسٹمر نمبر',
    refLength: 10,
    refFormatExample: '1234567890',
    sampleRef: '8765432109',
    helpline: '1199 / 021-99021000',
    website: 'https://ssgc.com.pk',
    officialCheckUrl: 'https://www.ssgc.com.pk/view-bill/',
    color: '#b91c1c',
    accentBg: '#fecaca',
    description: 'Sui Southern Gas Company distributes natural gas throughout Sindh and Balochistan provinces.',
    urduDescription: 'سوئی سدرن گیس کمپنی سندھ اور بلوچستان کے علاقوں میں گیس ٹرانسمیشن اور ڈسٹری بیوشن کا انتظام کرتی ہے۔',
    guidelines: [
      'Look for the 10-digit Customer No. displayed at the top center of your SSGC gas slip.'
    ]
  },

  // Telecom / PTCL
  {
    id: 'ptcl',
    name: 'PTCL',
    shortName: 'PTCL Landline & Flash Fiber',
    urduName: 'پی ٹی سی ایل (فون و انٹرنیٹ)',
    category: 'telecom',
    coverage: ['All Pakistan (Landline, Flash Fiber, EVO, Smart TV)'],
    urduCoverage: 'پورا پاکستان (فون، فلیش فائبر براڈ بینڈ، اسمارٹ ٹی وی)',
    refLabel: 'Account ID & Phone Number',
    urduRefLabel: 'اکاؤنٹ آئی ڈی یا فون نمبر مع ایریا کوڈ',
    refLength: [10, 11],
    refFormatExample: '1000012345 (Account ID) or 0511234567',
    sampleRef: '1002938475',
    helpline: '1218',
    website: 'https://ptcl.com.pk',
    officialCheckUrl: 'https://dbill.ptcl.com.pk/',
    color: '#047857',
    accentBg: '#d1fae5',
    description: 'Pakistan Telecommunication Company Limited provides landline telephony, Flash Fiber high-speed broadband, and corporate connectivity.',
    urduDescription: 'پی ٹی سی ایل ملک کا سب سے بڑا ٹیلی کام ادارہ ہے جو لینڈ لائن، تیز رفتار فائبر انٹرنیٹ اور سمارٹ ٹی وی فراہم کرتا ہے۔',
    guidelines: [
      'Enter the 10-digit Account ID printed on your PTCL invoice or telephone number with city area code.'
    ]
  },

  // Water & WASA
  {
    id: 'wasa-lahore',
    name: 'WASA Lahore',
    shortName: 'WASA LHR',
    urduName: 'واسا لاہور (پانی و نکاسی آب)',
    category: 'water',
    coverage: ['Lahore Metropolitan Area'],
    urduCoverage: 'لاہور میٹروپولیٹن ایریا',
    refLabel: '8-Digit Account Number',
    urduRefLabel: '8 ہندسوں کا اکاؤنٹ نمبر',
    refLength: 8,
    refFormatExample: '12345678',
    sampleRef: '84729103',
    helpline: '1334',
    website: 'https://wasa.punjab.gov.pk',
    officialCheckUrl: 'https://wasa.punjab.gov.pk/duplicatebill',
    color: '#0284c7',
    accentBg: '#e0f2fe',
    description: 'Water and Sanitation Agency Lahore manages municipal drinking water supply and sewerage for Lahore citizens.',
    urduDescription: 'واسا لاہور شہریوں کو پینے کے صاف پانی کی فراہمی اور سیوریج و ڈرینج کی سہولیات کا انتظام سنبھالتی ہے۔',
    guidelines: [
      'Enter the 8-digit Account Number printed at the top-right of your blue WASA water voucher.'
    ]
  },
  {
    id: 'wasa-rawalpindi',
    name: 'WASA Rawalpindi',
    shortName: 'WASA RWP',
    urduName: 'واسا راولپنڈی',
    category: 'water',
    coverage: ['Rawalpindi City, Cantt, Murree Road, Satellite Town'],
    urduCoverage: 'راولپنڈی، سیٹلائٹ ٹاؤن، مری روڈ',
    refLabel: '8-10 Digit Consumer Number',
    urduRefLabel: 'کنزیومر یا اکاؤنٹ نمبر',
    refLength: [8, 10],
    refFormatExample: '10928374',
    sampleRef: '10928374',
    helpline: '1334 / 051-5555000',
    website: 'https://wasarwp.punjab.gov.pk',
    officialCheckUrl: 'https://wasarwp.punjab.gov.pk/duplicate-bill',
    color: '#0369a1',
    accentBg: '#e0f2fe',
    description: 'Water and Sanitation Agency Rawalpindi provides water supply and sanitation services across Rawalpindi district.',
    urduDescription: 'واسا راولپنڈی شہر کے رہائشیوں کو واٹر سپلائی اور سیوریج کی خدمات مہیا کرتی ہے۔',
    guidelines: [
      'Enter your Consumer Number printed on WASA billing statement.'
    ]
  },
  {
    id: 'kwsb',
    name: 'KW&SC (Karachi Water)',
    shortName: 'KWSB Karachi',
    urduName: 'کراچی واٹر اینڈ سیوریج کارپوریشن',
    category: 'water',
    coverage: ['Karachi City (All Districts & Zones)'],
    urduCoverage: 'کراچی کے تمام اضلاع و زونز',
    refLabel: '10-Digit Consumer Number',
    urduRefLabel: 'کنزیومر نمبر',
    refLength: 10,
    refFormatExample: '9920182736',
    sampleRef: '9920182736',
    helpline: '1339',
    website: 'https://kwsc.gos.pk',
    officialCheckUrl: 'https://kwsc.gos.pk/online-billing/',
    color: '#0e7490',
    accentBg: '#cffafe',
    description: 'Karachi Water & Sewerage Corporation supplies bulk and retail potable water to Karachi city.',
    urduDescription: 'کراچی واٹر اینڈ سیوریج کارپوریشن روشنیوں کے شہر کراچی کے شہریوں کو پانی کی فراہمی یقینی بناتی ہے۔',
    guidelines: [
      'Enter the 10-digit consumer number given in the water bill invoice.'
    ]
  }
];

export const CATEGORY_LABELS = {
  all: { en: 'All Utilities', ur: 'تمام بلز' },
  electricity: { en: 'Electricity (DISCOs & KE)', ur: 'بجلی کے بلز (تمام کمپنیاں)' },
  gas: { en: 'Gas (SNGPL & SSGC)', ur: 'سوئی گیس بلز' },
  water: { en: 'Water & WASA', ur: 'واسا و پانی کے بلز' },
  telecom: { en: 'PTCL & Telecom', ur: 'پی ٹی سی ایل فون و انٹرنیٹ' }
};
