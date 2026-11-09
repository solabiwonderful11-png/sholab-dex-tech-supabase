-- ════════════════════════════════════════════════════════════════════════════
-- Sholab Dex Tech — default content
-- ════════════════════════════════════════════════════════════════════════════
-- The content a FRESH database starts with. Run once after 0001_init.sql.
-- Existing databases are edited through /sholab, not from this file.
--
-- Safe to re-run: every insert is guarded, so it will not duplicate rows or
-- overwrite content the owner has already changed.
-- ════════════════════════════════════════════════════════════════════════════

-- ── site_settings (single row) ──────────────────────────────────────────────
insert into public.site_settings (
  id, company_name, ceo_name, ceo_title, ceo_bio,
  email, phone, whatsapp_number, business_hours, socials,
  hero_headline, hero_tagline, hero_intro, hero_cta_primary, hero_cta_secondary,
  about_heading, about_body, mission, vision, why_choose_us, process_steps,
  pricing_note, footer_description, footer_copyright, footer_credit,
  seo_title, seo_description, seo_keywords
) values (
  'main',
  'Sholab Dex Tech',
  'Natlus Niel',
  'CEO & Founder',
  'Natlus Niel leads Sholab Dex Tech with a simple belief: every business, no matter how small, deserves technology that actually works for it. He oversees every website, automation system and promotion campaign the company delivers — from the first conversation to launch and beyond.',
  'solabiwonderful09@gmail.com',
  '+2348169781185',
  '2348169781185',
  'Monday – Saturday, 8:00 AM – 8:00 PM (WAT)',
  '[{"url":"#","label":"Facebook"},{"url":"#","label":"Instagram"},{"url":"#","label":"X (Twitter)"},{"url":"#","label":"LinkedIn"},{"url":"#","label":"TikTok"}]'::jsonb,
  'Sholab Dex Tech',
  'We Build Websites, Automate Businesses, and Grow Brands.',
  'Sholab Dex Tech is a digital solutions company helping businesses get online, save time with AI automation, and reach more customers through smart promotion. From a simple business website to a full AI automation system, we handle the technology so you can focus on running your business.',
  'Get a Free Quote',
  'Chat on WhatsApp',
  'About Sholab Dex Tech',
  'Sholab Dex Tech is a digital solutions company built for businesses that want to grow without getting buried in technology. We design and build websites that convert, set up AI automation that saves hours every week, and run promotions that put your brand in front of the right people. Whether you are a startup launching your first site, a shop going online, or an established business ready to automate, we bring the web, AI and marketing together under one roof — so you have one team to call instead of three.',
  'To help businesses of every size use modern technology — great websites, smart AI automation, and effective promotion — to grow faster and work smarter.',
  'To become the go-to digital solutions partner for small and growing businesses across Nigeria and beyond.',
  '[{"title":"Affordable Pricing","description":"Real solutions at prices that make sense for small and growing businesses."},{"title":"Fast Delivery","description":"We work to clear timelines and keep you updated at every stage."},{"title":"Modern Designs","description":"Clean, professional, mobile-friendly work that makes your brand look the part."},{"title":"Real Business Results","description":"We focus on what actually moves the needle: more customers, more sales, less wasted time."},{"title":"Ongoing Support","description":"We do not disappear after launch — we stay available to help and improve."},{"title":"One Team for Everything","description":"Websites, AI automation and marketing from a single team that understands your business."}]'::jsonb,
  '[{"title":"Discovery","description":"We listen to your goals, your business and your budget."},{"title":"Planning","description":"We map out the structure, features, timeline and cost."},{"title":"Design","description":"We design the look and feel and get your approval."},{"title":"Development","description":"We build, test and refine everything."},{"title":"Launch & Support","description":"We launch your project and stay available for support."}]'::jsonb,
  'All prices are starting prices. Final quotes depend on project scope. A 50% deposit is required before work begins. Prices are negotiable — chat with us on WhatsApp for a custom quote.',
  'Websites, AI automation and business promotions — built to help your business grow.',
  '© 2026 Sholab Dex Tech. All rights reserved.',
  'Designed by Sholab Dex Tech',
  'Sholab Dex Tech | Websites, AI Automation & Business Promotions',
  'Sholab Dex Tech builds modern websites, sets up AI automation, and runs business promotions that help you get more customers and save time. Get a free quote today.',
  'website development Nigeria, AI automation, business promotion, WhatsApp chatbot, e-commerce website, social media management, Sholab Dex Tech'
)
on conflict (id) do nothing;

