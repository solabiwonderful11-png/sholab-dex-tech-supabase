import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { SiteSettings } from "@shared/types";
import { resetToDefaults, saveSettings, uploadImage } from "@/lib/api";
import { mediaUrl } from "@/lib/supabase";
import { useRefreshSiteContent } from "@/hooks/useSiteContent";
import {
  Field,
  IconButton,
  ImageField,
  Panel,
  PairListEditor,
  SaveButton,
  TextArea,
  TextInput,
} from "./ui";

/**
 * The four tabs that edit the single `site_settings` row.
 *
 * They live in their own module rather than inside Admin.tsx because they share
 * one draft and one save path — keeping them together makes that sharing obvious
 * and stops Admin.tsx from growing past the point of being readable.
 *
 * The split follows the brief's sidebar (8.10):
 *   Content  — brand, hero, about, footer
 *   Media    — every image on the site (8.8)
 *   SEO      — title, description, keywords, share image (8.9)
 *   Settings — admin path and reset-to-default (8.10)
 */

// ── Shared editor ────────────────────────────────────────────────────────────

/**
 * Load/save/upload plumbing shared by all four tabs.
 *
 * Local draft state is what makes the forms usable: writing on every keystroke
 * would fire a request per character. The draft re-syncs whenever the underlying
 * content changes, so a save on one tab is reflected on the others.
 */
function useSettingsEditor(settings: SiteSettings) {
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const refresh = useRefreshSiteContent();

  useEffect(() => setDraft(settings), [settings]);

  const set = useCallback(
    <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
      setDraft((d) => ({ ...d, [key]: value })),
    [],
  );

  const onUpload = useCallback(
    async (key: keyof SiteSettings, file: File) => {
      setUploading(String(key));
      try {
        const path = await uploadImage(file, "site");
        set(key, path as SiteSettings[typeof key]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(null);
      }
    },
    [set],
  );

  const onSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveSettings(draft);
      await refresh();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }, [draft, refresh]);

  return { draft, set, onUpload, onSave, saving, uploading, saved };
}

/** The sticky save bar at the foot of every settings-backed tab. */
function SaveBar({
  onSave,
  saving,
  saved,
  label = "Save changes",
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 flex items-center justify-end gap-3">
      {saved ? (
        <span className="rounded-full bg-brand-500/12 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
          Saved
        </span>
      ) : null}
      <SaveButton onClick={onSave} saving={saving} label={label} />
    </div>
  );
}

// ── Content ──────────────────────────────────────────────────────────────────

