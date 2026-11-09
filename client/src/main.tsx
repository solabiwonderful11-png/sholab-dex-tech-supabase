import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applySeo } from "./lib/seo";
import "./index.css";

// Canonical / og:url are set here rather than in index.html: a root-relative
// <link href> in the HTML entry is read as an asset by Vite's build-html plugin
// and breaks the production build. See client/src/lib/seo.ts.
applySeo();

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found in index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
