import { LocaleLink as Link } from "../locale";
import type { AnchorHTMLAttributes, ReactNode } from "react";


import { cn } from "../../lib/cn";

type Variant =
  "primary" | "accent" | "outline-light" | "outline-dark" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-cream shadow-sm shadow-navy-950/10 hover:bg-navy-700 focus-visible:outline-navy-700",
  accent:
    "bg-teal-700 text-white shadow-sm shadow-teal-900/10 hover:bg-teal-800 focus-visible:outline-teal-600",
  "outline-light":
    "border border-cream/35 text-cream hover:border-cream/70 hover:bg-cream/10 focus-visible:outline-cream",
  "outline-dark":
    "border border-navy-800/25 text-navy-900 hover:border-navy-800/60 hover:bg-navy-50 focus-visible:outline-navy-800",
  ghost: "text-navy-800 underline-offset-4 hover:underline",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const baseStyles =
  "group inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

type ButtonLinkProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  to?: string;
  href?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;

/**
 * Renders an internal React Router <Link> when `to` is provided, otherwise a
 * plain anchor for external hrefs (tel:, mailto:, maps).
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  to,
  href,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} data-button-variant={variant} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} data-button-variant={variant} {...rest}>
      {children}
    </a>
  );
}
