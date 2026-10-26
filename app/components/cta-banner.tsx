// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { footer, site } from "../data/site";
import { IconPhone, IconShieldCheck } from "./icons";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
/**
 * Shared pre-footer CTA band used on interior pages.
 */
export function CtaBanner() {
    return (<section className="relative overflow-hidden bg-navy-950 py-16 text-cream sm:py-20 texture-alpine" aria-labelledby="cta-heading">
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
            <IconShieldCheck className="h-6 w-6" strokeWidth={1.6}/>
          </span>
          <h2 id="cta-heading" className="mt-5 font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            <T>{footer.headline}</T>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/70">
            <T>{footer.body}</T>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={footer.primaryCta.href} variant="accent" size="lg">
              <IconPhone className="h-4 w-4"/>
              <T>{footer.primaryCta.label}</T>
            </ButtonLink>
            <ButtonLink to={footer.secondaryCta.to} variant="outline-light" size="lg">
              <T>{footer.secondaryCta.label}</T>
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-cream/45">
            <T>{site.phone.display}</T><T>{" \u00B7 "}</T><T>{site.email.display}</T>
          </p>
        </div>
      </Container>
    </section>);
}