-- ── services ────────────────────────────────────────────────────────────────
-- Guarded on (category, name) so re-running never duplicates a service.
insert into public.services (category, name, description, sort_order)
select v.category, v.name, v.description, v.sort_order
from (values
  ('websites','Business & Corporate Websites','Professional multi-page sites that present your business clearly and convert visitors into customers.',0),
  ('websites','E-commerce / Online Stores','Sell online with a store that handles products, cart and payments smoothly.',1),
  ('websites','Landing Pages & Sales Funnels','Focused pages built for one goal: turning visitors into leads and buyers.',2),
  ('websites','Portfolio & Personal Websites','Showcase your work, skills and story with a clean personal site.',3),
  ('websites','Blog & News Websites','Publish content easily with a fast, well-structured blog or news platform.',4),
  ('websites','Website Redesign & Revamp','Give an outdated site a modern, faster, mobile-friendly new look.',5),
  ('websites','Website Maintenance & Support','Ongoing updates, fixes and monitoring so your site stays healthy.',6),
  ('websites','Domain & Hosting Setup','We register your domain, set up hosting and get everything live.',7),
  ('websites','Speed Optimization','Make your site load fast — better experience, better rankings.',8),
  ('websites','SEO Setup (On-Page)','Titles, meta tags, structure and content tuned so people can find you.',9),
  ('websites','Mobile Responsiveness','Your site looking and working perfectly on every phone and tablet.',10),
  ('websites','Website Security & Backups','Protect your site with security hardening and automatic backups.',11),
  ('websites','Payment Gateway Integration','Accept payments online with secure, trusted payment options.',12),
  ('websites','Booking & Appointment Systems','Let customers book your time automatically, without back-and-forth.',13),
  ('websites','CMS Setup (WordPress, etc.)','Manage your own content easily with a friendly content management system.',14),
  ('websites','Web App / Custom Development','Custom tools and web applications built around how your business works.',15),
  ('automation','WhatsApp Chatbot & Auto-Reply','Answer common questions instantly and capture leads 24/7 on WhatsApp.',16),
  ('automation','AI Customer Support Assistant','An AI assistant that handles routine support questions and escalates the rest.',17),
  ('automation','Lead Capture & Follow-Up Automation','Never lose a lead again — automatic capture and follow-up sequences.',18),
  ('automation','Email Marketing Automation','Welcome, nurture and re-engage customers with automated email flows.',19),
  ('automation','Social Media Content Automation','Plan, schedule and publish content without doing it all by hand.',20),
  ('automation','AI Content Writing','Captions, blogs and ad copy drafted by AI and polished for your brand.',21),
  ('automation','Invoice & Receipt Automation','Generate and send invoices and receipts automatically.',22),
  ('automation','Appointment Booking Automation','Automated scheduling, reminders and confirmations for your bookings.',23),
  ('automation','CRM Setup & Automation','Keep every customer, deal and follow-up organised in one place.',24),
  ('automation','Data Entry & Document Processing','Turn documents and forms into clean, usable data automatically.',25),
  ('automation','AI Voice Notes / Transcription','Convert voice notes and calls into searchable text automatically.',26),
  ('automation','Workflow Automation Between Apps','Connect your tools so data flows between them without manual work.',27),
  ('automation','AI Sales Funnel Automation','Automated funnels that nurture leads and move them toward buying.',28),
  ('automation','Reporting & Analytics Dashboards','See your numbers clearly with automated reports and dashboards.',29),
  ('automation','AI Training & Consultation','We train your team to use AI tools confidently in daily work.',30),
  ('promotions','Social Media Management','We plan, create and post content that keeps your brand active and visible.',31),
  ('promotions','Social Media Advertising','Targeted Facebook, Instagram and TikTok ads that reach real buyers.',32),
  ('promotions','Google Ads Setup & Management','Appear when people search for what you sell, and manage the spend wisely.',33),
  ('promotions','Brand Identity & Logo Design','A memorable logo and consistent brand look across everything you do.',34),
  ('promotions','Flyer, Banner & Poster Design','Eye-catching designs for print and digital promotion.',35),
  ('promotions','Product Photography & Video Ads','Show your products at their best with photos and short video ads.',36),
  ('promotions','Content Strategy & Calendar','A clear plan of what to post, when, and why — mapped to your goals.',37),
  ('promotions','Influencer & Artist Promotion','Get your brand or music in front of engaged, relevant audiences.',38),
  ('promotions','Music Promotion','Streams, playlist placements and airplay to grow your music''s reach.',39),
  ('promotions','Email & SMS Marketing Campaigns','Direct campaigns that bring customers back and drive repeat sales.',40),
  ('promotions','SEO & Local Business Listing','Get found online and in local searches in your area.',41),
  ('promotions','Google Business Profile Setup','A complete, optimised Google profile so local customers find you first.',42),
  ('promotions','Business Consulting & Growth Strategy','Practical advice on how to grow, price and position your business.',43),
  ('promotions','Copywriting & Sales Copy','Words that sell — for your site, ads, emails and social posts.',44),
  ('promotions','Event & Launch Promotion','Build buzz and fill seats for your next event or product launch.',45)
) as v(category, name, description, sort_order)
where not exists (
  select 1 from public.services s where s.category = v.category and s.name = v.name
);

