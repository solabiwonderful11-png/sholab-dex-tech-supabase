import { describe, expect, it } from "vitest";
import { buildQuoteMessage, packageLabel, serviceLabel } from "./quote";
import type { PricingPackage, Service } from "@shared/types";

/**
 * The WhatsApp message format is specified word for word in the brief (4.2),
 * and it is the one thing on the site the owner reads on every enquiry. These
 * tests pin the exact wording so a future refactor cannot quietly change it.
 */

const COMPANY = "Sholab Dex Tech";

describe("buildQuoteMessage", () => {
  it("produces the exact format the brief specifies", () => {
    expect(
      buildQuoteMessage(COMPANY, {
        name: "John",
        service: "Website Development",
        packageLabel: "Business Website (₦180,000 / ~$120)",
      }),
    ).toBe(
      "Hi Sholab Dex Tech, my name is John. I am interested in Website Development - Business Website (₦180,000 / ~$120). Please send me more details and a quote.",
    );
  });

  it("drops the name clause when the visitor skips the name", () => {
    expect(
      buildQuoteMessage(COMPANY, {
        service: "AI Automation",
        packageLabel: "Starter Automation (₦60,000 / ~$40)",
      }),
    ).toBe(
      "Hi Sholab Dex Tech, I am interested in AI Automation - Starter Automation (₦60,000 / ~$40). Please send me more details and a quote.",
    );
  });

  it("treats a whitespace-only name as no name", () => {
    const message = buildQuoteMessage(COMPANY, { name: "   ", service: "Websites" });
    expect(message).not.toContain("my name is");
    expect(message).toContain("Hi Sholab Dex Tech, I am interested in Websites.");
  });

  it("omits the package clause when only a service is chosen", () => {
    expect(buildQuoteMessage(COMPANY, { name: "Ada", service: "SEO Setup" })).toBe(
      "Hi Sholab Dex Tech, my name is Ada. I am interested in SEO Setup. Please send me more details and a quote.",
    );
  });

  it("falls back to a generic interest when nothing is chosen", () => {
    expect(buildQuoteMessage(COMPANY, { name: "Ada" })).toBe(
      "Hi Sholab Dex Tech, my name is Ada. I am interested in your services. Please send me more details and a quote.",
    );
  });

  it("collapses internal whitespace so the message stays on one line", () => {
    const message = buildQuoteMessage(COMPANY, {
      name: "  John   Doe  ",
      service: "  Website   Redesign  ",
    });
    expect(message).toContain("my name is John Doe.");
    expect(message).toContain("interested in Website Redesign.");
    expect(message).not.toMatch(/\s{2,}/);
  });

  it("uses the company name it is given, so a rename follows through", () => {
    expect(buildQuoteMessage("Acme Ltd", { name: "Jo" })).toContain("Hi Acme Ltd,");
  });

  it("falls back to the default company name when given an empty one", () => {
    expect(buildQuoteMessage("", { name: "Jo" })).toContain("Hi Sholab Dex Tech,");
  });
});

describe("packageLabel", () => {
  const base: PricingPackage = {
    id: "p1",
    category: "websites",
    name: "Business Website",
    priceNgn: "₦180,000",
    priceUsd: "~$120",
    features: [],
    isPopular: true,
    sortOrder: 0,
  };

  it("joins the Naira and USD prices", () => {
    expect(packageLabel(base)).toBe("Business Website (₦180,000 / ~$120)");
  });

  it("omits the separator when there is no USD price", () => {
    expect(packageLabel({ ...base, priceUsd: "" })).toBe("Business Website (₦180,000)");
  });

  it("returns just the name when there is no price at all", () => {
    expect(packageLabel({ ...base, priceNgn: "", priceUsd: "" })).toBe("Business Website");
  });
});

describe("serviceLabel", () => {
  const service: Service = {
    id: "s1",
    category: "websites",
    name: "E-commerce Store",
    description: "",
    icon: null,
    sortOrder: 0,
  };

  it("prefers the specific service", () => {
    expect(serviceLabel(service, "websites")).toBe("E-commerce Store");
  });

  it("falls back to the category name when no service is chosen", () => {
    expect(serviceLabel(undefined, "automation")).toBe("AI Automation");
  });

  it("returns an empty string when neither is given", () => {
    expect(serviceLabel(undefined, undefined)).toBe("");
  });
});
