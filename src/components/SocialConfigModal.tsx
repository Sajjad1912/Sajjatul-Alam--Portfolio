import React, { useState } from 'react';
import {
  SocialProfileConfig,
  getFormattedSocialButtons,
} from '../utils/socialFormatter';
import { ButtonFormatStyle, BrandSvgIcon } from './SocialButtons';
import { ArrowUpRight, Check, Code2, Download, X } from 'lucide-react';

interface SocialConfigModalProps {
  isOpen: boolean;
  config: SocialProfileConfig;
  formatStyle: ButtonFormatStyle;
  onClose: () => void;
  onSave: (newConfig: SocialProfileConfig, newStyle: ButtonFormatStyle) => void;
  onNotify: (msg: string) => void;
}

export const SocialConfigModal: React.FC<SocialConfigModalProps> = ({
  isOpen,
  config,
  formatStyle,
  onClose,
  onSave,
  onNotify,
}) => {
  const [github, setGithub] = useState(config.github);
  const [linkedin, setLinkedin] = useState(config.linkedin);
  const [email, setEmail] = useState(config.email);
  const [style, setStyle] = useState<ButtonFormatStyle>(formatStyle);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const previewButtons = getFormattedSocialButtons({ github, linkedin, email });

  const htmlSnippet = `<!-- Clickable Social Cards (Links Hidden in href) -->
<div class="social-cards">
  <a href="${previewButtons[0].href}" target="_blank" rel="noopener noreferrer" class="scard github" aria-label="GitHub">
    <!-- GitHub SVG -->
    <div><strong>GitHub</strong><small>${previewButtons[0].cardSubtitle}</small></div>
  </a>
  <a href="${previewButtons[1].href}" target="_blank" rel="noopener noreferrer" class="scard linkedin" aria-label="LinkedIn">
    <!-- LinkedIn SVG -->
    <div><strong>LinkedIn</strong><small>${previewButtons[1].cardSubtitle}</small></div>
  </a>
  <a href="${previewButtons[2].href}" class="scard gmail" aria-label="Gmail">
    <!-- Gmail SVG -->
    <div><strong>Gmail</strong><small>${previewButtons[2].cardSubtitle}</small></div>
  </a>
</div>`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...config, github, linkedin, email }, style);
    onNotify('Updated clickable GitHub, LinkedIn & Gmail cards!');
    onClose();
  };

  const handleCopySnippet = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(htmlSnippet).catch(() => {});
    }
    setCopiedCode(true);
    onNotify('Copied clickable card HTML code to clipboard!');
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-social-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <h3 id="modal-social-title" className="text-xl font-bold text-[var(--fg)]">
              Customize Hidden-Link Social Cards
            </h3>
            <p className="text-sm text-[var(--mut)]">
              Set the target URLs/email embedded behind your clickable GitHub, LinkedIn &amp; Gmail
              cards.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[var(--line)] grid place-items-center text-[var(--mut)] hover:text-[var(--fg)] hover:border-[var(--a)] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div>
            <span className="block text-xs font-semibold text-[var(--mut)] mb-2">
              Card Surface Style
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  ['pill', 'Glass Card Surface'],
                  ['solid', 'Gold Accent Border'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStyle(val)}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    style === val
                      ? 'border-[var(--a)] bg-[var(--a)] text-[var(--ink)]'
                      : 'border-[var(--line)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--c)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
            <span>Hidden GitHub Link (Username or URL)</span>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/Sajjad1912"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] text-sm focus:outline-none focus:border-[var(--a)]"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
            <span>Hidden LinkedIn Link (Username or URL)</span>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://www.linkedin.com/in/sajjatul-alam-bhuiyan"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] text-sm focus:outline-none focus:border-[var(--a)]"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
            <span>Hidden Gmail Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sajjatulsunny@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] text-sm focus:outline-none focus:border-[var(--a)]"
            />
          </label>

          {/* Live Preview */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <div className="text-xs font-semibold text-[var(--c)] mb-2.5">
              Clickable Card Preview (Raw URLs Hidden)
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {previewButtons.map((btn) => (
                <div
                  key={btn.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/60"
                >
                  <span className="text-[var(--a)] shrink-0">
                    <BrandSvgIcon id={btn.id} size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--fg)]">{btn.label}</span>
                      <ArrowUpRight size={12} className="text-[var(--mut)]" />
                    </div>
                    <span className="block text-[11px] text-[var(--mut)] truncate">
                      {btn.cardBadge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySnippet}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line)] bg-[var(--card)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--c)] cursor-pointer"
              >
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Code2 size={14} />}
                <span>{copiedCode ? 'Copied HTML' : 'Copy Card HTML'}</span>
              </button>

              <a
                href="/assets/aistudio/index_a0279420.html"
                download="index.html"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line)] bg-[var(--card)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--c)]"
              >
                <Download size={14} />
                <span>Download index.html</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[var(--line)] text-sm font-semibold text-[var(--mut)] hover:text-[var(--fg)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[var(--a)] text-[var(--ink)] text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
                Save Cards
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
