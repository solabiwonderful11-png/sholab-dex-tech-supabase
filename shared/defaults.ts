// ─────────────────────────────────────────────────────────────────────────────
// GENERATED FILE — do not edit by hand.
//
// Produced by `node scripts/gen-defaults.mjs` from the live Supabase content.
// It is the snapshot the /sholab "Reset to default" button restores, so it must
// stay in step with supabase/seed.sql. Regenerate it after changing either.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Faq,
  PricingPackage,
  Project,
  Service,
  SiteSettings,
  Stat,
  Testimonial,
} from "./types";

/** The single site_settings row, as shipped. */
export const DEFAULT_SETTINGS: SiteSettings = {
  "companyName": "Sholab Dex Tech",
  "ceoName": "Natlus Niel",
  "ceoTitle": "CEO & Founder",
  "ceoBio": "Natlus Niel leads Sholab Dex Tech with a simple belief: every business, no matter how small, deserves technology that actually works for it. He oversees every website, automation system and promotion campaign the company delivers — from the first conversation to launch and beyond.",
  "ceoPhoto": null,
  "email": "solabiwonderful09@gmail.com",
  "phone": "+2348169781185",
  "whatsappNumber": "2348169781185",
  "businessHours": "Monday – Saturday, 8:00 AM – 8:00 PM (WAT)",
  "socials": [
    {
      "url": "#",
      "label": "Facebook"
    },
    {
      "url": "#",
      "label": "Instagram"
    },
    {
      "url": "#",
      "label": "X (Twitter)"
    },
    {
      "url": "#",
      "label": "LinkedIn"
    },
    {
      "url": "#",
      "label": "TikTok"
    }
  ],
  "heroHeadline": "Sholab Dex Tech",
  "heroTagline": "We Build Websites, Automate Businesses, and Grow Brands.",
  "heroIntro": "Sholab Dex Tech is a digital solutions company helping businesses get online, save time with AI automation, and reach more customers through smart promotion. From a simple business website to a full AI automation system, we handle the technology so you can focus on running your business.",
  "heroCtaPrimary": "Get a Free Quote",
  "heroCtaSecondary": "Chat on WhatsApp",
  "heroImage": null,
  "aboutHeading": "About Sholab Dex Tech",
  "aboutBody": "Sholab Dex Tech is a digital solutions company built for businesses that want to grow without getting buried in technology. We design and build websites that convert, set up AI automation that saves hours every week, and run promotions that put your brand in front of the right people. Whether you are a startup launching your first site, a shop going online, or an established business ready to automate, we bring the web, AI and marketing together under one roof — so you have one team to call instead of three.",
  "mission": "To help businesses of every size use modern technology — great websites, smart AI automation, and effective promotion — to grow faster and work smarter.",
  "vision": "To become the go-to digital solutions partner for small and growing businesses across Nigeria and beyond.",
  "whyChooseUs": [
    {
      "title": "Affordable Pricing",
      "description": "Real solutions at prices that make sense for small and growing businesses."
    },
    {
      "title": "Fast Delivery",
      "description": "We work to clear timelines and keep you updated at every stage."
    },
    {
      "title": "Modern Designs",
      "description": "Clean, professional, mobile-friendly work that makes your brand look the part."
    },
    {
      "title": "Real Business Results",
      "description": "We focus on what actually moves the needle: more customers, more sales, less wasted time."
    },
    {
      "title": "Ongoing Support",
      "description": "We do not disappear after launch — we stay available to help and improve."
    },
    {
      "title": "One Team for Everything",
      "description": "Websites, AI automation and marketing from a single team that understands your business."
    }
  ],
  "processSteps": [
    {
      "title": "Discovery",
      "description": "We listen to your goals, your business and your budget."
    },
    {
      "title": "Planning",
      "description": "We map out the structure, features, timeline and cost."
    },
    {
      "title": "Design",
      "description": "We design the look and feel and get your approval."
    },
    {
      "title": "Development",
      "description": "We build, test and refine everything."
    },
    {
      "title": "Launch & Support",
      "description": "We launch your project and stay available for support."
    }
  ],
  "pricingNote": "All prices are starting prices. Final quotes depend on project scope. A 50% deposit is required before work begins. Prices are negotiable — chat with us on WhatsApp for a custom quote.",
  "footerDescription": "Websites, AI automation and business promotions — built to help your business grow.",
  "footerCopyright": "© 2026 Sholab Dex Tech. All rights reserved.",
  "footerCredit": "Designed by Sholab Dex Tech",
  "seoTitle": "Sholab Dex Tech | Websites, AI Automation & Business Promotions",
  "seoDescription": "Sholab Dex Tech builds modern websites, sets up AI automation, and runs business promotions that help you get more customers and save time. Get a free quote today.",
  "seoKeywords": "website development Nigeria, AI automation, business promotion, WhatsApp chatbot, e-commerce website, social media management, Sholab Dex Tech",
  "seoOgImage": null,
  "logo": null,
  "favicon": null
} as SiteSettings;

