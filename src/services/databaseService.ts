import type { LivelihoodProfile, BeneficiaryRecord } from '../types';

const STORAGE_KEY = 'saksham_beneficiary_database';

export const INITIAL_BENEFICIARIES: BeneficiaryRecord[] = [
  {
    id: 'BEN-2026-001',
    name: 'Vivek Kumar',
    location: 'Bengaluru Urban, Karnataka',
    trade: 'Software Engineering & AI Agent Development',
    education: 'Bachelor of Engineering (Computer Science)',
    experienceYears: 10,
    nsqfLevel: 'NSQF Level 7 (Senior Solution Architect)',
    matchedScheme: 'FutureSkills Prime (NASSCOM & MeitY)',
    matchScore: 98,
    createdAt: '2026-09-20 10:15 AM',
    status: 'Verified',
    profile: {
      id: 'BEN-2026-001',
      citizenName: 'Vivek Kumar',
      occupation: 'Software Engineering & AI Agent Development',
      experienceYears: 10,
      education: 'Bachelor of Engineering (Computer Science)',
      location: 'Bengaluru Urban, Karnataka',
      currentSkills: [
        { name: 'Python, TypeScript & Full-Stack Systems', icon: '💻' },
        { name: 'AI Agents, LLM Integration & Orchestration', icon: '🤖' },
        { name: 'Git, Cloud Architecture & Scalability', icon: '⚙️' },
        { name: 'Distributed Systems & Database Design', icon: '🌐' }
      ],
      structuredCategories: [
        'Information Technology (IT-ITeS)',
        'Artificial Intelligence & Data Engineering',
        'Cloud Computing & Distributed Systems',
        'Autonomous Agent Architectures'
      ],
      toolsEquipment: ['VS Code', 'GitHub', 'Python', 'Cloud Services', 'Docker'],
      targetAspiration: 'Applied Artificial Intelligence, Machine Learning & Public Sector Technology Leadership',
      mappingConfidence: 98,
      evidences: [
        {
          userQuote: 'I am a software engineer with 10 years experience using Python, VS Code, and Cloud',
          extractedSkill: 'Senior Software Engineering & Cloud Systems',
          structuredCategory: 'Information Technology (IT-ITeS)',
          confidenceScore: 98
        }
      ],
      skillGap: {
        id: 'gap-001',
        currentSkills: [
          '✓ Core Software Engineering & Architecture',
          '✓ AI Agent System Development & Tool Usage',
          '✓ Code Implementation, Debugging & Git Workflow',
          '✓ Data Structures & Cloud Foundations'
        ],
        targetCapability: 'Applied Artificial Intelligence, Machine Learning & Enterprise Agentic Systems',
        gapSkills: [
          '⚠️ Multi-Agent Orchestration Frameworks & Autonomous Tools',
          '⚠️ PyTorch / TensorFlow Neural Network Architectures',
          '⚠️ Cloud GPU Deployment & Scalable Inference Clusters',
          '⚠️ Vector Databases, Embeddings & RAG Architectures'
        ]
      },
      matchedPrograms: [
        {
          id: 'prog-fs-prime',
          title: 'FutureSkills Prime — Artificial Intelligence & Big Data',
          provider: 'Ministry of Electronics and IT (MeitY) & NASSCOM',
          category: 'Emerging Technologies & AI',
          eligibility: 'Graduates / IT Working Professionals',
          matchPercentage: 98,
          rankBadge: 'BEST MATCH',
          whyMatched: [
            'Direct alignment with 10 years software development experience',
            'Government of India subsidized certification in Applied AI',
            'Industry recognized Gold Standard certification by NASSCOM'
          ],
          aiExplanation: 'FutureSkills Prime provides targeted modular pathways for senior developers to master AI Agents, LLMs, and Cloud AI deployments with MeitY financial incentives.',
          skillsGained: [
            'Agentic AI Workflows & Tool Calling',
            'Enterprise LLM Fine-Tuning & RAG',
            'Scalable Cloud ML Pipelines',
            'Responsible AI Governance'
          ],
          duration: '12 Weeks (Self-Paced Hybrid)',
          mode: 'Online + Capstone Labs',
          stipend: '₹8,000 Government Incentive on Certification',
          toolkitGrant: 'Access to Cloud GPU & Sandbox Credits',
          loanSupport: 'Interest-Subsidized Professional Loan via SIDBI',
          officialPortalUrl: 'https://futureskillsprime.in',
          matchFactors: {
            occupationMatch: 99,
            skillMatch: 98,
            interestMatch: 97,
            eligibilityMatch: 100,
            locationMatch: 96
          }
        }
      ],
      roadmap: [
        {
          weekRange: 'Days 1–30',
          title: 'Foundation & Agent Verification',
          description: 'Enroll in FutureSkills Prime AI Agent module; complete NSQF Level 7 RPL portfolio submission.',
          milestone: 'Verified Skill Dossier Issued',
          icon: '📋'
        },
        {
          weekRange: 'Days 31–60',
          title: 'Advanced LLM & System Design',
          description: 'Complete hands-on enterprise capstone project focusing on multilingual voice agents.',
          milestone: 'MeitY-NASSCOM Certification',
          icon: '🎓'
        },
        {
          weekRange: 'Days 61–90',
          title: 'Deployment & Tech Leadership',
          description: 'Deploy public-good digital systems on India AI portal and explore leadership roles.',
          milestone: 'National Registry Listed',
          icon: '🚀'
        }
      ],
      isConfirmed: true,
      confirmedAt: '2026-09-20 10:15 AM'
    }
  },
  {
    id: 'BEN-2026-002',
    name: 'Basavaraj Patil',
    location: 'Kalaburagi, Karnataka',
    trade: 'Agriculture & Sustainable Crop Farming',
    education: 'Higher Secondary (12th Vocational)',
    experienceYears: 5,
    nsqfLevel: 'NSQF Level 4 (Precision Farming Specialist)',
    matchedScheme: 'PMKVY 4.0 — Precision Agriculture & Drone Tech',
    matchScore: 94,
    createdAt: '2026-09-20 11:30 AM',
    status: 'Verified',
    profile: {
      id: 'BEN-2026-002',
      citizenName: 'Basavaraj Patil',
      occupation: 'Agriculture & Sustainable Crop Farming',
      experienceYears: 5,
      education: 'Higher Secondary (12th Vocational)',
      location: 'Kalaburagi, Karnataka',
      currentSkills: [
        { name: 'Tractor & Agricultural Machinery Operation', icon: '🚜' },
        { name: 'Drip Irrigation & Soil Care', icon: '💧' },
        { name: 'Crop Nutrition & Yield Management', icon: '🌾' }
      ],
      structuredCategories: ['Agriculture & Allied Sectors', 'Farm Machinery', 'Precision Irrigation'],
      toolsEquipment: ['Tractor', 'Drip Irrigation Valves', 'Plough', 'Sprayer'],
      targetAspiration: 'Automated Drip Irrigation, Solar Pumping & Agri-Drone Operations',
      mappingConfidence: 94,
      evidences: [],
      skillGap: {
        id: 'gap-002',
        currentSkills: ['✓ Traditional Soil Cultivation', '✓ Drip Irrigation Control'],
        targetCapability: 'Certified Precision Agri-Drone & Solar Irrigation Specialist',
        gapSkills: ['⚠️ Smart Soil Sensor Systems', '⚠️ Drone Spraying Protocols']
      },
      matchedPrograms: [
        {
          id: 'prog-pmkvy-agri',
          title: 'PMKVY 4.0 — Kisan Drone & Precision Farming Operator',
          provider: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
          category: 'Agriculture & Green Skills',
          eligibility: '10th Pass with Field Experience',
          matchPercentage: 94,
          rankBadge: 'BEST MATCH',
          whyMatched: [
            'Directly upgrades 5 years tractor & farm experience',
            'Full ₹15,000 government sponsorship + free lodging',
            'Authorized DGCA Drone Pilot Certificate pathway'
          ],
          aiExplanation: 'PMKVY 4.0 provides complete funding for farmers to master sensor-based micro-irrigation and Kisan Drone pesticide mapping.',
          skillsGained: ['Agri-Drone Flight Operations', 'Sensor Drip Automation', 'Organic Soil Testing'],
          duration: '8 Weeks (Full Time Residential)',
          mode: 'Classroom & Farm Labs',
          stipend: '₹500 / Day Training Allowance',
          toolkitGrant: '₹10,000 Precision Tool Kit Subsidized',
          loanSupport: 'PM-KUSUM 90% Subsidy for Solar Pumps',
          officialPortalUrl: 'https://www.pmkvyofficial.org',
          matchFactors: {
            occupationMatch: 95,
            skillMatch: 94,
            interestMatch: 93,
            eligibilityMatch: 100,
            locationMatch: 90
          }
        }
      ],
      roadmap: [],
      isConfirmed: true,
      confirmedAt: '2026-09-20 11:30 AM'
    }
  },
  {
    id: 'BEN-2026-003',
    name: 'Lakshmi Bai',
    location: 'Mysuru, Karnataka',
    trade: 'Tailoring & Garment Manufacturing',
    education: 'Secondary School (10th Standard)',
    experienceYears: 6,
    nsqfLevel: 'NSQF Level 4 (Master Craftsperson)',
    matchedScheme: 'PM Vishwakarma — Tailor (Darzi) Modernization',
    matchScore: 92,
    createdAt: '2026-09-20 12:45 PM',
    status: 'Verified',
    profile: {
      id: 'BEN-2026-003',
      citizenName: 'Lakshmi Bai',
      occupation: 'Tailoring & Garment Manufacturing',
      experienceYears: 6,
      education: 'Secondary School (10th Standard)',
      location: 'Mysuru, Karnataka',
      currentSkills: [
        { name: 'Motorized Sewing & Pattern Cutting', icon: '✂️' },
        { name: 'Custom Measurements & Garment Assembly', icon: '👗' },
        { name: 'Fabric Selection & Embroidery', icon: '🧵' }
      ],
      structuredCategories: ['Apparel & Textiles', 'Garment Manufacturing', 'Boutique Design'],
      toolsEquipment: ['Motorized Sewing Machine', 'Overlock Machine', 'Pattern Shears'],
      targetAspiration: 'CAD Pattern Drafting & Commercial Boutique Production',
      mappingConfidence: 92,
      evidences: [],
      skillGap: {
        id: 'gap-003',
        currentSkills: ['✓ Manual Machine Stitching', '✓ Custom Fitting'],
        targetCapability: 'Industrial Garment CAD Designer & Boutique Entrepreneur',
        gapSkills: ['⚠️ High-Speed Overlock Machines', '⚠️ Digital CAD Pattern Drafting']
      },
      matchedPrograms: [
        {
          id: 'prog-vishwakarma-tailor',
          title: 'PM Vishwakarma — Darzi (Tailor) Enterprise Scheme',
          provider: 'Ministry of MSME & Ministry of Skill Development',
          category: 'Traditional Crafts & Apparel',
          eligibility: 'Practicing Tailors / Artisans',
          matchPercentage: 92,
          rankBadge: 'BEST MATCH',
          whyMatched: [
            'Direct recognition of 6 years tailoring experience via RPL',
            '₹15,000 Free Modern Electric Sewing Machine Tool Kit Voucher',
            'Collateral-free enterprise loan up to ₹3,00,000 at 5% interest'
          ],
          aiExplanation: 'PM Vishwakarma provides formal ID, modern digital toolkit voucher, and low-interest credit to scale home tailoring into a boutique enterprise.',
          skillsGained: ['Industrial Machine Operation', 'CAD Digital Pattern Sizing', 'E-Commerce Selling on ONDC'],
          duration: '5 Days Basic + 15 Days Advanced Training',
          mode: 'District Training Center',
          stipend: '₹500 / Day during training',
          toolkitGrant: '₹15,000 Modern Digital Tool Kit e-Voucher',
          loanSupport: '₹1,00,000 (Tranche 1) + ₹2,00,000 (Tranche 2) @ 5% interest',
          officialPortalUrl: 'https://pmvishwakarma.gov.in',
          matchFactors: {
            occupationMatch: 96,
            skillMatch: 92,
            interestMatch: 91,
            eligibilityMatch: 100,
            locationMatch: 95
          }
        }
      ],
      roadmap: [],
      isConfirmed: true,
      confirmedAt: '2026-09-20 12:45 PM'
    }
  }
];

