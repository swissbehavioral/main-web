// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { cn } from "../lib/cn";
type LogoVariant = "header" | "footer" | "mark";
const assets = {
    header: {
        src: "/logos/SBH_Logo_Horizontal_Color.svg",
        alt: "Swiss Behavioral Health — Tampa Bay",
        width: 147,
        height: 49,
        className: "h-11 w-auto sm:h-14",
    },
    footer: {
        src: "/logos/SBH_Logo_Horizontal_White.svg",
        alt: "Swiss Behavioral Health — Tampa Bay",
        width: 147,
        height: 49,
        className: "h-14 w-auto sm:h-16",
    },
    mark: {
        src: "/logos/SBH_Isotipo_Color.svg",
        alt: "Swiss Behavioral Health",
        width: 64,
        height: 64,
        className: "h-10 w-10 sm:h-12 sm:w-12",
    },
} as const;
/**
 * Official SBH logo lockups from /public/logos:
 * - header: horizontal color lockup
 * - footer: horizontal white lockup (for dark surfaces)
 * - mark:   isotipo only (mobile nav / favicon-style usage)
 */
export function Logo({ variant = "header", className, }: {
    variant?: LogoVariant;
    className?: string;
}) {
    const translate = useTranslate();
    const asset = assets[variant];
    return (<img src={asset.src} alt={translate(asset.alt)} width={asset.width} height={asset.height} loading="eager" className={cn(asset.className, "select-none", className)}/>);
}