export const DEFAULT_SERVICES: Omit<Service, "id">[] = [
  {
    "category": "websites",
    "name": "Business & Corporate Websites",
    "description": "Professional multi-page sites that present your business clearly and convert visitors into customers.",
    "icon": null,
    "sortOrder": 0
  },
  {
    "category": "websites",
    "name": "E-commerce / Online Stores",
    "description": "Sell online with a store that handles products, cart and payments smoothly.",
    "icon": null,
    "sortOrder": 1
  },
  {
    "category": "websites",
    "name": "Landing Pages & Sales Funnels",
    "description": "Focused pages built for one goal: turning visitors into leads and buyers.",
    "icon": null,
    "sortOrder": 2
  },
  {
    "category": "websites",
    "name": "Portfolio & Personal Websites",
    "description": "Showcase your work, skills and story with a clean personal site.",
    "icon": null,
    "sortOrder": 3
  },
  {
    "category": "websites",
    "name": "Blog & News Websites",
    "description": "Publish content easily with a fast, well-structured blog or news platform.",
    "icon": null,
    "sortOrder": 4
  },
  {
    "category": "websites",
    "name": "Website Redesign & Revamp",
    "description": "Give an outdated site a modern, faster, mobile-friendly new look.",
    "icon": null,
    "sortOrder": 5
  },
  {
    "category": "websites",
    "name": "Website Maintenance & Support",
    "description": "Ongoing updates, fixes and monitoring so your site stays healthy.",
    "icon": null,
    "sortOrder": 6
  },
  {
    "category": "websites",
    "name": "Domain & Hosting Setup",
    "description": "We register your domain, set up hosting and get everything live.",
    "icon": null,
    "sortOrder": 7
  },
  {
    "category": "websites",
    "name": "Speed Optimization",
    "description": "Make your site load fast — better experience, better rankings.",
    "icon": null,
    "sortOrder": 8
  },
  {
    "category": "websites",
    "name": "SEO Setup (On-Page)",
    "description": "Titles, meta tags, structure and content tuned so people can find you.",
    "icon": null,
    "sortOrder": 9
  },
  {
    "category": "websites",
    "name": "Mobile Responsiveness",
    "description": "Your site looking and working perfectly on every phone and tablet.",
    "icon": null,
    "sortOrder": 10
  },
  {
    "category": "websites",
    "name": "Website Security & Backups",
    "description": "Protect your site with security hardening and automatic backups.",
    "icon": null,
    "sortOrder": 11
  },
  {
    "category": "websites",
    "name": "Payment Gateway Integration",
    "description": "Accept payments online with secure, trusted payment options.",
    "icon": null,
    "sortOrder": 12
  },
  {
    "category": "websites",
    "name": "Booking & Appointment Systems",
    "description": "Let customers book your time automatically, without back-and-forth.",
    "icon": null,
    "sortOrder": 13
  },
  {
    "category": "websites",
    "name": "CMS Setup (WordPress, etc.)",
    "description": "Manage your own content easily with a friendly content management system.",
    "icon": null,
    "sortOrder": 14
  },
  {
    "category": "websites",
    "name": "Web App / Custom Development",
    "description": "Custom tools and web applications built around how your business works.",
    "icon": null,
    "sortOrder": 15
  },
  {
    "category": "automation",
    "name": "WhatsApp Chatbot & Auto-Reply",
    "description": "Answer common questions instantly and capture leads 24/7 on WhatsApp.",
    "icon": null,
    "sortOrder": 16
  },
  {
    "category": "automation",
    "name": "AI Customer Support Assistant",
    "description": "An AI assistant that handles routine support questions and escalates the rest.",
    "icon": null,
    "sortOrder": 17
  },
  {
    "category": "automation",
    "name": "Lead Capture & Follow-Up Automation",
    "description": "Never lose a lead again — automatic capture and follow-up sequences.",
    "icon": null,
    "sortOrder": 18
  },
  {
    "category": "automation",
    "name": "Email Marketing Automation",
    "description": "Welcome, nurture and re-engage customers with automated email flows.",
    "icon": null,
    "sortOrder": 19
  },
  {
    "category": "automation",
    "name": "Social Media Content Automation",
    "description": "Plan, schedule and publish content without doing it all by hand.",
    "icon": null,
    "sortOrder": 20
  },
  {
    "category": "automation",
    "name": "AI Content Writing",
    "description": "Captions, blogs and ad copy drafted by AI and polished for your brand.",
    "icon": null,
    "sortOrder": 21
  },
  {
    "category": "automation",
    "name": "Invoice & Receipt Automation",
    "description": "Generate and send invoices and receipts automatically.",
    "icon": null,
    "sortOrder": 22
  },
  {
    "category": "automation",
    "name": "Appointment Booking Automation",
    "description": "Automated scheduling, reminders and confirmations for your bookings.",
    "icon": null,
    "sortOrder": 23
  },
  {
    "category": "automation",
    "name": "CRM Setup & Automation",
    "description": "Keep every customer, deal and follow-up organised in one place.",
    "icon": null,
    "sortOrder": 24
  },
  {
    "category": "automation",
    "name": "Data Entry & Document Processing",
    "description": "Turn documents and forms into clean, usable data automatically.",
    "icon": null,
    "sortOrder": 25
  },
  {
    "category": "automation",
    "name": "AI Voice Notes / Transcription",
    "description": "Convert voice notes and calls into searchable text automatically.",
    "icon": null,
    "sortOrder": 26
  },
  {
    "category": "automation",
    "name": "Workflow Automation Between Apps",
    "description": "Connect your tools so data flows between them without manual work.",
    "icon": null,
    "sortOrder": 27
  },
  {
    "category": "automation",
    "name": "AI Sales Funnel Automation",
    "description": "Automated funnels that nurture leads and move them toward buying.",
    "icon": null,
    "sortOrder": 28
  },
  {
    "category": "automation",
    "name": "Reporting & Analytics Dashboards",
    "description": "See your numbers clearly with automated reports and dashboards.",
    "icon": null,
    "sortOrder": 29
  },
  {
    "category": "automation",
    "name": "AI Training & Consultation",
    "description": "We train your team to use AI tools confidently in daily work.",
    "icon": null,
    "sortOrder": 30
  },
  {
    "category": "promotions",
    "name": "Social Media Management",
    "description": "We plan, create and post content that keeps your brand active and visible.",
    "icon": null,
    "sortOrder": 31
  },
  {
    "category": "promotions",
    "name": "Social Media Advertising",
    "description": "Targeted Facebook, Instagram and TikTok ads that reach real buyers.",
    "icon": null,
    "sortOrder": 32
  },
  {
    "category": "promotions",
    "name": "Google Ads Setup & Management",
    "description": "Appear when people search for what you sell, and manage the spend wisely.",
    "icon": null,
    "sortOrder": 33
  },
  {
    "category": "promotions",
    "name": "Brand Identity & Logo Design",
    "description": "A memorable logo and consistent brand look across everything you do.",
    "icon": null,
    "sortOrder": 34
  },
  {
    "category": "promotions",
    "name": "Flyer, Banner & Poster Design",
    "description": "Eye-catching designs for print and digital promotion.",
    "icon": null,
    "sortOrder": 35
  },
  {
    "category": "promotions",
    "name": "Product Photography & Video Ads",
    "description": "Show your products at their best with photos and short video ads.",
    "icon": null,
    "sortOrder": 36
  },
  {
    "category": "promotions",
    "name": "Content Strategy & Calendar",
    "description": "A clear plan of what to post, when, and why — mapped to your goals.",
    "icon": null,
    "sortOrder": 37
  },
  {
    "category": "promotions",
    "name": "Influencer & Artist Promotion",
    "description": "Get your brand or music in front of engaged, relevant audiences.",
    "icon": null,
    "sortOrder": 38
  },
  {
    "category": "promotions",
    "name": "Music Promotion",
    "description": "Streams, playlist placements and airplay to grow your music's reach.",
    "icon": null,
    "sortOrder": 39
  },
  {
    "category": "promotions",
    "name": "Email & SMS Marketing Campaigns",
    "description": "Direct campaigns that bring customers back and drive repeat sales.",
    "icon": null,
    "sortOrder": 40
  },
  {
    "category": "promotions",
    "name": "SEO & Local Business Listing",
    "description": "Get found online and in local searches in your area.",
    "icon": null,
    "sortOrder": 41
  },
  {
    "category": "promotions",
    "name": "Google Business Profile Setup",
    "description": "A complete, optimised Google profile so local customers find you first.",
    "icon": null,
    "sortOrder": 42
  },
  {
    "category": "promotions",
    "name": "Business Consulting & Growth Strategy",
    "description": "Practical advice on how to grow, price and position your business.",
    "icon": null,
    "sortOrder": 43
  },
  {
    "category": "promotions",
    "name": "Copywriting & Sales Copy",
    "description": "Words that sell — for your site, ads, emails and social posts.",
    "icon": null,
    "sortOrder": 44
  },
  {
    "category": "promotions",
    "name": "Event & Launch Promotion",
    "description": "Build buzz and fill seats for your next event or product launch.",
    "icon": null,
    "sortOrder": 45
  }
];

