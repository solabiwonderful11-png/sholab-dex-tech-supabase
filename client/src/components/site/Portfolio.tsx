import { useState } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS } from "@shared/constants";
import type { Project, ServiceCategory } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { mediaUrl } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/**
 * Portfolio grid with a category filter.
 *
 * "All" is a real option rather than a default, because a visitor who has not
 * decided what they need should be able to see the range of work first.
 */
export function Portfolio({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ServiceCategory | "all">("all");

  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <Section
      id="portfolio"
      eyebrow="Our work"
      title="Projects we have delivered"
      intro="A selection of websites, automation systems and campaigns built for real businesses."
      tone="sunken"
    >
      <Reveal className="flex flex-wrap justify-center gap-2">
        {(["all", ...CATEGORIES] as const).map((c) => {
          const isActive = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-ink text-ink-inverse"
                  : "border border-line bg-surface-raised text-ink-muted hover:text-ink",
              )}
            >
              {c === "all" ? "All work" : CATEGORY_LABELS[c]}
            </button>
          );
        })}
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 55}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-subtle">
          No projects in this category yet.
        </p>
      ) : null}
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const image = mediaUrl(project.image);

  const body = (
    <article className="card card-hover group h-full overflow-hidden">
      {/* Thumbnail. Falls back to a branded placeholder so a project without an
          image still looks deliberate rather than broken. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
        {image ? (
          <img
            src={image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-500/12 to-accent-500/12">
            <ImageIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink backdrop-blur">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      <div className="p-5">
        <h3 className="flex items-start justify-between gap-2 text-sm font-bold leading-snug">
          {project.title}
          {project.link ? (
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle transition-colors group-hover:text-brand-500"
              aria-hidden="true"
            />
          ) : null}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.description}</p>
      </div>
    </article>
  );

  // Only wrap in a link when there is somewhere to go — an <a> with no href is
  // not focusable and would be a dead end for keyboard users.
  return project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      aria-label={`${project.title} — open project`}
    >
      {body}
    </a>
  ) : (
    body
  );
}
