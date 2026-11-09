#!/usr/bin/env python3
"""
Seed the Sholab Dex Tech Supabase database over the REST API.

This is the same content as supabase/seed.sql, but pushed through PostgREST
instead of the SQL editor. It is the script the project ships so a fresh
Supabase project can be filled from a terminal:

    SUPABASE_URL=https://<ref>.supabase.co \
    SUPABASE_KEY=<publishable-or-anon-key> \
    python3 scripts/seed.py

Every insert is idempotent: rows are matched on their natural key first, so
running it twice does not duplicate anything and never overwrites content the
owner has already edited in /sholab.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
KEY = os.environ.get("SUPABASE_KEY", "")

if not URL or not KEY:
    sys.exit("Set SUPABASE_URL and SUPABASE_KEY first.")

HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}


def request(method: str, path: str, body=None, prefer: str | None = None):
    headers = dict(HEADERS)
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{URL}/rest/v1/{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw.strip() else None
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()
        raise SystemExit(f"{method} {path} -> {exc.code}\n{detail}") from exc


def existing(table: str, select: str) -> list[dict]:
    return request("GET", f"{table}?select={select}") or []


def insert_missing(table: str, rows: list[dict], key_fields: list[str]) -> int:
    """Insert only the rows whose natural key is not already present."""
    have = {
        tuple(str(r.get(f, "")) for f in key_fields)
        for r in existing(table, ",".join(key_fields))
    }
    fresh = [r for r in rows if tuple(str(r.get(f, "")) for f in key_fields) not in have]
    if not fresh:
        print(f"  {table}: nothing to add ({len(rows)} already present)")
        return 0
    request("POST", table, fresh)
    print(f"  {table}: inserted {len(fresh)}")
    return len(fresh)


# ── Content ─────────────────────────────────────────────────────────────────

SETTINGS = {
    "id": "main",
    "company_name": "Sholab Dex Tech",
    "ceo_name": "Natlus Niel",
    "ceo_title": "CEO & Founder",
    "ceo_bio": (
        "Natlus Niel leads Sholab Dex Tech with a simple belief: every business, no matter how "
        "small, deserves technology that actually works for it. He oversees every website, "
        "automation system and promotion campaign the company delivers — from the first "
        "conversation to launch and beyond."
    ),
    "email": "solabiwonderful09@gmail.com",
    "phone": "+2348169781185",
    "whatsapp_number": "2348169781185",
    "business_hours": "Monday – Saturday, 8:00 AM – 8:00 PM (WAT)",
    "socials": [
        {"url": "#", "label": "Facebook"},
        {"url": "#", "label": "Instagram"},
        {"url": "#", "label": "X (Twitter)"},
        {"url": "#", "label": "LinkedIn"},
        {"url": "#", "label": "TikTok"},
    ],
    "hero_headline": "Sholab Dex Tech",
    "hero_tagline": "We Build Websites, Automate Businesses, and Grow Brands.",
    "hero_intro": (
        "Sholab Dex Tech is a digital solutions company helping businesses get online, save time "
        "with AI automation, and reach more customers through smart promotion. From a simple "
        "business website to a full AI automation system, we handle the technology so you can "
        "focus on running your business."
    ),
    "hero_cta_primary": "Get a Free Quote",
    "hero_cta_secondary": "Chat on WhatsApp",
    "about_heading": "About Sholab Dex Tech",
    "about_body": (
        "Sholab Dex Tech is a digital solutions company built for businesses that want to grow "
        "without getting buried in technology. We design and build websites that convert, set up "
        "AI automation that saves hours every week, and run promotions that put your brand in "
        "front of the right people. Whether you are a startup launching your first site, a shop "
        "going online, or an established business ready to automate, we bring the web, AI and "
        "marketing together under one roof — so you have one team to call instead of three."
    ),
    "mission": (
        "To help businesses of every size use modern technology — great websites, smart AI "
        "automation, and effective promotion — to grow faster and work smarter."
    ),
    "vision": (
        "To become the go-to digital solutions partner for small and growing businesses across "
        "Nigeria and beyond."
    ),
    "why_choose_us": [
        {"title": "Affordable Pricing", "description": "Real solutions at prices that make sense for small and growing businesses."},
        {"title": "Fast Delivery", "description": "We work to clear timelines and keep you updated at every stage."},
        {"title": "Modern Designs", "description": "Clean, professional, mobile-friendly work that makes your brand look the part."},
        {"title": "Real Business Results", "description": "We focus on what actually moves the needle: more customers, more sales, less wasted time."},
        {"title": "Ongoing Support", "description": "We do not disappear after launch — we stay available to help and improve."},
        {"title": "One Team for Everything", "description": "Websites, AI automation and marketing from a single team that understands your business."},
    ],
    "process_steps": [
        {"title": "Discovery", "description": "We listen to your goals, your business and your budget."},
        {"title": "Planning", "description": "We map out the structure, features, timeline and cost."},
        {"title": "Design", "description": "We design the look and feel and get your approval."},
        {"title": "Development", "description": "We build, test and refine everything."},
        {"title": "Launch & Support", "description": "We launch your project and stay available for support."},
    ],
    "pricing_note": (
        "All prices are starting prices. Final quotes depend on project scope. A 50% deposit is "
        "required before work begins. Prices are negotiable — chat with us on WhatsApp for a "
        "custom quote."
    ),
    "footer_description": "Websites, AI automation and business promotions — built to help your business grow.",
    "footer_copyright": "© 2026 Sholab Dex Tech. All rights reserved.",
    "footer_credit": "Designed by Sholab Dex Tech",
    "seo_title": "Sholab Dex Tech | Websites, AI Automation & Business Promotions",
    "seo_description": (
        "Sholab Dex Tech builds modern websites, sets up AI automation, and runs business "
        "promotions that help you get more customers and save time. Get a free quote today."
    ),
    "seo_keywords": (
        "website development Nigeria, AI automation, business promotion, WhatsApp chatbot, "
        "e-commerce website, social media management, Sholab Dex Tech"
    ),
}

SERVICES = [
    ("websites", "Business & Corporate Websites", "Professional multi-page sites that present your business clearly and convert visitors into customers.", 0),
    ("websites", "E-commerce / Online Stores", "Sell online with a store that handles products, cart and payments smoothly.", 1),
    ("websites", "Landing Pages & Sales Funnels", "Focused pages built for one goal: turning visitors into leads and buyers.", 2),
    ("websites", "Portfolio & Personal Websites", "Showcase your work, skills and story with a clean personal site.", 3),
    ("websites", "Blog & News Websites", "Publish content easily with a fast, well-structured blog or news platform.", 4),
    ("websites", "Website Redesign & Revamp", "Give an outdated site a modern, faster, mobile-friendly new look.", 5),
    ("websites", "Website Maintenance & Support", "Ongoing updates, fixes and monitoring so your site stays healthy.", 6),
    ("websites", "Domain & Hosting Setup", "We register your domain, set up hosting and get everything live.", 7),
    ("websites", "Speed Optimization", "Make your site load fast — better experience, better rankings.", 8),
    ("websites", "SEO Setup (On-Page)", "Titles, meta tags, structure and content tuned so people can find you.", 9),
    ("websites", "Mobile Responsiveness", "Your site looking and working perfectly on every phone and tablet.", 10),
    ("websites", "Website Security & Backups", "Protect your site with security hardening and automatic backups.", 11),
    ("websites", "Payment Gateway Integration", "Accept payments online with secure, trusted payment options.", 12),
    ("websites", "Booking & Appointment Systems", "Let customers book your time automatically, without back-and-forth.", 13),
    ("websites", "CMS Setup (WordPress, etc.)", "Manage your own content easily with a friendly content management system.", 14),
    ("websites", "Web App / Custom Development", "Custom tools and web applications built around how your business works.", 15),
    ("automation", "WhatsApp Chatbot & Auto-Reply", "Answer common questions instantly and capture leads 24/7 on WhatsApp.", 16),
    ("automation", "AI Customer Support Assistant", "An AI assistant that handles routine support questions and escalates the rest.", 17),
    ("automation", "Lead Capture & Follow-Up Automation", "Never lose a lead again — automatic capture and follow-up sequences.", 18),
    ("automation", "Email Marketing Automation", "Welcome, nurture and re-engage customers with automated email flows.", 19),
    ("automation", "Social Media Content Automation", "Plan, schedule and publish content without doing it all by hand.", 20),
    ("automation", "AI Content Writing", "Captions, blogs and ad copy drafted by AI and polished for your brand.", 21),
    ("automation", "Invoice & Receipt Automation", "Generate and send invoices and receipts automatically.", 22),
    ("automation", "Appointment Booking Automation", "Automated scheduling, reminders and confirmations for your bookings.", 23),
    ("automation", "CRM Setup & Automation", "Keep every customer, deal and follow-up organised in one place.", 24),
    ("automation", "Data Entry & Document Processing", "Turn documents and forms into clean, usable data automatically.", 25),
    ("automation", "AI Voice Notes / Transcription", "Convert voice notes and calls into searchable text automatically.", 26),
    ("automation", "Workflow Automation Between Apps", "Connect your tools so data flows between them without manual work.", 27),
    ("automation", "AI Sales Funnel Automation", "Automated funnels that nurture leads and move them toward buying.", 28),
    ("automation", "Reporting & Analytics Dashboards", "See your numbers clearly with automated reports and dashboards.", 29),
    ("automation", "AI Training & Consultation", "We train your team to use AI tools confidently in daily work.", 30),
    ("promotions", "Social Media Management", "We plan, create and post content that keeps your brand active and visible.", 31),
    ("promotions", "Social Media Advertising", "Targeted Facebook, Instagram and TikTok ads that reach real buyers.", 32),
    ("promotions", "Google Ads Setup & Management", "Appear when people search for what you sell, and manage the spend wisely.", 33),
    ("promotions", "Brand Identity & Logo Design", "A memorable logo and consistent brand look across everything you do.", 34),
    ("promotions", "Flyer, Banner & Poster Design", "Eye-catching designs for print and digital promotion.", 35),
    ("promotions", "Product Photography & Video Ads", "Show your products at their best with photos and short video ads.", 36),
    ("promotions", "Content Strategy & Calendar", "A clear plan of what to post, when, and why — mapped to your goals.", 37),
    ("promotions", "Influencer & Artist Promotion", "Get your brand or music in front of engaged, relevant audiences.", 38),
    ("promotions", "Music Promotion", "Streams, playlist placements and airplay to grow your music's reach.", 39),
    ("promotions", "Email & SMS Marketing Campaigns", "Direct campaigns that bring customers back and drive repeat sales.", 40),
    ("promotions", "SEO & Local Business Listing", "Get found online and in local searches in your area.", 41),
    ("promotions", "Google Business Profile Setup", "A complete, optimised Google profile so local customers find you first.", 42),
    ("promotions", "Business Consulting & Growth Strategy", "Practical advice on how to grow, price and position your business.", 43),
    ("promotions", "Copywriting & Sales Copy", "Words that sell — for your site, ads, emails and social posts.", 44),
    ("promotions", "Event & Launch Promotion", "Build buzz and fill seats for your next event or product launch.", 45),
]

PACKAGES = [
    ("websites", "Starter Website", "₦80,000", "~$55", ["3–5 pages", "Mobile-friendly design", "Contact form", "Basic on-page SEO", "Delivery in 5–7 days"], False, 0),
    ("websites", "Business Website", "₦180,000", "~$120", ["6–10 pages", "Custom design", "SEO setup", "Contact forms", "Google Analytics", "Delivery in 10–14 days"], True, 1),
    ("websites", "E-commerce Store", "₦350,000", "~$230", ["Product catalogue", "Shopping cart", "Payment gateway", "Order management", "Customer accounts"], False, 2),
    ("websites", "Custom Web App", "from ₦600,000", "~$400", ["Custom features", "Database & dashboards", "User roles", "API integrations", "Ongoing support"], False, 3),
    ("websites", "Website Maintenance", "₦25,000", "~$17 / month", ["Monthly updates", "Security checks", "Backups", "Uptime monitoring", "Priority support"], False, 4),
    ("websites", "Website Redesign", "from ₦120,000", "~$80", ["Modern new look", "Speed improvements", "Mobile optimisation", "Content migration", "SEO preserved"], False, 5),
    ("automation", "Starter Automation", "₦60,000", "~$40", ["1 chatbot or 1 workflow", "Setup & testing", "Basic training", "30 days support"], False, 6),
    ("automation", "Business Automation Package", "₦200,000", "~$135", ["WhatsApp chatbot", "Lead follow-up automation", "Email automation", "CRM setup", "Team training"], True, 7),
    ("automation", "Full AI Automation System", "from ₦450,000", "~$300", ["Multiple workflows", "CRM & dashboards", "AI support assistant", "Reporting automation", "Full team training"], False, 8),
    ("automation", "Monthly Automation Management", "₦40,000", "~$27 / month", ["Monitoring & fixes", "Workflow updates", "Performance reports", "Priority support"], False, 9),
    ("automation", "AI Consultation / Training", "₦30,000", "~$20 / session", ["1-on-1 session", "Tool recommendations", "Hands-on practice", "Follow-up notes"], False, 10),
    ("promotions", "Social Media Management (1 platform)", "₦70,000", "~$47 / month", ["1 platform", "12 posts per month", "Content design", "Caption writing", "Monthly report"], False, 11),
    ("promotions", "Social Media Management (3 platforms)", "₦150,000", "~$100 / month", ["3 platforms", "20 posts per month", "Ad management", "Content strategy", "Monthly report"], True, 12),
    ("promotions", "Logo & Brand Identity", "₦50,000", "~$33", ["Logo design", "Colour palette", "Typography", "Brand guidelines", "File pack"], False, 13),
    ("promotions", "Flyer / Poster Design", "₦10,000", "~$7 each", ["Custom design", "Print-ready files", "2 revisions", "Fast turnaround"], False, 14),
    ("promotions", "Paid Ads Management", "from ₦80,000", "~$55 / month", ["Campaign setup", "Audience targeting", "Ad creative", "Optimisation", "Reporting"], False, 15),
    ("promotions", "Music Promotion Package", "from ₦100,000", "~$67", ["Playlist pitching", "Stream growth", "Social promotion", "Airplay outreach", "Performance report"], False, 16),
    ("promotions", "Full Business Promotion Package", "from ₦250,000", "~$170 / month", ["Social media management", "Paid ads", "Content creation", "Email campaigns", "Monthly strategy call"], False, 17),
]

PROJECTS = [
    ("Fashion Store E-commerce Website", "websites", "A complete online store with product catalogue, cart and secure payment gateway for a Lagos fashion brand.", 0),
    ("WhatsApp Booking Bot for a Salon", "automation", "An automated WhatsApp assistant that takes bookings, answers price questions and sends reminders.", 1),
    ("Restaurant Social Media Campaign", "promotions", "A 3-month content and paid ads campaign that grew the restaurant's orders and followers.", 2),
    ("Corporate Website for a Consulting Firm", "websites", "A professional multi-page site with service pages, case studies and a lead capture form.", 3),
    ("Lead Follow-Up Automation for a Real Estate Agency", "automation", "Automated lead capture, instant replies and a follow-up sequence that stopped enquiries going cold.", 4),
    ("Music Promotion Campaign for an Afrobeats Artist", "promotions", "Playlist pitching, stream growth and social promotion that pushed a new single to new listeners.", 5),
    ("Landing Page & Sales Funnel for a Coaching Business", "websites", "A high-converting landing page and funnel that turned ad traffic into paying clients.", 6),
    ("AI Customer Support Assistant for an Online Store", "automation", "An AI assistant handling order status, delivery and returns questions around the clock.", 7),
    ("Google Ads Campaign for a Local Service Business", "promotions", "A targeted Google Ads setup that brought in steady local enquiries at a controlled cost.", 8),
]

TESTIMONIALS = [
    ("Adaeze O.", "Bella Fashion House", 5, "Sholab Dex Tech built our online store and it changed everything. Orders come in every day now and the site is so easy to use. They explained everything in plain language.", 0),
    ("Emeka N.", "Emeka & Sons Consulting", 5, "Our new website looks far more professional than what we had before, and we started getting enquiries within the first week. Very responsive team.", 1),
    ("Fatima B.", "Glow Beauty Salon", 5, "The WhatsApp booking bot saves my staff hours every single day. Customers book themselves and we get reminders automatically. Worth every naira.", 2),
    ("Tunde A.", "Tunde Realty", 4, "The lead follow-up automation means we no longer lose enquiries. Every new lead gets a reply instantly, even at night. Great work.", 3),
    ("Chidinma E.", "Chidinma's Kitchen", 5, "Our social media went from quiet to busy. The content they create actually looks like our brand and the ads brought real customers, not just likes.", 4),
    ("David M.", "Afrobeats Artist", 5, "They handled my single promotion from playlists to socials and my streams grew more in one month than the whole year before. Highly recommended.", 5),
]

STATS = [
    ("Projects Completed", "50+", 0),
    ("Happy Clients", "40+", 1),
    ("Years of Experience", "3+", 2),
    ("Support Availability", "24/7", 3),
]

FAQS = [
    ("How long does it take to build a website?", "A starter website usually takes 5–7 days, a business website 10–14 days, and an e-commerce store or custom web app longer depending on the features. We give you a clear timeline before we start.", 0),
    ("Do you build mobile-friendly websites?", "Yes. Every website we build is fully responsive, so it looks and works perfectly on phones, tablets and desktops. Most of your visitors will be on a phone, so we design for that first.", 1),
    ("What is AI automation and how can it help my business?", "AI automation uses artificial intelligence to handle repetitive tasks automatically — replying to customers, following up on leads, sending invoices, sorting information and more. It saves you hours every week and means customers get answers even when you are busy or asleep.", 2),
    ("How much does a website or automation cost?", "Our websites start from ₦80,000 (~$55) and automation from ₦60,000 (~$40). The final price depends on what you need. All prices are starting prices and are negotiable — message us on WhatsApp for a custom quote.", 3),
    ("Do you offer payment plans or deposits?", "Yes. We require a 50% deposit before work begins, with the balance due on completion. For larger projects we can arrange milestone payments — just ask.", 4),
    ("Can you redesign my existing website?", "Absolutely. We can give your current site a modern, faster, mobile-friendly new look while keeping your content and search rankings intact. Redesigns start from ₦120,000 (~$80).", 5),
    ("Do you provide support after the project is finished?", "Yes. Every project includes a support period after launch, and we offer ongoing maintenance and management plans if you want us to keep things running and improving.", 6),
    ("Can you promote my business on social media?", "Yes. We handle social media management, content creation, paid ads on Facebook, Instagram, TikTok and Google, plus music and artist promotion. Packages start from ₦70,000 (~$47) per month.", 7),
    ("Do you work with clients outside Nigeria?", "Yes. We work with clients anywhere in the world. Everything can be handled remotely over WhatsApp, email and video calls, and we accept international payments.", 8),
    ("How do I get started?", "It is simple. Tap any 'Chat on WhatsApp' button on this page, tell us your name and what you need, and we will get back to you with the next steps and a quote.", 9),
]


def main() -> None:
    print(f"Seeding {URL}")

    # site_settings is a single row keyed on id.
    if not existing("site_settings", "id"):
        request("POST", "site_settings", SETTINGS)
        print("  site_settings: inserted 1")
    else:
        print("  site_settings: already present")

    insert_missing(
        "services",
        [{"category": c, "name": n, "description": d, "sort_order": o} for c, n, d, o in SERVICES],
        ["category", "name"],
    )
    insert_missing(
        "pricing_packages",
        [
            {
                "category": c, "name": n, "price_ngn": ng, "price_usd": usd,
                "features": f, "is_popular": pop, "sort_order": o,
            }
            for c, n, ng, usd, f, pop, o in PACKAGES
        ],
        ["category", "name"],
    )
    insert_missing(
        "projects",
        [{"title": t, "category": c, "description": d, "sort_order": o} for t, c, d, o in PROJECTS],
        ["title"],
    )
    insert_missing(
        "testimonials",
        [
            {"client_name": cn, "business_name": bn, "rating": r, "review_text": rt, "sort_order": o}
            for cn, bn, r, rt, o in TESTIMONIALS
        ],
        ["client_name", "business_name"],
    )
    insert_missing(
        "stats",
        [{"label": l, "value": v, "sort_order": o} for l, v, o in STATS],
        ["label"],
    )
    insert_missing(
        "faqs",
        [{"question": q, "answer": a, "sort_order": o} for q, a, o in FAQS],
        ["question"],
    )

    print("Done.")


if __name__ == "__main__":
    main()
