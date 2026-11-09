import { useState, type ReactNode } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin panel primitives.
 *
 * Small, unopinionated building blocks shared by every tab. Keeping them here
 * means the seven content tabs look and behave identically without each one
 * re-implementing a modal or a save button.
 */

// ── Layout ──────────────────────────────────────────────────────────────────

export function Panel({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="card p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
          ) : null}
        </div>
        {actions}
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

// ── Form fields ─────────────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-subtle">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="field"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="field resize-y"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-brand-500" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────────

export function SaveButton({
  onClick,
  saving,
  label = "Save changes",
}: {
  onClick: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={saving} className="btn btn-primary">
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Saving…
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function IconButton({
  onClick,
  label,
  children,
  danger,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg border border-line transition-colors",
        danger
          ? "text-red-500 hover:border-red-500/50 hover:bg-red-500/10"
          : "text-ink-muted hover:border-brand-500 hover:text-brand-500",
      )}
    >
      {children}
    </button>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">{children}</div>

        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

// ── Confirm delete ──────────────────────────────────────────────────────────

/**
 * Two-step delete.
 *
 * Deleting content is irreversible from the panel, so the button asks once
 * before acting. A native confirm() would be simpler but cannot be styled and
 * is blocked in some embedded browsers.
 */
export function DeleteButton({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => void;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <IconButton onClick={() => setArmed(true)} label={label} danger>
        <Trash2 className="h-4 w-4" />
      </IconButton>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-muted"
      >
        Cancel
      </button>
    </span>
  );
}

// ── Image upload ────────────────────────────────────────────────────────────

export function ImageField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
  hint?: string;
}) {
  return (
    <div>
      <span className="label">{label}</span>

      <div className="flex items-start gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface-sunken">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-ink-subtle">None</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              // Reset so choosing the same file twice still fires onChange.
              e.target.value = "";
            }}
            className="block w-full text-xs text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-600"
          />

          <div className="flex items-center gap-2">
            <input
              className="field !py-1.5 !text-xs"
              value={value ?? ""}
              placeholder="…or paste an image URL"
              onChange={(e) => onChange(e.target.value || null)}
            />
            {value ? (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="shrink-0 text-xs font-semibold text-red-500"
              >
                Clear
              </button>
            ) : null}
          </div>

          {uploading ? (
            <p className="flex items-center gap-1.5 text-xs text-brand-600">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              Uploading…
            </p>
          ) : hint ? (
            <p className="text-xs text-ink-subtle">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Repeatable list editor ──────────────────────────────────────────────────

/**
 * Editor for a jsonb array of {title, description} objects.
 * Used for why-choose-us and the process steps, which have the same shape.
 */
export function PairListEditor({
  items,
  onChange,
  titlePlaceholder,
  descriptionPlaceholder,
}: {
  items: { title: string; description: string }[];
  onChange: (items: { title: string; description: string }[]) => void;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
}) {
  const update = (i: number, patch: Partial<{ title: string; description: string }>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-line p-3">
          <div className="flex items-center gap-2">
            <input
              className="field !py-1.5 !text-sm"
              value={item.title}
              placeholder={titlePlaceholder}
              onChange={(e) => update(i, { title: e.target.value })}
            />
            <IconButton
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              label="Remove item"
              danger
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
          <textarea
            className="field mt-2 resize-y !text-sm"
            rows={2}
            value={item.description}
            placeholder={descriptionPlaceholder}
            onChange={(e) => update(i, { description: e.target.value })}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, { title: "", description: "" }])}
        className="btn btn-ghost !py-2 !text-xs"
      >
        + Add item
      </button>
    </div>
  );
}
