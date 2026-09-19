import type { MatchedProgram, RoadmapStep } from '../types';

export const MULTI_SECTOR_PROGRAMS_DATABASE: Record<string, MatchedProgram[]> = {
  // 1. CIVIL SERVICES, PUBLIC ADMINISTRATION, GOVERNANCE & COMPETITIVE EXAMS
  civil_services: [
    {
      id: 'prog-civil-services-ambedkar',
      title: 'Dr. Ambedkar Central Scheme for Civil Services & Competitive Exam Coaching',
      provider: 'Ministry of Social Justice & Empowerment & UPSC / State PSC Centers',
      category: 'Public Administration & Civil Services (IAS / IPS / KPSC)',
      eligibility: 'Graduates / Final Year Degree / Engineering Students aspiring for Civil Services',
      matchPercentage: 97,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Directly aligns with your confirmed goal to become an IAS / IPS Officer or Civil Servant',
        'Covers comprehensive UPSC Prelims, Mains, and Personality Interview preparation',
        '100% Free full coaching with monthly government stipend and book allowance'
      ],
      aiExplanation: 'Recommended because your confirmed profile highlights strong civil services aspirations (IAS / IPS) alongside an engineering and event management foundation. This premier government initiative provides structured coaching, public policy mentoring, and competitive exam preparation.',
      skillsGained: [
        'Indian Polity, Constitution & Governance Frameworks',
        'Public Administration & Ethics Case Studies',
        'Analytical Essay Writing & Critical Reasoning',
        'National & International Affairs Synthesis'
      ],
      duration: '10 to 12 Months Intensive Coaching',
      mode: 'Premier State Administrative Training Institutes + Online Test Series',
      stipend: '₹4,000 / Month Government Living Stipend',
      toolkitGrant: '₹15,000 Annual Book & Study Material Allowance',
      officialPortalUrl: 'https://socialjustice.gov.in',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 96,
        interestMatch: 100,
        eligibilityMatch: 98,
        locationMatch: 95
      }
    },
    {
      id: 'prog-ncs-public-admin',
      title: 'National Career Service (NCS): Public Administration & Career Readiness',
      provider: 'Ministry of Labour & Employment, Government of India',
      category: 'Public Sector Governance & Career Placement',
      eligibility: 'College Students, Degree Holders and Youth entering Public & Corporate Sectors',
      matchPercentage: 91,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Direct integration with National Career Service Model Career Centers across all districts',
        'Free aptitude assessments, leadership modules, and public administration certifications',
        'Connects with central & state government officer selection notifications'
      ],
      aiExplanation: 'Recommended to validate your organizational and administrative skills while providing structured guidance for central and state public sector recruitment examinations.',
      skillsGained: [
        'Administrative Office Coordination & Public Systems',
        'Government Rules, RTI & E-Governance Portals',
        'Leadership, Public Speaking & Event Protocol',
        'Data-Driven Decision Making'
      ],
      duration: '3 Months (Self-Paced + District Center Workshops)',
      mode: 'Hybrid (District Model Career Center + Digital Learning)',
      stipend: 'Free Examination Voucher + Government Job Alert Access',
      toolkitGrant: 'Official NCS Career Certification & Assessment Dossier',
      officialPortalUrl: 'https://www.ncs.gov.in',
      matchFactors: {
        occupationMatch: 92,
        skillMatch: 90,
        interestMatch: 92,
        eligibilityMatch: 96,
        locationMatch: 88
      }
    },
    {
      id: 'prog-karmayogi-youth',
      title: 'Mission Karmayogi: Youth Leadership & Public Governance Pre-Service Fellowship',
      provider: 'Capacity Building Commission & Department of Personnel and Training (DoPT)',
      category: 'Governance, Public Policy & Leadership',
      eligibility: 'Undergraduates / Graduates interested in Governance and Public Management',
      matchPercentage: 86,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'Official government capacity-building platform for modern public servants',
        'Focuses on citizen-centric administration, public ethics, and project management',
        'Provides prestigious government certificate recognizing administrative leadership'
      ],
      aiExplanation: 'Recommended as a high-impact institutional qualification to build deep grounding in Indian administrative systems, public policy delivery, and civil leadership.',
      skillsGained: [
        'Citizen-Centric Public Service Delivery',
        'Public Budgeting & Scheme Administration',
        'Stakeholder Management & Public Communication',
        'Digital Public Infrastructure (DPI) & Governance Tech'
      ],
      duration: '4 Months (200 Hours)',
      mode: 'iGOT Karmayogi Portal + District Governance Labs',
      stipend: '₹2,500 / Month Merit Fellowship Allowance',
      officialPortalUrl: 'https://igotkarmayogi.gov.in',
      matchFactors: {
        occupationMatch: 88,
        skillMatch: 85,
        interestMatch: 90,
        eligibilityMatch: 92,
        locationMatch: 82
      }
    }
  ],

  // 2. EVENT MANAGEMENT, HOSPITALITY & TOURISM
  event_hospitality: [
    {
      id: 'prog-hsrt-events',
      title: 'Hunar Se Rozgar Tak (HSRT): Event Operations & Hospitality Management',
      provider: 'Ministry of Tourism, Government of India & NCHMCT',
      category: 'Tourism, Event Operations & Hospitality',
      eligibility: 'Youth (18–28 years), 8th pass and above with event or catering experience',
      matchPercentage: 96,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Directly certifies your practical experience in catering and event management',
        '100% Free residential government training at premier Institute of Hotel Management (IHM)',
        'Includes cash stipend, uniform allowance, and placement assistance'
      ],
      aiExplanation: 'Recommended because your confirmed background includes catering and event management. HSRT formally accredits your operational skills with National Tourism Board credentials, qualifying you for high-paying event production and corporate hospitality roles.',
      skillsGained: [
        'Large-Scale Event Logistics & Floor Coordination',
        'Catering Management & Food Safety Standards (FSSAI)',
        'Client Relations, VIP Protocol & Budgeting',
        'Vendor Management & Safety Compliance'
      ],
      duration: '8 Weeks (Full-Time Practical Training)',
      mode: 'Institute of Hotel Management (IHM) Campus',
      stipend: '₹2,000 Course Completion Stipend + Free Uniform & Meals',
      toolkitGrant: 'Certified Event & Hospitality Toolset',
      officialPortalUrl: 'https://tourism.gov.in',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 95,
        interestMatch: 96,
        eligibilityMatch: 100,
        locationMatch: 92
      }
    },
    {
      id: 'prog-pmkvy-hospitality',
      title: 'PMKVY 4.0: Event Management & Food & Beverage Operations Supervisor',
      provider: 'Tourism and Hospitality Skill Council (THSC) & NSDC',
      category: 'Hospitality & Event Planning',
      eligibility: '10th / 12th Pass or working professionals with 1+ years experience',
      matchPercentage: 90,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Recognition of Prior Learning (RPL) Level 5 supervisor certificate',
        'Free exam assessment and instant Kaushal Digital Skill Card',
        'Direct recruitment linkages with top event companies and convention centers'
      ],
      aiExplanation: 'Recommended to fast-track your informal event management experience into a government-certified supervisory qualification.',
      skillsGained: [
        'Event Production Planning & Scheduling',
        'Beverage & Banquet Service Architecture',
        'Team Management & Rostering',
        'Emergency Crowd Safety Protocols'
      ],
      duration: '3 Months (320 Hours)',
      mode: 'District NSDC Hospitality Center',
      stipend: '₹500 Direct DBT on Certification',
      toolkitGrant: 'Event Management Software License & Badge',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 94,
        skillMatch: 90,
        interestMatch: 88,
        eligibilityMatch: 96,
        locationMatch: 86
      }
    },
    {
      id: 'prog-naps-hospitality',
      title: 'National Apprenticeship Promotion Scheme (NAPS): Corporate Hospitality & Events',
      provider: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
      category: 'Corporate Hospitality & On-the-Job Apprenticeship',
      eligibility: 'Graduates, Diploma and 12th pass applicants',
      matchPercentage: 84,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'Earn while you learn with monthly paid apprenticeship in leading enterprises',
        'Government co-funds ₹1,500/month of your apprenticeship stipend',
        'Guaranteed high-retention corporate placement on completion'
      ],
      aiExplanation: 'Recommended if you want immediate paid industrial experience with premier corporate event management firms.',
      skillsGained: [
        'Corporate Event Coordination',
        'Hospitality CRM & Billing Systems',
        'Inventory Logistics & Procurement',
        'Contract Negotiation'
      ],
      duration: '6 to 12 Months Paid Apprenticeship',
      mode: 'On-the-Job Industrial Placement',
      stipend: '₹8,000 to ₹12,000 / Month Paid Industrial Stipend',
      officialPortalUrl: 'https://www.apprenticeshipindia.gov.in',
      matchFactors: {
        occupationMatch: 86,
        skillMatch: 82,
        interestMatch: 85,
        eligibilityMatch: 92,
        locationMatch: 80
      }
    }
  ],

  // 3. TECHNOLOGY, COMPUTER ENGINEERING & ARTIFICIAL INTELLIGENCE
  tech_ai: [
    {
      id: 'prog-futureskills-ai',
      title: 'FutureSkills PRIME: Artificial Intelligence & Machine Learning Specialization',
      provider: 'Ministry of Electronics & IT (MeitY) and NASSCOM',
      category: 'IT-ITeS & Emerging Technologies',
      eligibility: 'Students / Diploma / Graduates / Engineers with basic programming exposure',
      matchPercentage: 96,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Directly aligns with your confirmed background in Computer Engineering',
        'Addresses your explicit aspiration to master Artificial Intelligence and Modern Tech',
        'Includes government-subsidized NSDC / NCVET Level 6 certification'
      ],
      aiExplanation: 'Recommended because your confirmed background includes Computer Engineering and you explicitly expressed wanting to learn Artificial Intelligence. FutureSkills PRIME provides industry-aligned AI/ML labs, neural network architectures, and high-growth developer placement pipelines.',
      skillsGained: [
        'Python for AI & Deep Learning',
        'Generative AI & LLM Systems',
        'Data Engineering & Cloud Deployments',
        'Neural Networks & Computer Vision'
      ],
      duration: '4 Months (360 Hours Hands-on Labs)',
      mode: 'Hybrid (Online Virtual Labs + State Center of Excellence)',
      stipend: '₹8,000 MeitY Skill Incentive DBT on Certification',
      toolkitGrant: 'Free 1-Year Cloud GPU & Developer Credits ($500 Value)',
      officialPortalUrl: 'https://futureskillsprime.in',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 95,
        interestMatch: 99,
        eligibilityMatch: 96,
        locationMatch: 92
      }
    },
    {
      id: 'prog-pmkvy-data',
      title: 'PMKVY 4.0: Full-Stack Data Science & Software Engineering Certification',
      provider: 'National Skill Development Corporation (NSDC) & IT-ITeS Skill Council',
      category: 'Software Development & Analytics',
      eligibility: '12th Pass / Polytechnic / IT Graduates with computer literacy',
      matchPercentage: 89,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Zero tuition fee under central government skilling initiative',
        'Covers database systems, APIs, and modern frontend/backend engineering',
        'Includes direct campus placement linkage with top IT hubs'
      ],
      aiExplanation: 'Recommended because your profile indicates active computer equipment usage. This program provides comprehensive full-stack and data engineering credentials recognizing your technical tenure.',
      skillsGained: [
        'Full-Stack Web & API Architectures',
        'SQL & Big Data Management',
        'AI Assisted Coding & Automation',
        'DevOps & CI/CD Pipelines'
      ],
      duration: '3 Months (300 Hours)',
      mode: 'District NSDC Tech Training Hub',
      stipend: '₹500 Direct DBT + Free Exam Assessment',
      toolkitGrant: 'Licensed Software & Cloud Sandbox Access',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 92,
        skillMatch: 90,
        interestMatch: 88,
        eligibilityMatch: 95,
        locationMatch: 84
      }
    },
    {
      id: 'prog-nielit-cyber-ai',
      title: 'NIELIT: Advanced Diploma in AI, Cloud Computing & Cyber Systems',
      provider: 'National Institute of Electronics and Information Technology (NIELIT)',
      category: 'Electronics & Advanced Computing',
      eligibility: 'Engineering / Polytechnic students and tech practitioners',
      matchPercentage: 84,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'Autonomous Scientific Society under MeitY certification',
        'Hands-on embedded systems and enterprise AI integration',
        'High value for public sector and defense electronics careers'
      ],
      aiExplanation: 'Recommended as a prestigious institutional diploma that extends your engineering foundation into cyber resilience and hardware-accelerated AI computation.',
      skillsGained: [
        'Edge AI & Embedded Computing',
        'Cloud Infrastructure & Microservices',
        'Cybersecurity & Network Defense',
        'Database Optimization'
      ],
      duration: '6 Months (480 Hours)',
      mode: 'NIELIT Regional Campus + Online Practicals',
      stipend: '₹1,500 / Month Scholarship for Merit Candidates',
      officialPortalUrl: 'https://www.nielit.gov.in',
      matchFactors: {
        occupationMatch: 85,
        skillMatch: 82,
        interestMatch: 86,
        eligibilityMatch: 90,
        locationMatch: 78
      }
    }
  ],

  // 4. HEALTHCARE, NURSING & MEDICAL ASSISTANCE
  healthcare: [
    {
      id: 'prog-pmkvy-gda',
      title: 'PMKVY 4.0: General Duty Assistant (GDA) & Healthcare Specialist',
      provider: 'Healthcare Sector Skill Council (HSSC) & NSDC',
      category: 'Healthcare & Patient Management',
      eligibility: '10th / 12th Pass or existing community health workers',
      matchPercentage: 95,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Recognized qualification for government and private hospital nursing assistance',
        '100% Free hands-on clinical lab training with hospital internship',
        'Direct healthcare job placement across state medical colleges and hospitals'
      ],
      aiExplanation: 'Recommended to certify your patient care and community health capabilities under National Health Mission standards.',
      skillsGained: [
        'Patient Vital Signs & Clinical Monitoring',
        'Emergency First Aid & CPR Protocols',
        'Infection Control & Medical Sanitation',
        'Hospital Record Management'
      ],
      duration: '3 Months (360 Hours with Hospital Clinicals)',
      mode: 'District Hospital Skill Center',
      stipend: '₹1,000 / Month Clinical Allowance',
      toolkitGrant: 'Certified Medical Diagnostic Kit',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 95,
        interestMatch: 94,
        eligibilityMatch: 98,
        locationMatch: 92
      }
    },
    {
      id: 'prog-nhm-paramedic',
      title: 'National Health Mission: Emergency Medical Technician & Nursing Upgrade',
      provider: 'Ministry of Health and Family Welfare (MoHFW)',
      category: 'Emergency Care & Paramedics',
      eligibility: '12th Science / Paramedic aspirants / Clinic assistants',
      matchPercentage: 88,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Government ambulance (108 Service) and trauma center certification',
        'High employment demand across ambulance networks and ICU setups',
        'Covers advanced life support and triage management'
      ],
      aiExplanation: 'Recommended to upgrade your medical assistance capabilities into certified emergency triage and intensive patient care.',
      skillsGained: [
        'Trauma Triage & Pre-Hospital Care',
        'Oxygen Therapy & ECG Monitoring',
        'Emergency Drug Administration Protocols',
        'Ambulance Equipment Operation'
      ],
      duration: '4 Months (400 Hours)',
      mode: 'Government Medical College Hospital',
      stipend: '₹1,500 / Month Training Stipend',
      officialPortalUrl: 'https://nhm.gov.in',
      matchFactors: {
        occupationMatch: 90,
        skillMatch: 86,
        interestMatch: 88,
        eligibilityMatch: 94,
        locationMatch: 85
      }
    },
    {
      id: 'prog-ayushman-digital',
      title: 'Ayushman Bharat Digital Health: Health Informatics & Clinical Records',
      provider: 'National Health Authority (NHA) & NSDC',
      category: 'Digital Health & Medical Analytics',
      eligibility: '12th Pass / Graduates with basic computer skills',
      matchPercentage: 82,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'Part of national roll-out of Ayushman Bharat Digital Mission (ABDM)',
        'Certifies digital health record management, telemedicine, and hospital billing',
        'High demand for digital coordinators at Primary Health Centers (PHCs)'
      ],
      aiExplanation: 'Recommended to combine healthcare familiarity with modern digital health informatics and clinic management systems.',
      skillsGained: [
        'ABHA Card Creation & Health ID Systems',
        'Electronic Health Record (EHR) Platforms',
        'Telemedicine Support & Patient Tele-consultation',
        'Insurance & PM-JAY Claim Processing'
      ],
      duration: '2 Months (160 Hours)',
      mode: 'District Digital Health Hub',
      stipend: '₹500 Direct DBT on Certification',
      officialPortalUrl: 'https://abdm.gov.in',
      matchFactors: {
        occupationMatch: 84,
        skillMatch: 80,
        interestMatch: 85,
        eligibilityMatch: 90,
        locationMatch: 80
      }
    }
  ],

  // 5. ELECTRICAL, SOLAR & WIREMAN
  electrical_solar: [
    {
      id: 'prog-suryaghar-elec',
      title: 'PM Surya Ghar: Certified Solar PV & Grid-Tied Inverter Technician',
      provider: 'Skill Council for Green Jobs (SCGJ) & MNRE',
      category: 'Green Energy & Electrical Engineering',
      eligibility: 'Wiremen / Electricians / ITI / 10th Pass with electrical familiarity',
      matchPercentage: 95,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Directly matches your electrical and wireman experience',
        'Massive demand generated by PM Surya Ghar 1 Crore Solar Rooftop Mission',
        'Free NCVET Level 4 certification + direct vendor registration'
      ],
      aiExplanation: 'Recommended because your confirmed background is in electrical installations. Rooftop solar is currently the fastest-growing livelihood domain in India with high self-employment earnings.',
      skillsGained: [
        'Grid-Tied Solar Inverter Installation',
        'DC Cabling, Earthing & Lightning Arrestors',
        'Smart Net-Metering Configuration',
        'Safety & High-Voltage Handling'
      ],
      duration: '2 Months (240 Hours)',
      mode: 'District Skill Training Center',
      stipend: '₹1,500 / Month DBT Stipend',
      toolkitGrant: '₹10,000 Digital Multimeter & Safety Toolkit',
      officialPortalUrl: 'https://pmsuryaghar.gov.in',
      matchFactors: {
        occupationMatch: 96,
        skillMatch: 95,
        interestMatch: 94,
        eligibilityMatch: 98,
        locationMatch: 90
      }
    },
    {
      id: 'prog-pmkvy-wireman',
      title: 'PMKVY 4.0: Smart Home Automation & Industrial Electrical Technician',
      provider: 'Power Sector Skill Council (PSSC) & NSDC',
      category: 'Power & Electrical Infrastructure',
      eligibility: 'Electricians with 1+ years field experience',
      matchPercentage: 88,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Recognition of Prior Learning (RPL) certification for informal wiremen',
        'Covers smart MCB boards, IoT switchboards, and 3-phase wiring',
        'Includes ₹2 Lakh Accidental Insurance for 3 Years'
      ],
      aiExplanation: 'Recommended to formally validate your existing electrical wiring skills and upgrade to modern IoT switches and industrial panel wiring.',
      skillsGained: [
        'IoT & Smart Home Relays',
        '3-Phase Industrial Panel Wiring',
        'Fault Finding & Thermal Imaging',
        'National Electrical Code Compliance'
      ],
      duration: '45 Days Intensive',
      mode: 'Local ITI Skill Lab',
      stipend: '₹500 Exam Cash Reward',
      toolkitGrant: 'Insulated Tool Set Voucher',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 92,
        skillMatch: 88,
        interestMatch: 86,
        eligibilityMatch: 94,
        locationMatch: 85
      }
    },
    {
      id: 'prog-vishwakarma-elec',
      title: 'PM Vishwakarma: Electrical Craft & Small Appliance Enterprise Program',
      provider: 'Ministry of MSME',
      category: 'Artisans & Technical Enterprises',
      eligibility: 'Self-employed electrical technicians and repair workers',
      matchPercentage: 83,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        '₹15,000 Free Advanced Power Toolkit E-Voucher',
        '5-day basic training with ₹500/day allowance',
        'Collateral-free business loan up to ₹3,00,000 at 5% interest'
      ],
      aiExplanation: 'Recommended if you wish to establish your own electrical repair shop or enterprise in your local taluk.',
      skillsGained: [
        'Motor Rewinding & Pump Repair',
        'Digital Payments & Shop Management',
        'Customer Billing & Warranties',
        'Enterprise Financial Literacy'
      ],
      duration: '5 to 15 Days',
      mode: 'District MSME Center',
      stipend: '₹500 / Day Allowance',
      toolkitGrant: '₹15,000 E-Voucher',
      loanSupport: 'Up to ₹3 Lakhs @ 5%',
      officialPortalUrl: 'https://pmvishwakarma.gov.in',
      matchFactors: {
        occupationMatch: 86,
        skillMatch: 82,
        interestMatch: 84,
        eligibilityMatch: 90,
        locationMatch: 80
      }
    }
  ],

  // 6. TAILORING, TEXTILES & FASHION
  tailoring_crafts: [
    {
      id: 'prog-vishwakarma-darzi',
      title: 'PM Vishwakarma: Master Tailor (Darzi) Modern Power Sewing & Design Program',
      provider: 'Ministry of MSME & Apparel Made-Ups Skill Council (AMHSSC)',
      category: 'Apparel, Textiles & Traditional Trades',
      eligibility: 'Tailors, garment workers, self-employed women and rural artisans',
      matchPercentage: 95,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        '₹15,000 E-Voucher for motorized heavy-duty sewing machine & cutting kit',
        '₹500/day daily stipend during the 5-7 days masterclass',
        'Access to ₹1–3 Lakh collateral-free micro-enterprise loan at 5%'
      ],
      aiExplanation: 'Recommended because your confirmed background is tailoring. PM Vishwakarma equips you with modern electric sewing machinery and pattern drafting tools to triple your daily garment output.',
      skillsGained: [
        'Motorized Sewing & Overlock Finishing',
        'Modern Pattern Drafting & Fitment',
        'Boutique Quality Quality Inspection',
        'Online Garment Selling & Digital Payments'
      ],
      duration: '5 to 7 Days Basic + 15 Days Advanced',
      mode: 'District MSME Training Center',
      stipend: '₹500 / Day Training Allowance',
      toolkitGrant: '₹15,000 Free Toolkit Voucher for Electric Machine',
      loanSupport: 'Up to ₹3,00,000 Collateral-Free Credit @ 5%',
      officialPortalUrl: 'https://pmvishwakarma.gov.in',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 96,
        interestMatch: 95,
        eligibilityMatch: 99,
        locationMatch: 90
      }
    },
    {
      id: 'prog-samarth-textile',
      title: 'SAMARTH Scheme: Advanced Apparel Manufacturing & Designer Stitching',
      provider: 'Ministry of Textiles, Government of India',
      category: 'Textile Industry & Export Apparel',
      eligibility: 'Rural women, self-help group members and tailors',
      matchPercentage: 89,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        '100% Free residential training with placement in garment industrial parks',
        'Biometric-verified government certification',
        'Guaranteed minimum wage placement assistance'
      ],
      aiExplanation: 'Recommended if you want to transition from local individual alteration to high-volume commercial boutique production or export garment manufacturing.',
      skillsGained: [
        'Industrial Single Needle & Multi-Needle Machines',
        'Fabric Quality Control & Defect Detection',
        'Garment Assembly Line Production',
        'Safety in Industrial Garment Units'
      ],
      duration: '300 Hours (Approx 2 Months)',
      mode: 'State Textile Training Institute',
      stipend: 'Free Lodging, Boarding & Conveyance',
      toolkitGrant: 'Certification & Trade Badge',
      officialPortalUrl: 'https://samarth-textiles.gov.in',
      matchFactors: {
        occupationMatch: 92,
        skillMatch: 88,
        interestMatch: 86,
        eligibilityMatch: 95,
        locationMatch: 85
      }
    },
    {
      id: 'prog-pmkvy-fashion',
      title: 'PMKVY 4.0: Hand Embroidery & Traditional Zari Craft Certification',
      provider: 'Handicrafts and Carpet Sector Skill Council (HCSSC)',
      category: 'Handicrafts & Heritage Crafts',
      eligibility: 'Artisans and traditional embroidery craftswomen',
      matchPercentage: 82,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'Preserves and monetizes traditional artisan embroidery techniques',
        'Direct onboarding on government GeM and TRIFED portals',
        'NSQF Level 3 national certificate'
      ],
      aiExplanation: 'Recommended to expand your stitching repertoire into high-margin designer bridal embroidery and artisan craft exhibitions.',
      skillsGained: [
        'Zari & Zardozi Handwork Techniques',
        'Color Blending & Motif Layout',
        'Beadwork & Appliqué Assembly',
        'Direct Exhibition Marketing'
      ],
      duration: '2 Months (200 Hours)',
      mode: 'Cluster Artisan Center',
      stipend: '₹500 Direct Benefit Transfer',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 85,
        skillMatch: 80,
        interestMatch: 84,
        eligibilityMatch: 92,
        locationMatch: 80
      }
    }
  ],

  // 7. AGRICULTURE & SMART FARMING (ONLY MATCHED WHEN EXPLICITLY FARMING)
  agriculture: [
    {
      id: 'prog-pmkvy-agri',
      title: 'PMKVY 4.0: Precision Agriculture & Drip Automation Specialization',
      provider: 'National Skill Development Corporation (NSDC) & ASCI',
      category: 'Agriculture & Smart Farming',
      eligibility: 'Informal farmers / agricultural workers with 1+ years experience',
      matchPercentage: 94,
      rankBadge: 'BEST MATCH',
      whyMatched: [
        'Directly matches your confirmed farming experience & irrigation knowledge',
        'Addresses your primary identified skill gap in precision agriculture',
        'Provides government-recognized NSQF Level 4 certification with zero tuition fees'
      ],
      aiExplanation: 'Recommended because your confirmed profile contains practical agriculture experience, irrigation handling, and an explicit interest in modernizing field operations. This program directly bridges your identified gap in sensor-based drip irrigation and precision soil testing.',
      skillsGained: [
        'Smart Sensor Drip Irrigation',
        'Precision Soil Nutrient Mapping',
        'Drone-Assisted Crop Health Monitoring',
        'Solar Irrigation Pump Maintenance'
      ],
      duration: '3 Months (300 Hours Hands-on Practical)',
      mode: 'Hybrid (Local Krishi Vigyan Kendra + Field Labs)',
      stipend: '₹500 Direct DBT on Certification + Free Accident Insurance',
      toolkitGrant: '₹5,000 Precision Tool Voucher',
      officialPortalUrl: 'https://www.pmkvyofficial.org',
      matchFactors: {
        occupationMatch: 98,
        skillMatch: 95,
        interestMatch: 96,
        eligibilityMatch: 100,
        locationMatch: 90
      }
    },
    {
      id: 'prog-vishwakarma-agri',
      title: 'PM Vishwakarma Scheme: Modern Agricultural Tool & Equipment Crafting',
      provider: 'Ministry of MSME & NCVET',
      category: 'Traditional Trades & Equipment Operations',
      eligibility: 'Self-employed rural artisans and equipment operators',
      matchPercentage: 87,
      rankBadge: 'SECOND OPTION',
      whyMatched: [
        'Offers ₹15,000 free modern toolkit e-voucher upon training completion',
        'Includes ₹500/day daily stipend during the intensive training',
        'Provides access to collateral-free enterprise loan up to ₹3 Lakh at 5% interest'
      ],
      aiExplanation: 'Recommended because your profile includes tractor and mechanical farm equipment handling.',
      skillsGained: [
        'Modern Power Tools Handling',
        'Farm Implement Assembly & Repair',
        'Digital Payments & MSME Onboarding',
        'Safety and Occupational Health Protocols'
      ],
      duration: '5 to 7 Days Basic Training',
      mode: 'District Training Center',
      stipend: '₹500 / Day Training Allowance',
      toolkitGrant: '₹15,000 E-Voucher for Modern Tool Purchase',
      loanSupport: 'Up to ₹3,00,000 Collateral-Free Credit @ 5%',
      officialPortalUrl: 'https://pmvishwakarma.gov.in',
      matchFactors: {
        occupationMatch: 90,
        skillMatch: 86,
        interestMatch: 88,
        eligibilityMatch: 95,
        locationMatch: 85
      }
    },
    {
      id: 'prog-suryaghar-agri',
      title: 'PM Surya Ghar: Solar Agricultural Water Pumping & Rooftop Technician',
      provider: 'Skill Council for Green Jobs (SCGJ) & MNRE',
      category: 'Green Energy & Solar Power',
      eligibility: 'Prior rural technical exposure or 10th pass',
      matchPercentage: 81,
      rankBadge: 'THIRD OPTION',
      whyMatched: [
        'High market demand for rural solar water pumps under PM-KUSUM',
        'Direct linkage with certified solar vendors',
        '100% free residential lodging and certification'
      ],
      aiExplanation: 'Recommended as a high-value adjacent capability for solar water pump installation.',
      skillsGained: [
        'Solar PV Array Mounting & Earthing',
        'Submersible Solar Pump Controllers',
        'Net-Metering & Inverter Troubleshooting',
        'Battery Bank Maintenance'
      ],
      duration: '3 Months (600 Hours)',
      mode: 'Residential at State Renewable Energy Institute',
      stipend: '₹2,000 / Month Stipend',
      officialPortalUrl: 'https://pmsuryaghar.gov.in',
      matchFactors: {
        occupationMatch: 82,
        skillMatch: 79,
        interestMatch: 85,
        eligibilityMatch: 90,
        locationMatch: 80
      }
    }
  ]
};

