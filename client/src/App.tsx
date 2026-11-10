import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Home } from "@/pages/Home";
import { Admin } from "@/pages/admin/Admin";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen, ErrorScreen, ConfigScreen } from "@/components/Screen";
import { configError } from "@/lib/supabase";

/**
 * React Query client.
 *
 * retry: 1 rather than the default 3 — a Supabase outage should surface as a
 * clear error message quickly, not as a spinner that hangs for half a minute.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * The public site, gated on its content query.
 *
 * Rendering nothing until the content arrives avoids a flash of empty sections
 * and a layout shift when the data lands.
 */
function PublicSite() {
  const { data, isPending, error, refetch } = useSiteContent();

  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={() => void refetch()} />;
  return <Home content={data} />;
}

export default function App() {
  // Fail visibly, not blankly. When the build has no Supabase configuration
  // there is nothing to render, so show an explicit message instead of letting
  // the app mount and die silently.
  if (configError) return <ConfigScreen message={configError} />;

  // Vite exposes the configured `base` here. On Vercel it is "/", on a GitHub
  // Pages project site it is "/<repo>/". BrowserRouter needs it as a basename,
  // otherwise every route would be resolved against the domain root and the
  // site would render nothing under a subpath.
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<PublicSite />} />
              {/*
                The admin path is configurable so the owner can move it to
                something only they know. The panel has no login, so the URL is
                the only thing keeping it private — see README › Security.
              */}
              <Route
                path={`/${import.meta.env.VITE_ADMIN_PATH || "sholab"}`}
                element={<Admin />}
              />
              <Route path="*" element={<PublicSite />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