export function ContentTab({ settings }: { settings: SiteSettings }) {
  const { draft, set, onUpload, onSave, saving, uploading, saved } =
    useSettingsEditor(settings);

  return (
    <>
      <Panel
        title="Brand & contact"
        description="The company name, contact details and social links used across the site."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <TextInput value={draft.companyName} onChange={(v) => set("companyName", v)} />
          </Field>
          <Field label="Business hours">
            <TextInput
              value={draft.businessHours}
              onChange={(v) => set("businessHours", v)}
              placeholder="Mon–Sat, 9am–6pm"
            />
          </Field>
          <Field label="Phone (displayed)">
            <TextInput value={draft.phone} onChange={(v) => set("phone", v)} />
          </Field>
          <Field
            label="WhatsApp number"
            hint="Digits only, with country code. e.g. 2348169781185"
          >
            <TextInput
              value={draft.whatsappNumber}
              onChange={(v) => set("whatsappNumber", v)}
            />
          </Field>
          <Field label="Email">
            <TextInput value={draft.email} onChange={(v) => set("email", v)} />
          </Field>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ImageField
            label="Logo"
            value={mediaUrl(draft.logo)}
            onChange={(v) => set("logo", v)}
            onUpload={(f) => void onUpload("logo", f)}
            uploading={uploading === "logo"}
            hint="Square image works best."
          />
          <ImageField
            label="CEO photo"
            value={mediaUrl(draft.ceoPhoto)}
            onChange={(v) => set("ceoPhoto", v)}
            onUpload={(f) => void onUpload("ceoPhoto", f)}
            uploading={uploading === "ceoPhoto"}
          />
        </div>

        <div className="mt-6">
          <span className="label">Social links</span>
          <div className="space-y-2">
            {draft.socials.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="field !py-1.5 !text-sm"
                  value={s.label}
                  placeholder="Label (e.g. Facebook)"
                  onChange={(e) =>
                    set(
                      "socials",
                      draft.socials.map((x, idx) =>
                        idx === i ? { ...x, label: e.target.value } : x,
                      ),
                    )
                  }
                />
                <input
                  className="field !py-1.5 !text-sm"
                  value={s.url}
                  placeholder="https://…"
                  onChange={(e) =>
                    set(
                      "socials",
                      draft.socials.map((x, idx) =>
                        idx === i ? { ...x, url: e.target.value } : x,
                      ),
                    )
                  }
                />
                <IconButton
                  onClick={() =>
                    set(
                      "socials",
                      draft.socials.filter((_, idx) => idx !== i),
                    )
                  }
                  label="Remove link"
                  danger
                >
                  <span className="text-sm">×</span>
                </IconButton>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("socials", [...draft.socials, { label: "", url: "" }])}
              className="btn btn-ghost !py-2 !text-xs"
            >
              + Add social link
            </button>
          </div>
        </div>
      </Panel>

      <Panel
        title="Hero"
        description="The first thing visitors see."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="space-y-4">
          <Field label="Headline">
            <TextInput value={draft.heroHeadline} onChange={(v) => set("heroHeadline", v)} />
          </Field>
          <Field label="Tagline">
            <TextInput value={draft.heroTagline} onChange={(v) => set("heroTagline", v)} />
          </Field>
          <Field label="Intro paragraph">
            <TextArea value={draft.heroIntro} onChange={(v) => set("heroIntro", v)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button text">
              <TextInput
                value={draft.heroCtaPrimary}
                onChange={(v) => set("heroCtaPrimary", v)}
              />
            </Field>
            <Field label="Secondary button text">
              <TextInput
                value={draft.heroCtaSecondary}
                onChange={(v) => set("heroCtaSecondary", v)}
              />
            </Field>
          </div>
          <ImageField
            label="Hero image"
            value={mediaUrl(draft.heroImage)}
            onChange={(v) => set("heroImage", v)}
            onUpload={(f) => void onUpload("heroImage", f)}
            uploading={uploading === "heroImage"}
            hint="Leave empty to show the built-in branded panel instead."
          />
        </div>
      </Panel>

      <Panel
        title="About"
        description="Your story, mission, vision and the reasons clients choose you."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="space-y-4">
          <Field label="Section heading">
            <TextInput value={draft.aboutHeading} onChange={(v) => set("aboutHeading", v)} />
          </Field>
          <Field label="About text">
            <TextArea rows={5} value={draft.aboutBody} onChange={(v) => set("aboutBody", v)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mission">
              <TextArea value={draft.mission} onChange={(v) => set("mission", v)} />
            </Field>
            <Field label="Vision">
              <TextArea value={draft.vision} onChange={(v) => set("vision", v)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CEO name">
              <TextInput value={draft.ceoName} onChange={(v) => set("ceoName", v)} />
            </Field>
            <Field label="CEO title">
              <TextInput value={draft.ceoTitle} onChange={(v) => set("ceoTitle", v)} />
            </Field>
          </div>
          <Field label="CEO bio">
            <TextArea value={draft.ceoBio} onChange={(v) => set("ceoBio", v)} />
          </Field>

          <div>
            <span className="label">Why choose us</span>
            <PairListEditor
              items={draft.whyChooseUs}
              onChange={(v) => set("whyChooseUs", v)}
              titlePlaceholder="Reason (e.g. Fast delivery)"
              descriptionPlaceholder="One line explaining it"
            />
          </div>

          <div>
            <span className="label">Process steps</span>
            <PairListEditor
              items={draft.processSteps}
              onChange={(v) => set("processSteps", v)}
              titlePlaceholder="Step name"
              descriptionPlaceholder="What happens at this step"
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Footer"
        description="The text shown at the bottom of every page."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="space-y-4">
          <Field label="Footer description">
            <TextArea
              value={draft.footerDescription}
              onChange={(v) => set("footerDescription", v)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Copyright line">
              <TextInput
                value={draft.footerCopyright}
                onChange={(v) => set("footerCopyright", v)}
              />
            </Field>
            <Field label="Credit line">
              <TextInput value={draft.footerCredit} onChange={(v) => set("footerCredit", v)} />
            </Field>
          </div>
          <Field label="Pricing note" hint="Shown under the pricing cards.">
            <TextArea value={draft.pricingNote} onChange={(v) => set("pricingNote", v)} />
          </Field>
        </div>
      </Panel>

      <SaveBar onSave={onSave} saving={saving} saved={saved} label="Save all content" />
    </>
  );
}

// ── Media ────────────────────────────────────────────────────────────────────

/**
 * The Media tab (brief 8.8).
 *
 * One place to see and replace every image that belongs to the site as a whole.
 * The same fields also appear on the Content tab, next to the text they belong
 * to — this is the overview, so the owner does not have to hunt through sections
 * to find an image.
 *
 * Portfolio and testimonial photos are edited on their own tabs, because they
 * belong to individual rows rather than to the single settings record.
 */
export function MediaTab({ settings }: { settings: SiteSettings }) {
  const { draft, set, onUpload, onSave, saving, uploading, saved } =
    useSettingsEditor(settings);

  const images: {
    key: keyof SiteSettings;
    label: string;
    hint: string;
  }[] = [
    {
      key: "logo",
      label: "Logo",
      hint: "Shown in the header and footer. A square PNG with transparency works best.",
    },
    {
      key: "favicon",
      label: "Favicon",
      hint: "The small icon in the browser tab. 32×32 or 64×64 PNG.",
    },
    {
      key: "heroImage",
      label: "Hero image",
      hint: "The large image beside the headline. Leave empty for the built-in panel.",
    },
    {
      key: "ceoPhoto",
      label: "CEO photo",
      hint: "Shown in the About section.",
    },
    {
      key: "seoOgImage",
      label: "Social share image",
      hint: "Shown when the site is shared on WhatsApp, Facebook or X. 1200×630 works best.",
    },
  ];

  return (
    <>
      <Panel
        title="Site images"
        description="Upload or replace the images used across the site. Files are stored in Supabase Storage."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {images.map((img) => (
            <ImageField
              key={String(img.key)}
              label={img.label}
              hint={img.hint}
              value={mediaUrl(draft[img.key] as string | null)}
              onChange={(v) => set(img.key, v as SiteSettings[typeof img.key])}
              onUpload={(f) => void onUpload(img.key, f)}
              uploading={uploading === String(img.key)}
            />
          ))}
        </div>
      </Panel>

      <Panel
        title="Where the other images live"
        description="Portfolio and testimonial photos belong to individual entries."
      >
        <ul className="space-y-2 text-sm text-ink-muted">
          <li>
            <strong className="text-ink">Portfolio images</strong> — edit them on the
            Portfolio tab, on each project.
          </li>
          <li>
            <strong className="text-ink">Client photos</strong> — edit them on the
            Testimonials tab, on each review.
          </li>
        </ul>
      </Panel>

      <SaveBar onSave={onSave} saving={saving} saved={saved} label="Save images" />
    </>
  );
}

// ── SEO ──────────────────────────────────────────────────────────────────────

/**
 * The SEO tab (brief 8.9).
 *
 * These fields drive the document title, the meta description and keywords, and
 * the social share image. The public page applies the title and description
 * live, so an edit here shows up in the browser tab as soon as it is saved.
 */
export function SeoTab({ settings }: { settings: SiteSettings }) {
  const { draft, set, onUpload, onSave, saving, uploading, saved } =
    useSettingsEditor(settings);

  const titleLength = draft.seoTitle.length;
  const descriptionLength = draft.seoDescription.length;

  return (
    <>
      <Panel
        title="Search engine listing"
        description="What people see when your site appears in Google results."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="space-y-4">
          <Field
            label="Page title"
            hint={`${titleLength} characters — aim for 50–60 so it is not cut off.`}
          >
            <TextInput value={draft.seoTitle} onChange={(v) => set("seoTitle", v)} />
          </Field>

          <Field
            label="Meta description"
            hint={`${descriptionLength} characters — aim for 150–160.`}
          >
            <TextArea
              rows={3}
              value={draft.seoDescription}
              onChange={(v) => set("seoDescription", v)}
            />
          </Field>

          <Field
            label="Keywords"
            hint="Comma separated. A minor ranking factor, but harmless."
          >
            <TextInput value={draft.seoKeywords} onChange={(v) => set("seoKeywords", v)} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Social share preview"
        description="The image and text shown when someone shares your link on WhatsApp, Facebook or X."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <ImageField
          label="Share image"
          hint="1200×630 is the standard size. Leave empty to share without an image."
          value={mediaUrl(draft.seoOgImage)}
          onChange={(v) => set("seoOgImage", v)}
          onUpload={(f) => void onUpload("seoOgImage", f)}
          uploading={uploading === "seoOgImage"}
        />

        {/* A rough preview of the Google result, so the owner can judge length. */}
        <div className="mt-6 rounded-xl border border-line bg-surface-sunken/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
            Preview
          </p>
          <p className="mt-2 truncate text-sm font-medium text-[#1a0dab] dark:text-[#8ab4f8]">
            {draft.seoTitle || "Your page title"}
          </p>
          <p className="mt-0.5 text-xs text-[#006621] dark:text-[#5bb974]">
            {import.meta.env.VITE_SITE_URL || "https://your-site.com"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
            {draft.seoDescription || "Your meta description will appear here."}
          </p>
        </div>
      </Panel>

      <SaveBar onSave={onSave} saving={saving} saved={saved} label="Save SEO settings" />
    </>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────

/**
 * The Settings tab (brief 8.10).
 *
 * Holds what is about the site as a whole rather than its content: where the
 * control panel lives, and the reset-to-default escape hatch.
 */
export function SettingsTab({ settings }: { settings: SiteSettings }) {
  const { draft, set, onSave, saving, saved } = useSettingsEditor(settings);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const refresh = useRefreshSiteContent();

  const adminPath = import.meta.env.VITE_ADMIN_PATH || "sholab";

  async function onReset() {
    setResetting(true);
    try {
      await resetToDefaults();
      await refresh();
      setConfirmReset(false);
      alert("All content has been restored to the default values.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not reset");
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <Panel
        title="Control panel"
        description="Where this admin panel lives on the site."
        actions={<SaveButton onClick={onSave} saving={saving} />}
      >
        <div className="space-y-4">
          <Field
            label="Admin path"
            hint="Set with the VITE_ADMIN_PATH environment variable. Changing it requires a redeploy."
          >
            <TextInput value={`/${adminPath}`} onChange={() => {}} />
          </Field>

          <div className="rounded-xl border border-line bg-surface-sunken/60 p-4 text-sm text-ink-muted">
            <p>
              The panel is reachable at{" "}
              <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">
                /{adminPath}
              </code>{" "}
              and is linked discreetly from the site footer.
            </p>
            <p className="mt-2">
              It is protected by the path alone. To add a real login, enable Supabase
              Auth and gate this route — see the README.
            </p>
          </div>

          <Field label="Company name" hint="Used in the WhatsApp greeting.">
            <TextInput value={draft.companyName} onChange={(v) => set("companyName", v)} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Danger zone"
        description="Restore every service, package, project, review, stat and FAQ to the values the site shipped with."
      >
        {confirmReset ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              This cannot be undone.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              All your edits to services, pricing, portfolio, reviews, stats and FAQs
              will be replaced with the defaults. Contact messages are not affected.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onReset()}
                disabled={resetting}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {resetting ? "Resetting…" : "Yes, reset everything"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="btn btn-ghost"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to default
          </button>
        )}
      </Panel>

      <SaveBar onSave={onSave} saving={saving} saved={saved} label="Save settings" />
    </>
  );
}
