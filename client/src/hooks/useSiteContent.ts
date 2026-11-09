import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewContactMessage } from "@shared/types";
import {
  createContactMessage,
  deleteContactMessage,
  fetchContactMessages,
  fetchSiteContent,
} from "@/lib/api";

/**
 * Query keys in one place.
 *
 * Centralising them is what makes invalidation reliable: the admin panel and
 * the public site must agree on the exact key, or a save would leave the site
 * showing stale content until a manual refresh.
 */
export const queryKeys = {
  siteContent: ["site-content"] as const,
  messages: ["contact-messages"] as const,
};

/**
 * All public site content.
 *
 * staleTime is generous because this content changes only when the owner edits
 * it in /sholab — there is no reason to refetch on every mount or window focus.
 */
export function useSiteContent() {
  return useQuery({
    queryKey: queryKeys.siteContent,
    queryFn: fetchSiteContent,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/** Contact enquiries, for the admin Messages tab. */
export function useContactMessages() {
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: fetchContactMessages,
    staleTime: 30 * 1000,
  });
}

/** Public contact form submission. */
export function useSubmitContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewContactMessage) => createContactMessage(input),
    onSuccess: () => {
      // The admin panel may be open in another tab; refresh its list.
      void qc.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

export function useDeleteContactMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

/**
 * Invalidate the public content cache after an admin edit.
 * Every admin mutation calls this so the site reflects a save immediately.
 */
export function useRefreshSiteContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.siteContent });
}
