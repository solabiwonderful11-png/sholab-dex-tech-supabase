import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  DollarSign,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings as SettingsIcon,
  Sparkles,
  Wrench,
} from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS } from "@shared/constants";
import type {
  Faq,
  PricingPackage,
  Project,
  Service,
  ServiceCategory,
  SiteSettings,
  Stat,
  Testimonial,
} from "@shared/types";
import {
  createFaq,
  createPackage,
  createProject,
  createService,
  createStat,
  createTestimonial,
  deleteFaq,
  deletePackage,
  deleteProject,
  deleteService,
  deleteStat,
  deleteTestimonial,
  saveSettings,
  setPopularPackage,
  updateFaq,
  updatePackage,
  updateProject,
  updateService,
  updateStat,
  updateTestimonial,
  uploadImage,
} from "@/lib/api";
import { mediaUrl } from "@/lib/supabase";
import { formatDateTime, linesToArray } from "@/lib/utils";
import { useContactMessages, useDeleteContactMessage, useRefreshSiteContent, useSiteContent } from "@/hooks/useSiteContent";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoadingScreen, ErrorScreen } from "@/components/Screen";
import {
  DeleteButton,
  Field,
  IconButton,
  ImageField,
  Modal,
  PairListEditor,
  Panel,
  SaveButton,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

/**
 * The /sholab control panel.
 *
 * Every tab follows the same shape: read the current content from the shared
 * site-content query, edit it in local state, and write back on save. Local
 * state is what makes the form usable — writing on every keystroke would fire a
 * request per character and make the inputs feel laggy.
 *
 * After a successful save the site-content query is invalidated, so the public
 * page reflects the change without a manual refresh.
 */

type TabId =
  | "dashboard"
  | "settings"
  | "services"
  | "pricing"
  | "projects"
  | "testimonials"
  | "stats"
  | "faqs"
  | "messages";

const TABS: { id: TabId; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "settings", label: "Site settings", Icon: SettingsIcon },
  { id: "services", label: "Services", Icon: Wrench },
  { id: "pricing", label: "Pricing", Icon: DollarSign },
  { id: "projects", label: "Portfolio", Icon: Briefcase },
  { id: "testimonials", label: "Reviews", Icon: MessageSquareQuote },
  { id: "stats", label: "Stats", Icon: BarChart3 },
  { id: "faqs", label: "FAQs", Icon: HelpCircle },
  { id: "messages", label: "Messages", Icon: Inbox },
];

