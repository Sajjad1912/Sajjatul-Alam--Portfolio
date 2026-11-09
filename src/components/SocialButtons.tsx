import React from 'react';
import {
  SocialProfileConfig,
  getFormattedSocialButtons,
} from '../utils/socialFormatter';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';

export type ButtonFormatStyle = 'pill' | 'detailed' | 'solid';

export function BrandSvgIcon({
  id,
  size = 18,
}: {
  id: 'github' | 'linkedin' | 'gmail';
  size?: number;
}) {
  if (id === 'github') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }
  if (id === 'linkedin') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

interface SocialButtonsProps {
  config: SocialProfileConfig;
  formatStyle: ButtonFormatStyle;
  onNotify: (msg: string) => void;
  onOpenConfig: () => void;
}

/**
 * Hero Section: Clickable Social Cards for GitHub, LinkedIn, and Gmail with hidden URLs/links.
 */
export const HeroSocialButtons: React.FC<SocialButtonsProps> = ({
  config,
  formatStyle,
  onOpenConfig,
}) => {
  const buttons = getFormattedSocialButtons(config);

  return (
    <div className="mt-8" aria-label="Social profile cards">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[540px]">
        {buttons.map((btn) => {
          const isSolid = formatStyle === 'solid';
          return (
            <a
              key={btn.id}
              href={btn.href}
              target={btn.isExternal ? '_blank' : undefined}
              rel={btn.isExternal ? 'noopener noreferrer' : undefined}
              aria-label={`${btn.label} — ${btn.cardBadge}`}
              data-testid={`hero-card-${btn.id}`}
              className={`group relative flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSolid
                  ? 'border-[var(--a)]/45 bg-[var(--a)]/10 hover:bg-[var(--a)]/20 hover:border-[var(--a)]'
                  : 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--a)] hover:bg-[var(--a)]/10'
              } hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(255,178,36,0.35)]`}
            >
              <span className="w-10 h-10 rounded-lg grid place-items-center shrink-0 border border-[var(--line)] bg-[var(--bg)]/60 text-[var(--a)] transition-transform duration-200 group-hover:scale-105 group-hover:border-[var(--a)]/50">
                <BrandSvgIcon id={btn.id} size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display font-bold text-[15px] text-[var(--fg)] leading-tight">
                    {btn.label}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-[var(--mut)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--a)]"
                    aria-hidden="true"
                  />
                </div>
                <span className="block text-xs text-[var(--mut)] truncate mt-0.5">
                  {btn.cardBadge}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onOpenConfig}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--mut)] hover:text-[var(--a)] transition-colors cursor-pointer"
          aria-label="Customize social cards"
        >
          <SlidersHorizontal size={13} className="text-[var(--c)]" aria-hidden="true" />
          <span>Customize card links</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Contact Section: Full-width Clickable Cards for GitHub, LinkedIn, and Gmail with hidden URLs/emails.
 */
export const ContactSocialRows: React.FC<{
  config: SocialProfileConfig;
  onNotify: (msg: string) => void;
  onOpenConfig: () => void;
}> = ({ config, onOpenConfig }) => {
  const buttons = getFormattedSocialButtons(config);

  return (
    <div className="mt-7 grid gap-3.5">
      {buttons.map((btn) => (
        <a
          key={btn.id}
          href={btn.href}
          target={btn.isExternal ? '_blank' : undefined}
          rel={btn.isExternal ? 'noopener noreferrer' : undefined}
          aria-label={`${btn.label} — ${btn.cardSubtitle}`}
          data-testid={`contact-card-${btn.id}`}
          className="social-card-btn group cursor-pointer"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span
              className="w-12 h-12 rounded-xl grid place-items-center shrink-0 border border-[var(--line)] bg-[var(--a)]/10 text-[var(--a)] transition-all duration-200 group-hover:scale-105 group-hover:border-[var(--a)] group-hover:bg-[var(--a)] group-hover:text-[var(--ink)]"
              aria-hidden="true"
            >
              <BrandSvgIcon id={btn.id} size={22} />
            </span>
            <div className="min-w-0">
              <div className="font-display font-bold text-[17px] text-[var(--fg)] leading-snug">
                {btn.label}
              </div>
              <div className="text-sm text-[var(--mut)] truncate">
                {btn.cardSubtitle}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--bg)]/60 text-[var(--fg)] text-xs font-semibold shrink-0 transition-colors duration-200 group-hover:border-[var(--a)] group-hover:bg-[var(--a)] group-hover:text-[var(--ink)] whitespace-nowrap">
            <span>{btn.actionLabel}</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </a>
      ))}

      <div className="pt-1 flex items-center justify-between text-xs text-[var(--mut)]">
        <span>Click any card to connect directly</span>
        <button
          type="button"
          onClick={onOpenConfig}
          className="inline-flex items-center gap-1.5 text-[var(--c)] hover:underline cursor-pointer font-medium"
        >
          <SlidersHorizontal size={13} />
          <span>Edit hidden card links</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Footer Section: Compact Clickable Cards for GitHub, LinkedIn, and Gmail with hidden links.
 */
export const FooterSocialButtons: React.FC<{ config: SocialProfileConfig }> = ({ config }) => {
  const buttons = getFormattedSocialButtons(config);

  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-label="Footer social cards">
      {buttons.map((btn) => (
        <a
          key={btn.id}
          href={btn.href}
          target={btn.isExternal ? '_blank' : undefined}
          rel={btn.isExternal ? 'noopener noreferrer' : undefined}
          className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] text-xs font-semibold hover:border-[var(--a)] hover:bg-[var(--a)]/10 transition-all duration-200 hover:-translate-y-0.5"
          aria-label={`Footer ${btn.label} card`}
        >
          <span className="text-[var(--a)]">
            <BrandSvgIcon id={btn.id} size={15} />
          </span>
          <span>{btn.label}</span>
          <ArrowUpRight
            size={13}
            className="opacity-65 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--a)]"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
};
