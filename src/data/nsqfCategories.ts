export interface NSQFCategory {
  id: string;
  code: string;
  name: string;
  sector: string;
  nsqfLevels: string;
  description: string;
  icon: string;
}

export const NSQF_CATEGORIES_DATA: NSQFCategory[] = [
  {
    id: 'nsqf-it',
    code: 'NSQF-SEC-01',
    name: 'IT-ITeS & Emerging Technologies',
    sector: 'Information Technology',
    nsqfLevels: 'Level 4–8',
    description: 'Software development, AI/ML systems, cloud architecture, cybersecurity, and data engineering.',
    icon: '💻'
  },
  {
    id: 'nsqf-agri',
    code: 'NSQF-SEC-02',
    name: 'Agriculture & Allied Practices',
    sector: 'Agriculture',
    nsqfLevels: 'Level 2–5',
    description: 'Precision farming, smart drip irrigation, tractor & implement handling, agro-processing, and drone crop monitoring.',
    icon: '🌾'
  },
  {
    id: 'nsqf-elec',
    code: 'NSQF-SEC-03',
    name: 'Electronics & Hardware Systems',
    sector: 'Electronics',
    nsqfLevels: 'Level 3–6',
    description: 'Domestic & industrial electronics, PCB assembly, device troubleshooting, and circuit installation.',
    icon: '🔌'
  },
  {
    id: 'nsqf-green',
    code: 'NSQF-SEC-04',
    name: 'Renewable Green Energy & Solar PV',
    sector: 'Green Energy',
    nsqfLevels: 'Level 4–6',
    description: 'Grid-tied solar rooftop arrays, inverters, battery storage (BESS), and net-metering systems.',
    icon: '☀️'
  },
  {
    id: 'nsqf-apparel',
    code: 'NSQF-SEC-05',
    name: 'Apparel, Made-Ups & Home Furnishing',
    sector: 'Textiles & Fashion',
    nsqfLevels: 'Level 2–5',
    description: 'Industrial sewing, pattern design, CAD garment grading, and boutique apparel manufacturing.',
    icon: '🧵'
  },
  {
    id: 'nsqf-auto',
    code: 'NSQF-SEC-06',
    name: 'Automotive & Electric Mobility (EV)',
    sector: 'Automotive',
    nsqfLevels: 'Level 3–6',
    description: 'EV powertrain diagnostics, battery management, commercial vehicle driving, and motor servicing.',
    icon: '🚗'
  },
  {
    id: 'nsqf-health',
    code: 'NSQF-SEC-07',
    name: 'Healthcare & Paramedical Services',
    sector: 'Healthcare',
    nsqfLevels: 'Level 3–6',
    description: 'General duty nursing assistance, emergency medical response, pharmacy support, and community health.',
    icon: '🏥'
  },
  {
    id: 'nsqf-construct',
    code: 'NSQF-SEC-08',
    name: 'Construction, Masonry & Plumbing',
    sector: 'Infrastructure',
    nsqfLevels: 'Level 2–5',
    description: 'Building construction, pipe fitting, sanitary installations, tile laying, and bar bending.',
    icon: '🧱'
  },
  {
    id: 'nsqf-capital',
    code: 'NSQF-SEC-09',
    name: 'Capital Goods & Heavy Engineering',
    sector: 'Manufacturing',
    nsqfLevels: 'Level 3–6',
    description: 'CNC machine operation, arc & gas welding, tool & die making, and industrial machining.',
    icon: '⚙️'
  },
  {
    id: 'nsqf-logistics',
    code: 'NSQF-SEC-10',
    name: 'Logistics, Warehousing & Supply Chain',
    sector: 'Logistics',
    nsqfLevels: 'Level 3–5',
    description: 'Warehouse inventory management, forklift operation, freight dispatch, and courier handling.',
    icon: '📦'
  },
  {
    id: 'nsqf-food',
    code: 'NSQF-SEC-11',
    name: 'Food Processing & Quality Preservation',
    sector: 'Food Industry',
    nsqfLevels: 'Level 2–5',
    description: 'Dairy processing, grain milling, food safety standards (FSSAI), and packaging automation.',
    icon: '🍲'
  },
  {
    id: 'nsqf-handicraft',
    code: 'NSQF-SEC-12',
    name: 'Handicrafts, Pottery & Traditional Arts',
    sector: 'Creative Arts',
    nsqfLevels: 'Level 2–4',
    description: 'Wood crafting, clay pottery, handloom weaving, metal sculpting, and stone engraving (PM Vishwakarma).',
    icon: '🏺'
  },
  {
    id: 'nsqf-retail',
    code: 'NSQF-SEC-13',
    name: 'Retail & Consumer Sales Operations',
    sector: 'Retail',
    nsqfLevels: 'Level 3–5',
    description: 'Point-of-Sale (POS) management, customer relationship management, and visual merchandising.',
    icon: '🛍️'
  },
  {
    id: 'nsqf-beauty',
    code: 'NSQF-SEC-14',
    name: 'Beauty, Wellness & Salon Services',
    sector: 'Personal Care',
    nsqfLevels: 'Level 2–4',
    description: 'Hair styling, skin wellness therapies, makeup artistry, and spa operations.',
    icon: '✂️'
  },
  {
    id: 'nsqf-telecom',
    code: 'NSQF-SEC-15',
    name: 'Telecom & Optical Fiber Infrastructure',
    sector: 'Telecommunications',
    nsqfLevels: 'Level 3–5',
    description: '5G optical fiber splicing, mobile tower maintenance, and broadband network installation.',
    icon: '📡'
  },
  {
    id: 'nsqf-tourism',
    code: 'NSQF-SEC-16',
    name: 'Tourism, Hospitality & Culinary Arts',
    sector: 'Hospitality',
    nsqfLevels: 'Level 3–6',
    description: 'Food & beverage service, culinary cooking, front desk hospitality, and regional eco-tour guiding.',
    icon: '🏨'
  },
  {
    id: 'nsqf-security',
    code: 'NSQF-SEC-17',
    name: 'Security & Surveillance Systems',
    sector: 'Security',
    nsqfLevels: 'Level 2–4',
    description: 'CCTV surveillance setup, industrial physical security, fire safety protocols, and access control.',
    icon: '🛡️'
  },
  {
    id: 'nsqf-bfsi',
    code: 'NSQF-SEC-18',
    name: 'Banking, Financial Services & Insurance (BFSI)',
    sector: 'Finance',
    nsqfLevels: 'Level 4–6',
    description: 'Microfinance assistance, Business Correspondent (BC) services, digital payments, and accounting.',
    icon: '💳'
  },
  {
    id: 'nsqf-media',
    code: 'NSQF-SEC-19',
    name: 'Media, Animation & Digital Content',
    sector: 'Media',
    nsqfLevels: 'Level 4–6',
    description: 'Digital video editing, 2D/3D animation, graphic design, and audio production.',
    icon: '🎬'
  },
  {
    id: 'nsqf-plumbing',
    code: 'NSQF-SEC-20',
    name: 'Plumbing & Hydraulic Pipeline Systems',
    sector: 'Plumbing',
    nsqfLevels: 'Level 2–4',
    description: 'Domestic pipe fittings, wastewater drainage systems, water heater pump setup, and leakage fixing.',
    icon: '🔧'
  }
];
