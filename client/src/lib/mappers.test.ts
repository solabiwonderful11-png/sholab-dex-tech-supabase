import { describe, expect, it } from "vitest";
import {
  bySortOrder,
  faqToRow,
  packageToRow,
  serviceToRow,
  settingsToRow,
  toFaq,
  toPackage,
  toService,
  toSettings,
  toStat,
  toTestimonial,
} from "./mappers";

/**
 * The mappers are the boundary between the database and the app, so they are
 * the highest-value thing to test: a mistake here shows up as blank content on
 * the live site rather than as a type error.
 */

describe("toSettings", () => {
  it("maps snake_case columns to camelCase fields", () => {
    const s = toSettings({
      company_name: "Sholab Dex Tech",
      whatsapp_number: "2348169781185",
      hero_headline: "Grow with us",
      seo_title: "Sholab",
    });

    expect(s.companyName).toBe("Sholab Dex Tech");
    expect(s.whatsappNumber).toBe("2348169781185");
    expect(s.heroHeadline).toBe("Grow with us");
    expect(s.seoTitle).toBe("Sholab");
  });

  it("falls back to defaults when the row is missing", () => {
    const s = toSettings(null);
    expect(s.companyName).toBe("Sholab Dex Tech");
    expect(s.heroCtaPrimary).toBe("Get a Free Quote");
    expect(s.socials).toEqual([]);
    expect(s.whyChooseUs).toEqual([]);
  });

  it("degrades a malformed jsonb array to an empty array instead of throwing", () => {
    const s = toSettings({ socials: "not-an-array", why_choose_us: null });
    expect(s.socials).toEqual([]);
    expect(s.whyChooseUs).toEqual([]);
  });

  it("treats an empty string image as null so the placeholder renders", () => {
    expect(toSettings({ logo: "" }).logo).toBeNull();
    expect(toSettings({ logo: "site/logo.png" }).logo).toBe("site/logo.png");
  });
});

describe("toService / toPackage", () => {
  it("maps a service row", () => {
    const s = toService({
      id: "abc",
      category: "automation",
      name: "WhatsApp chatbot",
      description: "Replies instantly",
      sort_order: 3,
    });
    expect(s).toEqual({
      id: "abc",
      category: "automation",
      name: "WhatsApp chatbot",
      description: "Replies instantly",
      icon: null,
      sortOrder: 3,
    });
  });

  it("keeps only string entries in a features array", () => {
    const p = toPackage({
      id: "p1",
      category: "websites",
      name: "Starter",
      price_ngn: "₦80,000",
      features: ["5 pages", 42, null, "Mobile ready"],
      is_popular: true,
    });
    expect(p.features).toEqual(["5 pages", "Mobile ready"]);
    expect(p.isPopular).toBe(true);
  });
});

describe("toTestimonial", () => {
  it("clamps a rating into the 1–5 range", () => {
    expect(toTestimonial({ rating: 9 }).rating).toBe(5);
    expect(toTestimonial({ rating: 0 }).rating).toBe(1);
    expect(toTestimonial({ rating: 4 }).rating).toBe(4);
  });

  it("defaults a missing rating to 5", () => {
    expect(toTestimonial({}).rating).toBe(5);
  });
});

describe("toStat / toFaq", () => {
  it("defaults a missing stat value to 0 rather than undefined", () => {
    expect(toStat({ label: "Projects" }).value).toBe("0");
  });

  it("maps an FAQ row", () => {
    expect(toFaq({ id: "f1", question: "Q?", answer: "A.", sort_order: 2 })).toEqual({
      id: "f1",
      question: "Q?",
      answer: "A.",
      sortOrder: 2,
    });
  });
});

describe("write mappers", () => {
  it("round-trips settings through the row shape", () => {
    const original = toSettings({ company_name: "Acme", whatsapp_number: "123" });
    const row = settingsToRow(original);
    expect(row.company_name).toBe("Acme");
    expect(row.whatsapp_number).toBe("123");
    expect(row.id).toBe("main");
    expect(toSettings(row).companyName).toBe("Acme");
  });

  it("never sends an id when creating a service", () => {
    const row = serviceToRow({ id: "ignored", category: "websites", name: "X", description: "", icon: null, sortOrder: 1 });
    expect(row).not.toHaveProperty("id");
    expect(row.sort_order).toBe(1);
  });

  it("maps package and faq rows for writing", () => {
    expect(packageToRow({ id: "x", category: "promotions", name: "N", priceNgn: "₦1", priceUsd: "$1", features: ["a"], isPopular: false, sortOrder: 0 })).toMatchObject({ price_ngn: "₦1", is_popular: false });
    expect(faqToRow({ id: "x", question: "Q", answer: "A", sortOrder: 4 })).toEqual({ question: "Q", answer: "A", sort_order: 4 });
  });
});

describe("bySortOrder", () => {
  it("sorts ascending by sortOrder", () => {
    const items = [{ sortOrder: 3 }, { sortOrder: 1 }, { sortOrder: 2 }];
    expect([...items].sort(bySortOrder).map((i) => i.sortOrder)).toEqual([1, 2, 3]);
  });
});