export const DEFAULT_PACKAGES: Omit<PricingPackage, "id">[] = [
  {
    "category": "websites",
    "name": "Starter Website",
    "priceNgn": "₦80,000",
    "priceUsd": "~$55",
    "features": [
      "3–5 pages",
      "Mobile-friendly design",
      "Contact form",
      "Basic on-page SEO",
      "Delivery in 5–7 days"
    ],
    "isPopular": false,
    "sortOrder": 0
  },
  {
    "category": "websites",
    "name": "Business Website",
    "priceNgn": "₦180,000",
    "priceUsd": "~$120",
    "features": [
      "6–10 pages",
      "Custom design",
      "SEO setup",
      "Contact forms",
      "Google Analytics",
      "Delivery in 10–14 days"
    ],
    "isPopular": true,
    "sortOrder": 1
  },
  {
    "category": "websites",
    "name": "E-commerce Store",
    "priceNgn": "₦350,000",
    "priceUsd": "~$230",
    "features": [
      "Product catalogue",
      "Shopping cart",
      "Payment gateway",
      "Order management",
      "Customer accounts"
    ],
    "isPopular": false,
    "sortOrder": 2
  },
  {
    "category": "websites",
    "name": "Custom Web App",
    "priceNgn": "from ₦600,000",
    "priceUsd": "~$400",
    "features": [
      "Custom features",
      "Database & dashboards",
      "User roles",
      "API integrations",
      "Ongoing support"
    ],
    "isPopular": false,
    "sortOrder": 3
  },
  {
    "category": "websites",
    "name": "Website Maintenance",
    "priceNgn": "₦25,000",
    "priceUsd": "~$17 / month",
    "features": [
      "Monthly updates",
      "Security checks",
      "Backups",
      "Uptime monitoring",
      "Priority support"
    ],
    "isPopular": false,
    "sortOrder": 4
  },
  {
    "category": "websites",
    "name": "Website Redesign",
    "priceNgn": "from ₦120,000",
    "priceUsd": "~$80",
    "features": [
      "Modern new look",
      "Speed improvements",
      "Mobile optimisation",
      "Content migration",
      "SEO preserved"
    ],
    "isPopular": false,
    "sortOrder": 5
  },
  {
    "category": "automation",
    "name": "Starter Automation",
    "priceNgn": "₦60,000",
    "priceUsd": "~$40",
    "features": [
      "1 chatbot or 1 workflow",
      "Setup & testing",
      "Basic training",
      "30 days support"
    ],
    "isPopular": false,
    "sortOrder": 6
  },
  {
    "category": "automation",
    "name": "Business Automation Package",
    "priceNgn": "₦200,000",
    "priceUsd": "~$135",
    "features": [
      "WhatsApp chatbot",
      "Lead follow-up automation",
      "Email automation",
      "CRM setup",
      "Team training"
    ],
    "isPopular": true,
    "sortOrder": 7
  },
  {
    "category": "automation",
    "name": "Full AI Automation System",
    "priceNgn": "from ₦450,000",
    "priceUsd": "~$300",
    "features": [
      "Multiple workflows",
      "CRM & dashboards",
      "AI support assistant",
      "Reporting automation",
      "Full team training"
    ],
    "isPopular": false,
    "sortOrder": 8
  },
  {
    "category": "automation",
    "name": "Monthly Automation Management",
    "priceNgn": "₦40,000",
    "priceUsd": "~$27 / month",
    "features": [
      "Monitoring & fixes",
      "Workflow updates",
      "Performance reports",
      "Priority support"
    ],
    "isPopular": false,
    "sortOrder": 9
  },
  {
    "category": "automation",
    "name": "AI Consultation / Training",
    "priceNgn": "₦30,000",
    "priceUsd": "~$20 / session",
    "features": [
      "1-on-1 session",
      "Tool recommendations",
      "Hands-on practice",
      "Follow-up notes"
    ],
    "isPopular": false,
    "sortOrder": 10
  },
  {
    "category": "promotions",
    "name": "Social Media Management (1 platform)",
    "priceNgn": "₦70,000",
    "priceUsd": "~$47 / month",
    "features": [
      "1 platform",
      "12 posts per month",
      "Content design",
      "Caption writing",
      "Monthly report"
    ],
    "isPopular": false,
    "sortOrder": 11
  },
  {
    "category": "promotions",
    "name": "Social Media Management (3 platforms)",
    "priceNgn": "₦150,000",
    "priceUsd": "~$100 / month",
    "features": [
      "3 platforms",
      "20 posts per month",
      "Ad management",
      "Content strategy",
      "Monthly report"
    ],
    "isPopular": true,
    "sortOrder": 12
  },
  {
    "category": "promotions",
    "name": "Logo & Brand Identity",
    "priceNgn": "₦50,000",
    "priceUsd": "~$33",
    "features": [
      "Logo design",
      "Colour palette",
      "Typography",
      "Brand guidelines",
      "File pack"
    ],
    "isPopular": false,
    "sortOrder": 13
  },
  {
    "category": "promotions",
    "name": "Flyer / Poster Design",
    "priceNgn": "₦10,000",
    "priceUsd": "~$7 each",
    "features": [
      "Custom design",
      "Print-ready files",
      "2 revisions",
      "Fast turnaround"
    ],
    "isPopular": false,
    "sortOrder": 14
  },
  {
    "category": "promotions",
    "name": "Paid Ads Management",
    "priceNgn": "from ₦80,000",
    "priceUsd": "~$55 / month",
    "features": [
      "Campaign setup",
      "Audience targeting",
      "Ad creative",
      "Optimisation",
      "Reporting"
    ],
    "isPopular": false,
    "sortOrder": 15
  },
  {
    "category": "promotions",
    "name": "Music Promotion Package",
    "priceNgn": "from ₦100,000",
    "priceUsd": "~$67",
    "features": [
      "Playlist pitching",
      "Stream growth",
      "Social promotion",
      "Airplay outreach",
      "Performance report"
    ],
    "isPopular": false,
    "sortOrder": 16
  },
  {
    "category": "promotions",
    "name": "Full Business Promotion Package",
    "priceNgn": "from ₦250,000",
    "priceUsd": "~$170 / month",
    "features": [
      "Social media management",
      "Paid ads",
      "Content creation",
      "Email campaigns",
      "Monthly strategy call"
    ],
    "isPopular": false,
    "sortOrder": 17
  }
];