export const DEFAULT_90_DAY_ROADMAP: RoadmapStep[] = [
  {
    weekRange: 'Week 1–2',
    title: 'Orientation & Core Foundations',
    description: 'Understand modern professional standards, digital tools, and industry safety architectures.',
    milestone: 'Foundational Knowledge Badge',
    icon: '🌱'
  },
  {
    weekRange: 'Week 3–5',
    title: 'Hands-on Equipment & Lab Training',
    description: 'Complete rigorous practical training with modern automated implements, software, and tools.',
    milestone: 'Practical Tool Assessment',
    icon: '⚙️'
  },
  {
    weekRange: 'Week 6–8',
    title: 'Field Execution & Real Project Work',
    description: 'Deploy learned advanced techniques in live projects under expert master mentorship.',
    milestone: 'Live Project Verification',
    icon: '🚀'
  },
  {
    weekRange: 'Week 9–12',
    title: 'NSQF Certification & Opportunity Linkage',
    description: 'Official NCVET skill assessment, receipt of Kaushal Digital Card, government grants/toolkits, and formal enterprise/job linkage.',
    milestone: 'Government Certificate & Grant Disbursement',
    icon: '🏆'
  }
];

export function getMatchedProgramsForProfile(occupation: string, aspiration: string): MatchedProgram[] {
  const occ = (occupation || '').toLowerCase();
  const asp = (aspiration || '').toLowerCase();
  const combined = `${occ} ${asp}`;

  // 1. Civil Services, Public Administration & Governance (UPSC, IAS, IPS, Civil Service, Police, Government)
  if (
    combined.includes('civil service') ||
    combined.includes('ias') ||
    combined.includes('ips') ||
    combined.includes('police') ||
    combined.includes('upsc') ||
    combined.includes('kpsc') ||
    combined.includes('psc') ||
    combined.includes('government officer') ||
    combined.includes('public admin') ||
    combined.includes('governance') ||
    combined.includes('civil servant') ||
    combined.includes('ಸಾರ್ವಜನಿಕ ಸೇವೆ') ||
    combined.includes('ಐಎಎಸ್') ||
    combined.includes('ಐಪಿಎಸ್') ||
    combined.includes('ಪೊಲೀಸ್')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.civil_services;
  }

  // 2. Event Management, Hospitality & Catering
  if (
    combined.includes('event') ||
    combined.includes('catering') ||
    combined.includes('hotel') ||
    combined.includes('hospitality') ||
    combined.includes('food service') ||
    combined.includes('tourism') ||
    combined.includes('management') ||
    combined.includes('ಇವೆಂಟ್') ||
    combined.includes('ಕ್ಯಾಟರಿಂಗ್')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.event_hospitality;
  }

  // 3. Tech / Computer / AI / Software / Engineering
  if (
    combined.includes('comput') || 
    combined.includes('software') || 
    combined.includes('ai') || 
    combined.includes('artificial') || 
    combined.includes('engineer') || 
    combined.includes('data') || 
    combined.includes('developer') ||
    combined.includes('python') ||
    combined.includes('coding') ||
    combined.includes('program') ||
    combined.includes('ಕಂಪ್ಯೂಟರ್') || 
    combined.includes('ಇಂಜಿನಿಯರ್') || 
    combined.includes('ಇಂಟೆಲಿಜೆನ್ಸ್')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.tech_ai;
  }

  // 4. Healthcare / Nursing / Medical
  if (
    combined.includes('nurse') ||
    combined.includes('health') ||
    combined.includes('medical') ||
    combined.includes('hospital') ||
    combined.includes('clinic') ||
    combined.includes('asha') ||
    combined.includes('paramedic') ||
    combined.includes('ಆರೋಗ್ಯ') ||
    combined.includes('ನರ್ಸ್')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.healthcare;
  }

  // 5. Electrical / Solar / Wireman
  if (
    combined.includes('electr') || 
    combined.includes('wireman') || 
    combined.includes('solar') || 
    combined.includes('inverter') || 
    combined.includes('ವಿದ್ಯುತ್') || 
    combined.includes('ಸೋಲಾರ್') || 
    combined.includes('ವೈರ್ಮನ್')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.electrical_solar;
  }

  // 6. Tailoring / Stitching / Garment / Fashion
  if (
    combined.includes('tailor') || 
    combined.includes('stitch') || 
    combined.includes('cloth') || 
    combined.includes('dress') || 
    combined.includes('sewing') || 
    combined.includes('fashion') || 
    combined.includes('boutique') ||
    combined.includes('ಟೈಲರ್') || 
    combined.includes('ಬಟ್ಟೆ') || 
    combined.includes('ಹೊಲಿಗೆ')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.tailoring_crafts;
  }

  // 7. Agriculture & Farming (ONLY if explicitly containing farming terms!)
  if (
    combined.includes('farm') || 
    combined.includes('agri') || 
    combined.includes('crop') || 
    combined.includes('tractor') || 
    combined.includes('irrigation') || 
    combined.includes('dairy') || 
    combined.includes('soil') ||
    combined.includes('ಕೃಷಿ') || 
    combined.includes('ರೈತ') || 
    combined.includes('ಬೆಳೆ')
  ) {
    return MULTI_SECTOR_PROGRAMS_DATABASE.agriculture;
  }

  // 8. General Professional / Student fallback
  return MULTI_SECTOR_PROGRAMS_DATABASE.civil_services;
}
