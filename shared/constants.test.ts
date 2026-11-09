import { describe, expect, it } from "vitest";
import { CATEGORIES, CATEGORY_LABELS, formatPrice, whatsappLink } from "./constants";

describe("whatsappLink", () => {
  it("strips formatting characters from the number", () => {
    expect(whatsappLink("+234 816 978 1185")).toBe("https://wa.me/2348169781185");
  });

  it("appends a URL-encoded message", () => {
    const link = whatsappLink("2348169781185", "Hi there & welcome");
    expect(link).toBe("https://wa.me/2348169781185?text=Hi%20there%20%26%20welcome");
  });

  it("omits the query string when there is no message", () => {
    expect(whatsappLink("2348169781185")).not.toContain("?text=");
  });

  it("handles an empty number without throwing", () => {
    expect(whatsappLink("")).toBe("https://wa.me/");
  });
});

describe("formatPrice", () => {
  it("joins both currencies when present", () => {
    expect(formatPrice("₦80,000", "~$55")).toBe("₦80,000 · ~$55");
  });

  it("falls back to whichever currency exists", () => {
    expect(formatPrice("₦80,000", "")).toBe("₦80,000");
    expect(formatPrice("", "~$55")).toBe("~$55");
  });

  it("falls back to a call to action when both are empty", () => {
    expect(formatPrice("", "")).toBe("Contact us");
  });
});

describe("categories", () => {
  it("has a label for every category", () => {
    for (const c of CATEGORIES) {
      expect(CATEGORY_LABELS[c]).toBeTruthy();
    }
  });
});
