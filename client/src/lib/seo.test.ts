import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { absoluteUrl, applySeo, siteOrigin } from "./seo";

/**
 * These tests pin the behaviour that replaced the `<link rel="canonical" href="/">`
 * tag in index.html. That tag made Vite's build-html plugin read the project
 * root as a file and fail the production build with EISDIR.
 */

const ORIGINAL_ENV = { ...import.meta.env };

function setSiteUrl(value: string | undefined) {
  // import.meta.env is read-only at runtime; stub it for the test.
  vi.stubEnv("VITE_SITE_URL", value as string);
}

describe("siteOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    Object.assign(import.meta.env, ORIGINAL_ENV);
  });

  it("returns an empty string when VITE_SITE_URL is unset", () => {
    setSiteUrl(undefined);
    expect(siteOrigin()).toBe("");
  });

  it("strips trailing slashes", () => {
    setSiteUrl("https://sholabdextech.com///");
    expect(siteOrigin()).toBe("https://sholabdextech.com");
  });

  it("trims surrounding whitespace", () => {
    setSiteUrl("  https://sholabdextech.com  ");
    expect(siteOrigin()).toBe("https://sholabdextech.com");
  });
});

describe("absoluteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    Object.assign(import.meta.env, ORIGINAL_ENV);
  });

  it("joins the origin and a root path", () => {
    setSiteUrl("https://sholabdextech.com");
    expect(absoluteUrl("/")).toBe("https://sholabdextech.com/");
  });

  it("adds a leading slash when the path omits one", () => {
    setSiteUrl("https://sholabdextech.com");
    expect(absoluteUrl("sholab")).toBe("https://sholabdextech.com/sholab");
  });

  it("falls back to a relative path when no origin is configured", () => {
    setSiteUrl(undefined);
    expect(absoluteUrl("/")).toBe("/");
  });
});

describe("applySeo", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.assign(import.meta.env, ORIGINAL_ENV);
    document.head.innerHTML = "";
  });

  it("creates a canonical link when the document has none", () => {
    setSiteUrl("https://sholabdextech.com");
    applySeo("/");
    const link = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    expect(link).not.toBeNull();
    expect(link?.href).toBe("https://sholabdextech.com/");
  });

  it("updates an existing canonical link instead of duplicating it", () => {
    setSiteUrl("https://sholabdextech.com");
    applySeo("/");
    applySeo("/sholab");
    const links = document.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect((links[0] as HTMLLinkElement).href).toBe(
      "https://sholabdextech.com/sholab",
    );
  });

  it("sets og:url to the same absolute URL", () => {
    setSiteUrl("https://sholabdextech.com");
    applySeo("/");
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]',
    );
    expect(meta?.content).toBe("https://sholabdextech.com/");
  });
});
