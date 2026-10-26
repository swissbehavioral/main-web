import { T } from "../locale";
import { usePageText } from "../page-copy";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Container } from "./container";

type SectionTone = "light" | "sand" | "dark";

const toneStyles: Record<SectionTone, string> = {
  light: "bg-cream text-navy-950",
  sand: "bg-sand text-navy-950",
  dark: "bg-navy-950 text-cream",
};

const descriptionStyles: Record<SectionTone, string> = {
  light: "text-navy-900/75",
  sand: "text-navy-900/75",
  dark: "text-cream/70",
};

export function SectionHeading({
  tone = "light",
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: {
  tone?: SectionTone;
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}) {
  const copy = usePageText();
  title = copy(title);
  if (description !== undefined) description = copy(description);
  if (eyebrow !== undefined) eyebrow = copy(eyebrow);
  return (
    <div
      className={cn(
        "section-heading max-w-3xl",
        centered && "mx-auto text-center [&>p:first-child]:justify-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]",
            tone === "dark" ? "text-teal-200" : "text-teal-700",
          )}
        >
          <span aria-hidden className="h-px w-8 bg-teal-500/70" />
          <T>{eyebrow}</T>
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-cream" : "text-navy-950",
        )}
      >
        <T>{title}</T>
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg",
            descriptionStyles[tone],
            centered && "mx-auto",
          )}
        >
          <T>{description}</T>
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-28", toneStyles[tone], className)}
    >
      <Container className="relative">{children}</Container>
    </section>
  );
}