-- ── pricing_packages ────────────────────────────────────────────────────────
insert into public.pricing_packages (category, name, price_ngn, price_usd, features, is_popular, sort_order)
select v.category, v.name, v.price_ngn, v.price_usd, v.features::jsonb, v.is_popular, v.sort_order
from (values
  ('websites','Starter Website','₦80,000','~$55','["3–5 pages","Mobile-friendly design","Contact form","Basic on-page SEO","Delivery in 5–7 days"]',false,0),
  ('websites','Business Website','₦180,000','~$120','["6–10 pages","Custom design","SEO setup","Contact forms","Google Analytics","Delivery in 10–14 days"]',true,1),
  ('websites','E-commerce Store','₦350,000','~$230','["Product catalogue","Shopping cart","Payment gateway","Order management","Customer accounts"]',false,2),
  ('websites','Custom Web App','from ₦600,000','~$400','["Custom features","Database & dashboards","User roles","API integrations","Ongoing support"]',false,3),
  ('websites','Website Maintenance','₦25,000','~$17 / month','["Monthly updates","Security checks","Backups","Uptime monitoring","Priority support"]',false,4),
  ('websites','Website Redesign','from ₦120,000','~$80','["Modern new look","Speed improvements","Mobile optimisation","Content migration","SEO preserved"]',false,5),
  ('automation','Starter Automation','₦60,000','~$40','["1 chatbot or 1 workflow","Setup & testing","Basic training","30 days support"]',false,6),
  ('automation','Business Automation Package','₦200,000','~$135','["WhatsApp chatbot","Lead follow-up automation","Email automation","CRM setup","Team training"]',true,7),
  ('automation','Full AI Automation System','from ₦450,000','~$300','["Multiple workflows","CRM & dashboards","AI support assistant","Reporting automation","Full team training"]',false,8),
  ('automation','Monthly Automation Management','₦40,000','~$27 / month','["Monitoring & fixes","Workflow updates","Performance reports","Priority support"]',false,9),
  ('automation','AI Consultation / Training','₦30,000','~$20 / session','["1-on-1 session","Tool recommendations","Hands-on practice","Follow-up notes"]',false,10),
  ('promotions','Social Media Management (1 platform)','₦70,000','~$47 / month','["1 platform","12 posts per month","Content design","Caption writing","Monthly report"]',false,11),
  ('promotions','Social Media Management (3 platforms)','₦150,000','~$100 / month','["3 platforms","20 posts per month","Ad management","Content strategy","Monthly report"]',true,12),
  ('promotions','Logo & Brand Identity','₦50,000','~$33','["Logo design","Colour palette","Typography","Brand guidelines","File pack"]',false,13),
  ('promotions','Flyer / Poster Design','₦10,000','~$7 each','["Custom design","Print-ready files","2 revisions","Fast turnaround"]',false,14),
  ('promotions','Paid Ads Management','from ₦80,000','~$55 / month','["Campaign setup","Audience targeting","Ad creative","Optimisation","Reporting"]',false,15),
  ('promotions','Music Promotion Package','from ₦100,000','~$67','["Playlist pitching","Stream growth","Social promotion","Airplay outreach","Performance report"]',false,16),
  ('promotions','Full Business Promotion Package','from ₦250,000','~$170 / month','["Social media management","Paid ads","Content creation","Email campaigns","Monthly strategy call"]',false,17)
) as v(category, name, price_ngn, price_usd, features, is_popular, sort_order)
where not exists (
  select 1 from public.pricing_packages p where p.category = v.category and p.name = v.name
);

-- ── projects ────────────────────────────────────────────────────────────────
insert into public.projects (title, category, description, sort_order)
select v.title, v.category, v.description, v.sort_order
from (values
  ('Fashion Store E-commerce Website','websites','A complete online store with product catalogue, cart and secure payment gateway for a Lagos fashion brand.',0),
  ('WhatsApp Booking Bot for a Salon','automation','An automated WhatsApp assistant that takes bookings, answers price questions and sends reminders.',1),
  ('Restaurant Social Media Campaign','promotions','A 3-month content and paid ads campaign that grew the restaurant''s orders and followers.',2),
  ('Corporate Website for a Consulting Firm','websites','A professional multi-page site with service pages, case studies and a lead capture form.',3),
  ('Lead Follow-Up Automation for a Real Estate Agency','automation','Automated lead capture, instant replies and a follow-up sequence that stopped enquiries going cold.',4),
  ('Music Promotion Campaign for an Afrobeats Artist','promotions','Playlist pitching, stream growth and social promotion that pushed a new single to new listeners.',5),
  ('Landing Page & Sales Funnel for a Coaching Business','websites','A high-converting landing page and funnel that turned ad traffic into paying clients.',6),
  ('AI Customer Support Assistant for an Online Store','automation','An AI assistant handling order status, delivery and returns questions around the clock.',7),
  ('Google Ads Campaign for a Local Service Business','promotions','A targeted Google Ads setup that brought in steady local enquiries at a controlled cost.',8)
) as v(title, category, description, sort_order)
where not exists (
  select 1 from public.projects p where p.title = v.title
);

