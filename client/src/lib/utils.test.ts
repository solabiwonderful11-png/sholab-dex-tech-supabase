import { describe, expect, it } from "vitest";
import { cn, linesToArray, slugify } from "./utils";

describe("cn", () => {
  it("merges class names and lets later Tailwind utilities win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("slugify", () => {
  it("produces a storage-safe path segment", () => {
    expect(slugify("My Logo (2026).png")).toBe("my-logo-2026-png");
  });

  it("strips leading and trailing separators", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  it("never exceeds 60 characters", () => {
    expect(slugify("a".repeat(200)).length).toBe(60);
  });
});

describe("linesToArray", () => {
  it("splits on newlines and drops blanks", () => {
    expect(linesToArray("one\n\ntwo\n   \nthree")).toEqual(["one", "two", "three"]);
  });

  it("trims each entry", () => {
    expect(linesToArray("  padded  ")).toEqual(["padded"]);
  });

  it("returns an empty array for empty input", () => {
    expect(linesToArray("")).toEqual([]);
  });
});
