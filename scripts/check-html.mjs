#!/usr/bin/env node
/**
 * Guard against the build failure that broke the first Vercel deploy.
 *
 * Vite's `build-html` plugin reads every `<link href="...">` in the HTML entry
 * as an asset. A root-relative href such as `href="/"` resolves to the project
 * root — a directory — and the plugin then tries to read it as a file:
 *
 *     [vite:build-html] EISDIR: illegal operation on a directory, read
 *
 * This script runs as `prebuild`, so the failure is reported in one clear line
 * instead of a stack trace from deep inside Vite. It only flags hrefs that
 * actually resolve to a directory or to a missing file, so legitimate asset
 * references (`/logo.svg`, data: URIs, absolute URLs) still pass.
 */

import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "index.html");

let html;
try {
  html = readFileSync(htmlPath, "utf8");
} catch {
  console.error(`[check-html] index.html not found at ${htmlPath}`);
  process.exit(1);
}

/** Every <link ...> tag in the document, ignoring HTML comments. */
const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
const linkTags = withoutComments.match(/<link\b[^>]*>/gi) ?? [];

const problems = [];

for (const tag of linkTags) {
  const hrefMatch = tag.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!hrefMatch) continue;

  const href = (hrefMatch[2] ?? hrefMatch[3] ?? "").trim();
  if (!href) continue;

  // Absolute URLs, protocol-relative URLs and data: URIs are never read from
  // disk by Vite, so they cannot trigger the bug.
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;

  // Strip a query string / hash before touching the filesystem.
  const clean = href.split(/[?#]/)[0];
  if (!clean) continue;

  const target = clean.startsWith("/")
    ? resolve(root, `.${clean}`)
    : resolve(root, clean);

  let stat;
  try {
    stat = statSync(target);
  } catch {
    problems.push(
      `${href}  →  ${target} does not exist (Vite would fail to read it)`,
    );
    continue;
  }

  if (stat.isDirectory()) {
    problems.push(
      `${href}  →  ${target} is a directory, not a file ` +
        `(this is the "EISDIR: illegal operation on a directory, read" build error)`,
    );
  }
}

if (problems.length > 0) {
  console.error("\n[check-html] index.html contains <link href> values that");
  console.error("Vite cannot read as assets:\n");
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    "\nFix: use an absolute URL (https://…) or a real file path. For the" +
      "\ncanonical link, set VITE_SITE_URL — client/src/lib/seo.ts injects it" +
      "\nat runtime, so it does not belong in index.html.\n",
  );
  process.exit(1);
}

console.log(
  `[check-html] OK — ${linkTags.length} <link> tag(s) checked, no directory or missing-file hrefs.`,
);