class DatabaseService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BENEFICIARIES));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getAllBeneficiaries(): BeneficiaryRecord[] {
    if (typeof window === 'undefined') return INITIAL_BENEFICIARIES;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return INITIAL_BENEFICIARIES;
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse beneficiaries from database:', e);
      return INITIAL_BENEFICIARIES;
    }
  }

  public getBeneficiaryById(id: string): BeneficiaryRecord | undefined {
    const list = this.getAllBeneficiaries();
    return list.find(b => b.id === id);
  }

  public saveBeneficiary(profile: LivelihoodProfile): BeneficiaryRecord {
    const list = this.getAllBeneficiaries();
    const existingIdx = list.findIndex(b => b.id === profile.id || (b.name.toLowerCase() === (profile.citizenName || '').toLowerCase() && b.trade === profile.occupation));

    const bestScheme = profile.matchedPrograms?.[0];
    const schemeTitle = bestScheme?.title || 'PMKVY 4.0 National Skilling Scheme';
    const matchScore = bestScheme?.matchPercentage || 95;

    // Determine appropriate NSQF level representation
    let nsqfLevel = 'NSQF Level 4 (Skilled Practitioner)';
    const occLower = profile.occupation.toLowerCase();
    if (occLower.includes('software') || occLower.includes('ai') || occLower.includes('engineer')) {
      nsqfLevel = profile.experienceYears >= 7 ? 'NSQF Level 7 (Master Solution Architect)' : 'NSQF Level 6 (Software Engineer)';
    } else if (occLower.includes('civil') || occLower.includes('ias') || occLower.includes('ips') || occLower.includes('admin')) {
      nsqfLevel = 'NSQF Level 8 (Public Policy & Administration)';
    } else if (occLower.includes('event') || occLower.includes('hotel') || occLower.includes('catering')) {
      nsqfLevel = 'NSQF Level 5 (Event Operations Supervisor)';
    } else if (occLower.includes('nurse') || occLower.includes('health')) {
      nsqfLevel = 'NSQF Level 5 (Certified General Duty Assistant)';
    } else if (occLower.includes('electr') || occLower.includes('solar')) {
      nsqfLevel = 'NSQF Level 5 (Solar PV & Grid Specialist)';
    }

    const record: BeneficiaryRecord = {
      id: profile.id || `BEN-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`,
      name: profile.citizenName || 'Applicant (Citizen)',
      location: profile.location || 'Karnataka Hub',
      trade: profile.occupation,
      education: profile.education || 'Higher Secondary / Degree Foundation',
      experienceYears: profile.experienceYears,
      nsqfLevel,
      matchedScheme: schemeTitle,
      matchScore,
      createdAt: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Verified',
      profile
    };

    let updatedList: BeneficiaryRecord[];
    if (existingIdx >= 0) {
      updatedList = [...list];
      updatedList[existingIdx] = record;
    } else {
      updatedList = [record, ...list];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }
    this.notify();
    return record;
  }

  public deleteBeneficiary(id: string): void {
    const list = this.getAllBeneficiaries();
    const updated = list.filter(b => b.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    this.notify();
  }

  public clearDatabase(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BENEFICIARIES));
    }
    this.notify();
  }

  public exportToJson(): string {
    const list = this.getAllBeneficiaries();
    return JSON.stringify(list, null, 2);
  }

  public exportToCsv(): string {
    const list = this.getAllBeneficiaries();
    const headers = ['ID', 'Candidate Name', 'Location', 'Trade / Field', 'Education', 'Experience (Years)', 'NSQF Level', 'Matched Scheme', 'Match Score (%)', 'Status', 'Registration Date'];
    const rows = list.map(b => [
      `"${b.id}"`,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.location.replace(/"/g, '""')}"`,
      `"${b.trade.replace(/"/g, '""')}"`,
      `"${b.education.replace(/"/g, '""')}"`,
      b.experienceYears,
      `"${b.nsqfLevel.replace(/"/g, '""')}"`,
      `"${b.matchedScheme.replace(/"/g, '""')}"`,
      b.matchScore,
      `"${b.status}"`,
      `"${b.createdAt}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const databaseService = new DatabaseService();