export function Admin() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const { data, isPending, error, refetch } = useSiteContent();

  if (isPending) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={() => void refetch()} />;

  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="glass-strong sticky top-0 z-40 border-b border-line">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white">
              {data.settings.companyName.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">Control panel</p>
              <p className="text-xs text-ink-subtle">{data.settings.companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <a href="/" className="btn btn-ghost !px-3 !py-2 !text-xs">
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              View site
            </a>
          </div>
        </div>
      </header>

      <div className="shell grid gap-6 py-6 lg:grid-cols-12">
        {/* Sidebar */}
        <nav className="lg:col-span-3" aria-label="Admin sections">
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map(({ id, label, Icon }) => (
              <li key={id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className={
                    "flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors " +
                    (tab === id
                      ? "bg-brand-500 text-white shadow-brand"
                      : "text-ink-muted hover:bg-surface-raised hover:text-ink")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-6 lg:col-span-9">
          {tab === "dashboard" ? <Dashboard content={data} onGoTo={setTab} /> : null}
          {tab === "settings" ? <SettingsTab settings={data.settings} /> : null}
          {tab === "services" ? <ServicesTab services={data.services} /> : null}
          {tab === "pricing" ? <PricingTab packages={data.packages} /> : null}
          {tab === "projects" ? <ProjectsTab projects={data.projects} /> : null}
          {tab === "testimonials" ? (
            <TestimonialsTab testimonials={data.testimonials} />
          ) : null}
          {tab === "stats" ? <StatsTab stats={data.stats} /> : null}
          {tab === "faqs" ? <FaqsTab faqs={data.faqs} /> : null}
          {tab === "messages" ? <MessagesTab /> : null}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Dashboard
// ════════════════════════════════════════════════════════════════════════════

function Dashboard({
  content,
  onGoTo,
}: {
  content: ReturnType<typeof useSiteContent>["data"] & object;
  onGoTo: (tab: TabId) => void;
}) {
  const messages = useContactMessages();
  const unread = messages.data?.length ?? 0;

  const cards = [
    { label: "Services", value: content.services.length, tab: "services" as TabId },
    { label: "Packages", value: content.packages.length, tab: "pricing" as TabId },
    { label: "Projects", value: content.projects.length, tab: "projects" as TabId },
    { label: "Reviews", value: content.testimonials.length, tab: "testimonials" as TabId },
    { label: "FAQs", value: content.faqs.length, tab: "faqs" as TabId },
    { label: "Messages", value: unread, tab: "messages" as TabId },
  ];

  return (
    <>
      <Panel
        title="Welcome back"
        description="Everything on the public site is edited from here. Changes go live as soon as you save."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => onGoTo(c.tab)}
              className="card card-hover p-4 text-left"
            >
              <p className="text-2xl font-extrabold tracking-tight text-brand-600 dark:text-brand-300">
                {c.value}
              </p>
              <p className="mt-1 text-xs font-medium text-ink-muted">{c.label}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel
        title="Recent enquiries"
        description="The five most recent messages from the contact form."
        actions={
          <button
            type="button"
            onClick={() => onGoTo("messages")}
            className="btn btn-ghost !px-3 !py-2 !text-xs"
          >
            View all
          </button>
        }
      >
        {messages.isPending ? (
          <p className="text-sm text-ink-subtle">Loading…</p>
        ) : unread === 0 ? (
          <p className="text-sm text-ink-subtle">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.data?.slice(0, 5).map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-ink-muted">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-subtle">
                  {formatDateTime(m.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Site settings
// ════════════════════════════════════════════════════════════════════════════

function SettingsTab({ settings }: { settings: SiteSettings }) {
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const refresh = useRefreshSiteContent();

  // Re-sync when the underlying content changes (e.g. after a save elsewhere).
  useEffect(() => setDraft(settings), [settings]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  async function onUpload(key: keyof SiteSettings, file: File) {
    setUploading(String(key));
    try {
      const path = await uploadImage(file, "site");
      set(key, path as SiteSettings[typeof key]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function onSave() {
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
  }

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
          <Field label="WhatsApp number" hint="Digits only, with country code. e.g. 2348169781185">
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
        title="Footer & SEO"
        description="Footer text, plus the title and description search engines show."
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
          <Field label="SEO title">
            <TextInput value={draft.seoTitle} onChange={(v) => set("seoTitle", v)} />
          </Field>
          <Field label="SEO description">
            <TextArea value={draft.seoDescription} onChange={(v) => set("seoDescription", v)} />
          </Field>
          <Field label="SEO keywords" hint="Comma separated.">
            <TextInput value={draft.seoKeywords} onChange={(v) => set("seoKeywords", v)} />
          </Field>
        </div>
      </Panel>

      <div className="sticky bottom-4 flex items-center justify-end gap-3">
        {saved ? (
          <span className="rounded-full bg-brand-500/12 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Saved
          </span>
        ) : null}
        <SaveButton onClick={onSave} saving={saving} label="Save all settings" />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Services
// ════════════════════════════════════════════════════════════════════════════

const EMPTY_SERVICE: Omit<Service, "id"> = {
  category: "websites",
  name: "",
  description: "",
  icon: null,
  sortOrder: 0,
};

function ServicesTab({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Service, "id">>(EMPTY_SERVICE);
  const [busy, setBusy] = useState(false);
  const refresh = useRefreshSiteContent();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c,
        items: services.filter((s) => s.category === c),
      })),
    [services],
  );

  function openCreate() {
    setDraft({ ...EMPTY_SERVICE, sortOrder: services.length });
    setCreating(true);
  }

  function openEdit(s: Service) {
    const { id: _id, ...rest } = s;
    setDraft(rest);
    setEditing(s);
  }

  async function save() {
    setBusy(true);
    try {
      if (editing) await updateService(editing.id, draft);
      else await createService(draft);
      await refresh();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteService(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <Panel
        title="Services"
        description="Grouped by category. The order here is the order shown on the site."
        actions={
          <button type="button" onClick={openCreate} className="btn btn-primary !py-2 !text-xs">
            + Add service
          </button>
        }
      >
        <div className="space-y-6">
          {grouped.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                {CATEGORY_LABELS[category]} ({items.length})
              </h3>
              <ul className="mt-3 divide-y divide-line">
                {items.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{s.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-ink-subtle">#{s.sortOrder}</span>
                      <IconButton onClick={() => openEdit(s)} label="Edit service">
                        <Sparkles className="h-4 w-4" />
                      </IconButton>
                      <DeleteButton onConfirm={() => void remove(s.id)} />
                    </div>
                  </li>
                ))}
                {items.length === 0 ? (
                  <li className="py-3 text-xs text-ink-subtle">Nothing in this category.</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit service" : "Add service"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <SaveButton onClick={save} saving={busy} label={editing ? "Save" : "Add"} />
          </>
        }
      >
        <Field label="Category">
          <Select
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v as ServiceCategory })}
            options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
          />
        </Field>
        <Field label="Name">
          <TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        </Field>
        <Field label="Description">
          <TextArea
            value={draft.description}
            onChange={(v) => setDraft({ ...draft, description: v })}
          />
        </Field>
        <Field label="Sort order" hint="Lower numbers appear first.">
          <TextInput
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </Field>
      </Modal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Pricing
// ════════════════════════════════════════════════════════════════════════════

const EMPTY_PACKAGE: Omit<PricingPackage, "id"> = {
  category: "websites",
  name: "",
  priceNgn: "",
  priceUsd: "",
  features: [],
  isPopular: false,
  sortOrder: 0,
};

function PricingTab({ packages }: { packages: PricingPackage[] }) {
  const [editing, setEditing] = useState<PricingPackage | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<PricingPackage, "id">>(EMPTY_PACKAGE);
  const [featuresText, setFeaturesText] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useRefreshSiteContent();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c,
        items: packages.filter((p) => p.category === c),
      })),
    [packages],
  );

  function openCreate() {
    setDraft({ ...EMPTY_PACKAGE, sortOrder: packages.length });
    setFeaturesText("");
    setCreating(true);
  }

  function openEdit(p: PricingPackage) {
    const { id: _id, ...rest } = p;
    setDraft(rest);
    setFeaturesText(p.features.join("\n"));
    setEditing(p);
  }

  async function save() {
    setBusy(true);
    const payload = { ...draft, features: linesToArray(featuresText) };
    try {
      if (editing) await updatePackage(editing.id, payload);
      else await createPackage(payload);
      await refresh();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deletePackage(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  async function makePopular(p: PricingPackage) {
    try {
      await setPopularPackage(p.category, p.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update");
    }
  }

  return (
    <>
      <Panel
        title="Pricing packages"
        description="One package per category can be marked as the most popular."
        actions={
          <button type="button" onClick={openCreate} className="btn btn-primary !py-2 !text-xs">
            + Add package
          </button>
        }
      >
        <div className="space-y-6">
          {grouped.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                {CATEGORY_LABELS[category]} ({items.length})
              </h3>
              <ul className="mt-3 divide-y divide-line">
                {items.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {p.name}
                        {p.isPopular ? (
                          <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-600">
                            Popular
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {p.priceNgn} {p.priceUsd ? `· ${p.priceUsd}` : ""} ·{" "}
                        {p.features.length} features
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!p.isPopular ? (
                        <button
                          type="button"
                          onClick={() => void makePopular(p)}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:border-accent-500 hover:text-accent-600"
                        >
                          Make popular
                        </button>
                      ) : null}
                      <IconButton onClick={() => openEdit(p)} label="Edit package">
                        <Sparkles className="h-4 w-4" />
                      </IconButton>
                      <DeleteButton onConfirm={() => void remove(p.id)} />
                    </div>
                  </li>
                ))}
                {items.length === 0 ? (
                  <li className="py-3 text-xs text-ink-subtle">No packages yet.</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit package" : "Add package"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <SaveButton onClick={save} saving={busy} label={editing ? "Save" : "Add"} />
          </>
        }
      >
        <Field label="Category">
          <Select
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v as ServiceCategory })}
            options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
          />
        </Field>
        <Field label="Package name">
          <TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (₦)">
            <TextInput
              value={draft.priceNgn}
              onChange={(v) => setDraft({ ...draft, priceNgn: v })}
              placeholder="₦80,000"
            />
          </Field>
          <Field label="Price (USD)">
            <TextInput
              value={draft.priceUsd}
              onChange={(v) => setDraft({ ...draft, priceUsd: v })}
              placeholder="~$55"
            />
          </Field>
        </div>
        <Field label="Features" hint="One per line.">
          <TextArea
            rows={6}
            value={featuresText}
            onChange={setFeaturesText}
            placeholder={"5-page website\nMobile responsive\nContact form"}
          />
        </Field>
        <Field label="Sort order">
          <TextInput
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </Field>
        <Toggle
          checked={draft.isPopular}
          onChange={(v) => setDraft({ ...draft, isPopular: v })}
          label="Mark as most popular"
        />
      </Modal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Projects
// ════════════════════════════════════════════════════════════════════════════

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  category: "websites",
  description: "",
  image: null,
  link: null,
  sortOrder: 0,
};

function ProjectsTab({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Project, "id">>(EMPTY_PROJECT);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const refresh = useRefreshSiteContent();

  function openCreate() {
    setDraft({ ...EMPTY_PROJECT, sortOrder: projects.length });
    setCreating(true);
  }

  function openEdit(p: Project) {
    const { id: _id, ...rest } = p;
    setDraft(rest);
    setEditing(p);
  }

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const path = await uploadImage(file, "projects");
      setDraft((d) => ({ ...d, image: path }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    try {
      if (editing) await updateProject(editing.id, draft);
      else await createProject(draft);
      await refresh();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteProject(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <Panel
        title="Portfolio projects"
        description="Shown in the Our work section, filterable by category."
        actions={
          <button type="button" onClick={openCreate} className="btn btn-primary !py-2 !text-xs">
            + Add project
          </button>
        }
      >
        <ul className="divide-y divide-line">
          {projects.map((p) => {
            const img = mediaUrl(p.image);
            return (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface-sunken">
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-ink-subtle">No image</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {CATEGORY_LABELS[p.category]} · {p.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <IconButton onClick={() => openEdit(p)} label="Edit project">
                    <Sparkles className="h-4 w-4" />
                  </IconButton>
                  <DeleteButton onConfirm={() => void remove(p.id)} />
                </div>
              </li>
            );
          })}
          {projects.length === 0 ? (
            <li className="py-3 text-sm text-ink-subtle">No projects yet.</li>
          ) : null}
        </ul>
      </Panel>

      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit project" : "Add project"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <SaveButton onClick={save} saving={busy} label={editing ? "Save" : "Add"} />
          </>
        }
      >
        <Field label="Title">
          <TextInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        </Field>
        <Field label="Category">
          <Select
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v as ServiceCategory })}
            options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={draft.description}
            onChange={(v) => setDraft({ ...draft, description: v })}
          />
        </Field>
        <ImageField
          label="Project image"
          value={mediaUrl(draft.image)}
          onChange={(v) => setDraft({ ...draft, image: v })}
          onUpload={(f) => void onUpload(f)}
          uploading={uploading}
        />
        <Field label="Project link" hint="Optional. Opens in a new tab.">
          <TextInput
            value={draft.link ?? ""}
            onChange={(v) => setDraft({ ...draft, link: v || null })}
            placeholder="https://…"
          />
        </Field>
        <Field label="Sort order">
          <TextInput
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </Field>
      </Modal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Testimonials
// ════════════════════════════════════════════════════════════════════════════

const EMPTY_TESTIMONIAL: Omit<Testimonial, "id"> = {
  clientName: "",
  businessName: "",
  rating: 5,
  reviewText: "",
  photo: null,
  sortOrder: 0,
};

function TestimonialsTab({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Testimonial, "id">>(EMPTY_TESTIMONIAL);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const refresh = useRefreshSiteContent();

  function openCreate() {
    setDraft({ ...EMPTY_TESTIMONIAL, sortOrder: testimonials.length });
    setCreating(true);
  }

  function openEdit(t: Testimonial) {
    const { id: _id, ...rest } = t;
    setDraft(rest);
    setEditing(t);
  }

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const path = await uploadImage(file, "clients");
      setDraft((d) => ({ ...d, photo: path }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    try {
      if (editing) await updateTestimonial(editing.id, draft);
      else await createTestimonial(draft);
      await refresh();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteTestimonial(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <Panel
        title="Client reviews"
        description="Shown in the What our clients say section."
        actions={
          <button type="button" onClick={openCreate} className="btn btn-primary !py-2 !text-xs">
            + Add review
          </button>
        }
      >
        <ul className="divide-y divide-line">
          {testimonials.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {t.clientName}
                  {t.businessName ? (
                    <span className="font-normal text-ink-subtle"> · {t.businessName}</span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {"★".repeat(t.rating)} — {t.reviewText}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <IconButton onClick={() => openEdit(t)} label="Edit review">
                  <Sparkles className="h-4 w-4" />
                </IconButton>
                <DeleteButton onConfirm={() => void remove(t.id)} />
              </div>
            </li>
          ))}
          {testimonials.length === 0 ? (
            <li className="py-3 text-sm text-ink-subtle">No reviews yet.</li>
          ) : null}
        </ul>
      </Panel>

      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit review" : "Add review"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <SaveButton onClick={save} saving={busy} label={editing ? "Save" : "Add"} />
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client name">
            <TextInput
              value={draft.clientName}
              onChange={(v) => setDraft({ ...draft, clientName: v })}
            />
          </Field>
          <Field label="Business name">
            <TextInput
              value={draft.businessName}
              onChange={(v) => setDraft({ ...draft, businessName: v })}
            />
          </Field>
        </div>
        <Field label="Rating">
          <Select
            value={String(draft.rating)}
            onChange={(v) => setDraft({ ...draft, rating: Number(v) })}
            options={[5, 4, 3, 2, 1].map((n) => ({
              value: String(n),
              label: `${"★".repeat(n)} (${n})`,
            }))}
          />
        </Field>
        <Field label="Review text">
          <TextArea
            rows={4}
            value={draft.reviewText}
            onChange={(v) => setDraft({ ...draft, reviewText: v })}
          />
        </Field>
        <ImageField
          label="Client photo"
          value={mediaUrl(draft.photo)}
          onChange={(v) => setDraft({ ...draft, photo: v })}
          onUpload={(f) => void onUpload(f)}
          uploading={uploading}
          hint="Optional — initials are shown if empty."
        />
        <Field label="Sort order">
          <TextInput
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </Field>
      </Modal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Stats
// ════════════════════════════════════════════════════════════════════════════

function StatsTab({ stats }: { stats: Stat[] }) {
  const [draft, setDraft] = useState<Stat[]>(stats);
  const [busy, setBusy] = useState(false);
  const refresh = useRefreshSiteContent();

  useEffect(() => setDraft(stats), [stats]);

  async function add() {
    setBusy(true);
    try {
      await createStat({ label: "New stat", value: "0", sortOrder: draft.length });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not add");
    } finally {
      setBusy(false);
    }
  }

  async function saveOne(s: Stat) {
    setBusy(true);
    try {
      await updateStat(s.id, { label: s.label, value: s.value, sortOrder: s.sortOrder });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteStat(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <Panel
      title="Hero stats"
      description="The numbers shown under the hero. A value like 50+ animates from zero; 24/7 is shown as-is."
      actions={
        <button type="button" onClick={add} disabled={busy} className="btn btn-primary !py-2 !text-xs">
          + Add stat
        </button>
      }
    >
      <ul className="space-y-3">
        {draft.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <input
              className="field !py-1.5 !text-sm"
              value={s.value}
              placeholder="50+"
              onChange={(e) =>
                setDraft(draft.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))
              }
            />
            <input
              className="field !py-1.5 !text-sm"
              value={s.label}
              placeholder="Projects delivered"
              onChange={(e) =>
                setDraft(draft.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))
              }
            />
            <input
              type="number"
              className="field !w-20 !py-1.5 !text-sm"
              value={String(s.sortOrder)}
              onChange={(e) =>
                setDraft(
                  draft.map((x, idx) =>
                    idx === i ? { ...x, sortOrder: Number(e.target.value) || 0 } : x,
                  ),
                )
              }
            />
            <IconButton onClick={() => void saveOne(s)} label="Save stat">
              <Sparkles className="h-4 w-4" />
            </IconButton>
            <DeleteButton onConfirm={() => void remove(s.id)} />
          </li>
        ))}
        {draft.length === 0 ? (
          <li className="text-sm text-ink-subtle">No stats yet.</li>
        ) : null}
      </ul>
    </Panel>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FAQs
// ════════════════════════════════════════════════════════════════════════════

const EMPTY_FAQ: Omit<Faq, "id"> = { question: "", answer: "", sortOrder: 0 };

function FaqsTab({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Faq, "id">>(EMPTY_FAQ);
  const [busy, setBusy] = useState(false);
  const refresh = useRefreshSiteContent();

  function openCreate() {
    setDraft({ ...EMPTY_FAQ, sortOrder: faqs.length });
    setCreating(true);
  }

  function openEdit(f: Faq) {
    const { id: _id, ...rest } = f;
    setDraft(rest);
    setEditing(f);
  }

  async function save() {
    setBusy(true);
    try {
      if (editing) await updateFaq(editing.id, draft);
      else await createFaq(draft);
      await refresh();
      setEditing(null);
      setCreating(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteFaq(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <Panel
        title="Frequently asked questions"
        description="Shown in the FAQ accordion near the bottom of the page."
        actions={
          <button type="button" onClick={openCreate} className="btn btn-primary !py-2 !text-xs">
            + Add FAQ
          </button>
        }
      >
        <ul className="divide-y divide-line">
          {faqs.map((f) => (
            <li key={f.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{f.question}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{f.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <IconButton onClick={() => openEdit(f)} label="Edit FAQ">
                  <Sparkles className="h-4 w-4" />
                </IconButton>
                <DeleteButton onConfirm={() => void remove(f.id)} />
              </div>
            </li>
          ))}
          {faqs.length === 0 ? (
            <li className="py-3 text-sm text-ink-subtle">No FAQs yet.</li>
          ) : null}
        </ul>
      </Panel>

      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit FAQ" : "Add FAQ"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <SaveButton onClick={save} saving={busy} label={editing ? "Save" : "Add"} />
          </>
        }
      >
        <Field label="Question">
          <TextInput
            value={draft.question}
            onChange={(v) => setDraft({ ...draft, question: v })}
          />
        </Field>
        <Field label="Answer">
          <TextArea
            rows={4}
            value={draft.answer}
            onChange={(v) => setDraft({ ...draft, answer: v })}
          />
        </Field>
        <Field label="Sort order">
          <TextInput
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </Field>
      </Modal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Messages
// ════════════════════════════════════════════════════════════════════════════

function MessagesTab() {
  const { data, isPending, error } = useContactMessages();
  const remove = useDeleteContactMessage();

  if (isPending) return <Panel title="Messages">Loading…</Panel>;
  if (error) {
    return (
      <Panel title="Messages">
        <p className="text-sm text-red-500">{error.message}</p>
      </Panel>
    );
  }

  return (
    <Panel
      title="Contact messages"
      description="Enquiries submitted through the contact form, newest first."
    >
      {data.length === 0 ? (
        <p className="text-sm text-ink-subtle">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((m) => (
            <li key={m.id} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{m.name}</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    {[m.email, m.phone, m.service].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-subtle">
                    {formatDateTime(m.createdAt)}
                  </span>
                  <DeleteButton
                    onConfirm={() => remove.mutate(m.id)}
                    label="Delete message"
                  />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                {m.message}
              </p>
              {m.email ? (
                <a
                  href={`mailto:${m.email}?subject=Re: your enquiry`}
                  className="btn btn-ghost mt-3 !py-1.5 !text-xs"
                >
                  Reply by email
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
