import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ServiceCategory } from "@shared/types";

/**
 * Quote popup state, shared by every WhatsApp button on the site.
 *
 * The brief requires that each service card and each pricing card opens the
 * popup with *that* service or package already selected. Passing a callback down
 * through Nav → Hero → Services → Pricing → Contact would mean threading a prop
 * through a dozen components that do not otherwise care, so the state lives in a
 * context instead and any button can call `openQuote({...})`.
 */

export interface QuoteRequest {
  /** Pre-select this category tab. */
  category?: ServiceCategory;
  /** Pre-select this exact service (by name, which is what the message uses). */
  serviceName?: string;
  /** Pre-select this exact package (by id, so a rename cannot break the match). */
  packageId?: string;
}

interface QuoteContextValue {
  isOpen: boolean;
  request: QuoteRequest;
  openQuote: (request?: QuoteRequest) => void;
  closeQuote: () => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState<QuoteRequest>({});

  const openQuote = useCallback((next: QuoteRequest = {}) => {
    setRequest(next);
    setIsOpen(true);
  }, []);

  const closeQuote = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, request, openQuote, closeQuote }),
    [isOpen, request, openQuote, closeQuote],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

/**
 * Access the quote popup.
 *
 * Throws when used outside the provider rather than silently doing nothing —
 * a button that looks live but opens nothing is much harder to notice than a
 * crash during development.
 */
export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