export const DEFAULT_PROJECTS: Omit<Project, "id">[] = [
  {
    "title": "Fashion Store E-commerce Website",
    "category": "websites",
    "description": "A complete online store with product catalogue, cart and secure payment gateway for a Lagos fashion brand.",
    "image": null,
    "link": null,
    "sortOrder": 0
  },
  {
    "title": "WhatsApp Booking Bot for a Salon",
    "category": "automation",
    "description": "An automated WhatsApp assistant that takes bookings, answers price questions and sends reminders.",
    "image": null,
    "link": null,
    "sortOrder": 1
  },
  {
    "title": "Restaurant Social Media Campaign",
    "category": "promotions",
    "description": "A 3-month content and paid ads campaign that grew the restaurant's orders and followers.",
    "image": null,
    "link": null,
    "sortOrder": 2
  },
  {
    "title": "Corporate Website for a Consulting Firm",
    "category": "websites",
    "description": "A professional multi-page site with service pages, case studies and a lead capture form.",
    "image": null,
    "link": null,
    "sortOrder": 3
  },
  {
    "title": "Lead Follow-Up Automation for a Real Estate Agency",
    "category": "automation",
    "description": "Automated lead capture, instant replies and a follow-up sequence that stopped enquiries going cold.",
    "image": null,
    "link": null,
    "sortOrder": 4
  },
  {
    "title": "Music Promotion Campaign for an Afrobeats Artist",
    "category": "promotions",
    "description": "Playlist pitching, stream growth and social promotion that pushed a new single to new listeners.",
    "image": null,
    "link": null,
    "sortOrder": 5
  },
  {
    "title": "Landing Page & Sales Funnel for a Coaching Business",
    "category": "websites",
    "description": "A high-converting landing page and funnel that turned ad traffic into paying clients.",
    "image": null,
    "link": null,
    "sortOrder": 6
  },
  {
    "title": "AI Customer Support Assistant for an Online Store",
    "category": "automation",
    "description": "An AI assistant handling order status, delivery and returns questions around the clock.",
    "image": null,
    "link": null,
    "sortOrder": 7
  },
  {
    "title": "Google Ads Campaign for a Local Service Business",
    "category": "promotions",
    "description": "A targeted Google Ads setup that brought in steady local enquiries at a controlled cost.",
    "image": null,
    "link": null,
    "sortOrder": 8
  }
];

