import { useEffect } from "react";
import type { SiteContent } from "@shared/types";
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

/**
 * The public site.
 *
 * Section order is deliberate: the hero states the offer, services and work
 * prove it, pricing removes the biggest objection, and only then does the page
 * ask for anything. Contact sits last, after the visitor has had every chance
 * to be convinced.
 */
export function Home({ content }: { content: SiteContent }) {
  const { settings } = content;

  // Keep the document title and meta description in sync with the CMS, so an
  // edit in /sholab is reflected in the tab and in search results.
  useEffect(() => {
    if (settings.seoTitle) document.title = settings.seoTitle;

    const setMeta = (name: string, value: string) => {
      if (!value) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = value;
    };

    setMeta("description", settings.seoDescription);
    setMeta("keywords", settings.seoKeywords);
  }, [settings.seoTitle, settings.seoDescription, settings.seoKeywords]);

  return (
    <>
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
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} services={content.services} />

      <FloatingWhatsApp settings={settings} />
      <QuotePopup settings={settings} packages={content.packages} />
    </>
  );
}