-- ── testimonials ────────────────────────────────────────────────────────────
insert into public.testimonials (client_name, business_name, rating, review_text, sort_order)
select v.client_name, v.business_name, v.rating, v.review_text, v.sort_order
from (values
  ('Adaeze O.','Bella Fashion House',5,'Sholab Dex Tech built our online store and it changed everything. Orders come in every day now and the site is so easy to use. They explained everything in plain language.',0),
  ('Emeka N.','Emeka & Sons Consulting',5,'Our new website looks far more professional than what we had before, and we started getting enquiries within the first week. Very responsive team.',1),
  ('Fatima B.','Glow Beauty Salon',5,'The WhatsApp booking bot saves my staff hours every single day. Customers book themselves and we get reminders automatically. Worth every naira.',2),
  ('Tunde A.','Tunde Realty',4,'The lead follow-up automation means we no longer lose enquiries. Every new lead gets a reply instantly, even at night. Great work.',3),
  ('Chidinma E.','Chidinma''s Kitchen',5,'Our social media went from quiet to busy. The content they create actually looks like our brand and the ads brought real customers, not just likes.',4),
  ('David M.','Afrobeats Artist',5,'They handled my single promotion from playlists to socials and my streams grew more in one month than the whole year before. Highly recommended.',5)
) as v(client_name, business_name, rating, review_text, sort_order)
where not exists (
  select 1 from public.testimonials t where t.client_name = v.client_name and t.business_name = v.business_name
);

-- ── stats ───────────────────────────────────────────────────────────────────
insert into public.stats (label, value, sort_order)
select v.label, v.value, v.sort_order
from (values
  ('Projects Completed','50+',0),
  ('Happy Clients','40+',1),
  ('Years of Experience','3+',2),
  ('Support Availability','24/7',3)
) as v(label, value, sort_order)
where not exists (
  select 1 from public.stats s where s.label = v.label
);

-- ── faqs ────────────────────────────────────────────────────────────────────
insert into public.faqs (question, answer, sort_order)
select v.question, v.answer, v.sort_order
from (values
  ('How long does it take to build a website?','A starter website usually takes 5–7 days, a business website 10–14 days, and an e-commerce store or custom web app longer depending on the features. We give you a clear timeline before we start.',0),
  ('Do you build mobile-friendly websites?','Yes. Every website we build is fully responsive, so it looks and works perfectly on phones, tablets and desktops. Most of your visitors will be on a phone, so we design for that first.',1),
  ('What is AI automation and how can it help my business?','AI automation uses artificial intelligence to handle repetitive tasks automatically — replying to customers, following up on leads, sending invoices, sorting information and more. It saves you hours every week and means customers get answers even when you are busy or asleep.',2),
  ('How much does a website or automation cost?','Our websites start from ₦80,000 (~$55) and automation from ₦60,000 (~$40). The final price depends on what you need. All prices are starting prices and are negotiable — message us on WhatsApp for a custom quote.',3),
  ('Do you offer payment plans or deposits?','Yes. We require a 50% deposit before work begins, with the balance due on completion. For larger projects we can arrange milestone payments — just ask.',4),
  ('Can you redesign my existing website?','Absolutely. We can give your current site a modern, faster, mobile-friendly new look while keeping your content and search rankings intact. Redesigns start from ₦120,000 (~$80).',5),
  ('Do you provide support after the project is finished?','Yes. Every project includes a support period after launch, and we offer ongoing maintenance and management plans if you want us to keep things running and improving.',6),
  ('Can you promote my business on social media?','Yes. We handle social media management, content creation, paid ads on Facebook, Instagram, TikTok and Google, plus music and artist promotion. Packages start from ₦70,000 (~$47) per month.',7),
  ('Do you work with clients outside Nigeria?','Yes. We work with clients anywhere in the world. Everything can be handled remotely over WhatsApp, email and video calls, and we accept international payments.',8),
  ('How do I get started?','It is simple. Tap any ''Chat on WhatsApp'' button on this page, tell us your name and what you need, and we will get back to you with the next steps and a quote.',9)
) as v(question, answer, sort_order)
where not exists (
  select 1 from public.faqs f where f.question = v.question
);