export const DEFAULT_TESTIMONIALS: Omit<Testimonial, "id">[] = [
  {
    "clientName": "Adaeze O.",
    "businessName": "Bella Fashion House",
    "rating": 5,
    "reviewText": "Sholab Dex Tech built our online store and it changed everything. Orders come in every day now and the site is so easy to use. They explained everything in plain language.",
    "photo": null,
    "sortOrder": 0
  },
  {
    "clientName": "Emeka N.",
    "businessName": "Emeka & Sons Consulting",
    "rating": 5,
    "reviewText": "Our new website looks far more professional than what we had before, and we started getting enquiries within the first week. Very responsive team.",
    "photo": null,
    "sortOrder": 1
  },
  {
    "clientName": "Fatima B.",
    "businessName": "Glow Beauty Salon",
    "rating": 5,
    "reviewText": "The WhatsApp booking bot saves my staff hours every single day. Customers book themselves and we get reminders automatically. Worth every naira.",
    "photo": null,
    "sortOrder": 2
  },
  {
    "clientName": "Tunde A.",
    "businessName": "Tunde Realty",
    "rating": 4,
    "reviewText": "The lead follow-up automation means we no longer lose enquiries. Every new lead gets a reply instantly, even at night. Great work.",
    "photo": null,
    "sortOrder": 3
  },
  {
    "clientName": "Chidinma E.",
    "businessName": "Chidinma's Kitchen",
    "rating": 5,
    "reviewText": "Our social media went from quiet to busy. The content they create actually looks like our brand and the ads brought real customers, not just likes.",
    "photo": null,
    "sortOrder": 4
  },
  {
    "clientName": "David M.",
    "businessName": "Afrobeats Artist",
    "rating": 5,
    "reviewText": "They handled my single promotion from playlists to socials and my streams grew more in one month than the whole year before. Highly recommended.",
    "photo": null,
    "sortOrder": 5
  }
];

