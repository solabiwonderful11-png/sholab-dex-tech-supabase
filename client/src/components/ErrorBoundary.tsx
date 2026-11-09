import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Top-level error boundary.
 *
 * Without this, a render error anywhere in the tree unmounts the whole app and
 * leaves a blank white page with the error only in the console. Catching it
 * here means the visitor sees something actionable instead.
 */

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept as a console log rather than a remote reporter: this project has no
    // error-tracking service configured, and silently swallowing it would be
    // worse than leaving it visible in the console.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center bg-surface p-6">
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-lg font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink-muted">
            The page could not be displayed. Reloading usually fixes it.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-surface-sunken p-3 text-left text-xs text-ink-subtle">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-6"
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}
