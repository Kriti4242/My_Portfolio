import { socialLinks } from '@/data/social';
import { footerContent, footerLinks } from '@/data/footer';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold text-gradient">{footerContent.brand}</p>
            <p className="mt-3 max-w-sm text-sm text-muted">{footerContent.tagline}</p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
              Quick Links
            </p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-muted hover:text-text">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
              Connect
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ id, href, label }) => (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full glass px-4 py-3 text-sm font-medium text-muted transition hover:text-secondary"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-muted">
          {footerContent.copyright}
        </p>
      </div>
    </footer>
  );
}