export const DEFAULT_STATS: Omit<Stat, "id">[] = [
  {
    "label": "Projects Completed",
    "value": "50+",
    "sortOrder": 0
  },
  {
    "label": "Happy Clients",
    "value": "40+",
    "sortOrder": 1
  },
  {
    "label": "Years of Experience",
    "value": "3+",
    "sortOrder": 2
  },
  {
    "label": "Support Availability",
    "value": "24/7",
    "sortOrder": 3
  }
];

export const DEFAULT_FAQS: Omit<Faq, "id">[] = [
  {
    "question": "How long does it take to build a website?",
    "answer": "A starter website usually takes 5–7 days, a business website 10–14 days, and an e-commerce store or custom web app longer depending on the features. We give you a clear timeline before we start.",
    "sortOrder": 0
  },
  {
    "question": "Do you build mobile-friendly websites?",
    "answer": "Yes. Every website we build is fully responsive, so it looks and works perfectly on phones, tablets and desktops. Most of your visitors will be on a phone, so we design for that first.",
    "sortOrder": 1
  },
  {
    "question": "What is AI automation and how can it help my business?",
    "answer": "AI automation uses artificial intelligence to handle repetitive tasks automatically — replying to customers, following up on leads, sending invoices, sorting information and more. It saves you hours every week and means customers get answers even when you are busy or asleep.",
    "sortOrder": 2
  },
  {
    "question": "How much does a website or automation cost?",
    "answer": "Our websites start from ₦80,000 (~$55) and automation from ₦60,000 (~$40). The final price depends on what you need. All prices are starting prices and are negotiable — message us on WhatsApp for a custom quote.",
    "sortOrder": 3
  },
  {
    "question": "Do you offer payment plans or deposits?",
    "answer": "Yes. We require a 50% deposit before work begins, with the balance due on completion. For larger projects we can arrange milestone payments — just ask.",
    "sortOrder": 4
  },
  {
    "question": "Can you redesign my existing website?",
    "answer": "Absolutely. We can give your current site a modern, faster, mobile-friendly new look while keeping your content and search rankings intact. Redesigns start from ₦120,000 (~$80).",
    "sortOrder": 5
  },
  {
    "question": "Do you provide support after the project is finished?",
    "answer": "Yes. Every project includes a support period after launch, and we offer ongoing maintenance and management plans if you want us to keep things running and improving.",
    "sortOrder": 6
  },
  {
    "question": "Can you promote my business on social media?",
    "answer": "Yes. We handle social media management, content creation, paid ads on Facebook, Instagram, TikTok and Google, plus music and artist promotion. Packages start from ₦70,000 (~$47) per month.",
    "sortOrder": 7
  },
  {
    "question": "Do you work with clients outside Nigeria?",
    "answer": "Yes. We work with clients anywhere in the world. Everything can be handled remotely over WhatsApp, email and video calls, and we accept international payments.",
    "sortOrder": 8
  },
  {
    "question": "How do I get started?",
    "answer": "It is simple. Tap any 'Chat on WhatsApp' button on this page, tell us your name and what you need, and we will get back to you with the next steps and a quote.",
    "sortOrder": 9
  }
];
