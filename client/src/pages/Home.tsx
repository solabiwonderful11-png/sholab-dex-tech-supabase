import { useEffect } from "react";
import type { SiteContent } from "@shared/types";
import { applySiteSeo } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Pricing } from "@/components/site/Pricing";
import { About } from "@/components/site/About";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { QuotePopup } from "@/components/site/QuotePopup";
import { QuoteProvider } from "@/hooks/useQuote";

/**
 * The public site.
 *
 * Section order is deliberate: the hero states the offer, services and work
 * prove it, pricing removes the biggest objection, and only then does the page
 * ask for anything. Contact sits last, after the visitor has had every chance
 * to be convinced.
 *
 * Everything is wrapped in QuoteProvider so any WhatsApp button anywhere in the
 * tree can open the quote popup with its own pre-selection — the mechanism the
 * brief's Section 4 depends on.
 */
export function Home({ content }: { content: SiteContent }) {
  const { settings } = content;

  // Keep the document title, meta description, Open Graph tags and favicon in
  // sync with the CMS, so an edit in /sholab is reflected without a redeploy.
  useEffect(() => {
    applySiteSeo(settings);
  }, [settings]);

  return (
    <QuoteProvider>
      {/* Skip link — the first thing a keyboard user reaches. */}
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Nav settings={settings} />

      <main>
        <Hero settings={settings} stats={content.stats} />
        <Services services={content.services} />
        <Portfolio projects={content.projects} />
        <Pricing packages={content.packages} settings={settings} />
        <About settings={settings} />
        <Process settings={settings} />
        <Testimonials testimonials={content.testimonials} />
        <Faq faqs={content.faqs} />
        <Contact settings={settings} services={content.services} />
      </main>

      <Footer settings={settings} services={content.services} />

      <FloatingWhatsApp />
      <QuotePopup
        settings={settings}
        services={content.services}
        packages={content.packages}
      />
    </QuoteProvider>
  );
}
