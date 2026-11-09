/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Code2,
  Database,
  Download,
  ExternalLink,
  Globe,
  Menu,
  Moon,
  Send,
  Sun,
  Wrench,
  X,
} from 'lucide-react';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SOCIAL_CONFIG,
  SocialProfileConfig,
  validateContactForm,
} from './utils/socialFormatter';
import {
  BrandSvgIcon,
  ButtonFormatStyle,
  ContactSocialRows,
  FooterSocialButtons,
  HeroSocialButtons,
} from './components/SocialButtons';
import { SocialConfigModal } from './components/SocialConfigModal';

const STORAGE_KEY_CONFIG = 'sajjatul_social_config_v2';
const STORAGE_KEY_STYLE = 'sajjatul_social_style_v2';
const STORAGE_KEY_THEME = 'theme';

const SKILL_GROUPS = [
  {
    title: 'Programming & DB',
    icon: Code2,
    items: ['C', 'C++', 'Python', 'Java', 'SQL', 'SQLite3'],
  },
  {
    title: 'Networking & Security',
    icon: Globe,
    items: ['TCP/IP', 'Subnetting', 'NAT/PAT', 'Cisco Packet Tracer', 'Endpoint Security'],
  },
  {
    title: 'IT Support & Systems',
    icon: Database,
    items: ['Hardware Troubleshooting', 'IP Phone Config', 'TeamViewer', 'MS Office'],
  },
  {
    title: 'Tools & Design',
    icon: Wrench,
    items: ['Git & GitHub', 'VS Code', 'UI/UX Design', 'Figma', 'Data Analysis'],
  },
];

const EXPERIENCE_DUTIES = [
  { category: 'Security', title: 'Information & endpoint security operations' },
  { category: 'Hardware', title: 'Hardware troubleshooting & IT support' },
  { category: 'Networking', title: 'PC & IP Phone IP addressing and configuration' },
  { category: 'Cybersecurity', title: 'Banking-sector threat & vulnerability analysis' },
  { category: 'Support', title: 'Remote technical support using TeamViewer' },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'dark';
  });

  const [socialConfig, setSocialConfig] = useState<SocialProfileConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) {
        return { ...DEFAULT_SOCIAL_CONFIG, ...JSON.parse(raw) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SOCIAL_CONFIG;
  });

  const [formatStyle, setFormatStyle] = useState<ButtonFormatStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STYLE) as ButtonFormatStyle | null;
      if (saved === 'pill' || saved === 'detailed' || saved === 'solid') return saved;
    } catch {
      // ignore
    }
    return 'pill';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    fax: '',
  });
  const [formStatus, setFormStatus] = useState<{
    message: string;
    ok: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
      setScrolled(window.scrollY > 24);
    };

    const onPointerMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const handleSaveSocialConfig = (
    newConfig: SocialProfileConfig,
    newStyle: ButtonFormatStyle
  ) => {
    setSocialConfig(newConfig);
    setFormatStyle(newStyle);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
      localStorage.setItem(STORAGE_KEY_STYLE, newStyle);
    } catch {
      // ignore
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateContactForm(formData);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0] || 'Please check your inputs.';
      setFormStatus({ message: firstError, ok: false });
      showToast(firstError);
      return;
    }

    setIsSubmitting(true);
    setFormStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 450));

    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '', fax: '' });
    const successMessage = "Message sent. Thank you, I'll get back to you soon.";
    setFormStatus({ message: successMessage, ok: true });
    showToast(successMessage);
  };

  const activePhotoUrl = socialConfig.photoUrl || '/assets/aistudio/Sajjad_786d1e19.jpg';
  const activeCvUrl = socialConfig.cvUrl || '/assets/aistudio/Sajjad_dec47f9b.pdf';

  return (
    <div className="min-h-screen relative selection:bg-[var(--a)] selection:text-[var(--ink)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--a)] focus:text-[var(--ink)] focus:rounded-md font-semibold"
      >
        Skip to content
      </a>

      <div className="portfolio-bg" aria-hidden="true" />

      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 w-full h-[3px] bg-[var(--a)] origin-left z-50 transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* Top Navigation */}
      <nav
        aria-label="Main"
        className={`fixed top-3.5 left-1/2 -translate-x-1/2 w-[min(1060px,calc(100%-24px))] z-40 flex items-center gap-2 py-2 pl-5 pr-2.5 rounded-full border border-[var(--line)] backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg)]/90 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.5)]'
            : 'bg-[var(--bg)]/70'
        }`}
      >
        <a
          href="#home"
          aria-label="Sajjatul Alam, home"
          className="mr-auto font-display font-extrabold text-[21px] tracking-tight text-[var(--fg)] whitespace-nowrap shrink-0"
        >
          SA<span className="text-[var(--a)]">.</span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block px-3.5 py-1.5 rounded-full text-[15px] transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--fg)] bg-[var(--card)] font-medium'
                      : 'text-[var(--mut)] hover:text-[var(--fg)] hover:bg-[var(--card)]'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          aria-label="Switch between dark and light theme"
          className="w-10 h-10 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] grid place-items-center hover:border-[var(--a)] hover:text-[var(--a)] transition-colors cursor-pointer shrink-0"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          className="md:hidden w-10 h-10 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] grid place-items-center hover:border-[var(--a)] hover:text-[var(--a)] transition-colors cursor-pointer shrink-0"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <ul className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 flex flex-col p-2.5 rounded-2xl border border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-xl shadow-xl">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base ${
                    activeSection === item.id
                      ? 'text-[var(--fg)] bg-[var(--card)] font-semibold'
                      : 'text-[var(--mut)] hover:text-[var(--fg)]'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Main Content */}
      <main id="main">
        {/* Hero Section */}
        <section
          id="home"
          className="min-h-svh flex items-center pt-32 pb-16 scroll-mt-14"
        >
          <div className="max-w-[1120px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-[var(--c)] tracking-wide">
                Open to internships &amp; software engineering opportunities
              </p>

              <h1 className="mt-4 font-display font-extrabold text-[clamp(48px,8.5vw,104px)] leading-[0.95] tracking-[-0.04em]">
                Sajjatul
                <br />
                Alam
              </h1>

              <p className="font-display font-semibold text-[clamp(19px,2.4vw,25px)] leading-[1.3] mt-6 mb-3.5 max-w-[26ch]">
                Computer Science Engineer, software developer and tech enthusiast.
              </p>

              <p className="text-[var(--mut)] max-w-[50ch] mb-8 text-[clamp(17px,1.7vw,19px)]">
                BSc in Computer Science and Engineering at Northern University Bangladesh, and IT
                Intern at ONE Bank PLC. Interested in Cybersecurity, Network Engineering, IT
                Infrastructure, and Software Development.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={activeCvUrl}
                  download="Sajjatul-Alam-CV.pdf"
                  onClick={() => showToast('Downloading Sajjatul Alam CV (PDF)…')}
                  className="inline-flex items-center justify-center gap-2.5 px-5.5 py-3.25 rounded-full border border-[var(--a)] bg-[var(--a)] text-[var(--ink)] font-semibold text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Download size={18} />
                  <span>Download CV</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2.5 px-5.5 py-3.25 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--fg)] font-semibold text-[15px] hover:border-[var(--c)] transition-colors whitespace-nowrap"
                >
                  <span>Contact me</span>
                </a>
              </div>

              {/* Clickable GitHub, LinkedIn, Gmail Cards with Hidden Links */}
              <HeroSocialButtons
                config={socialConfig}
                formatStyle={formatStyle}
                onNotify={showToast}
                onOpenConfig={() => setConfigModalOpen(true)}
              />
            </div>

            {/* Portrait Sheet with Sajjatul Alam's Real Photo */}
            <figure className="portrait-sheet max-w-[360px] lg:max-w-none w-full mx-auto">
              <div className="portrait-placeholder overflow-hidden">
                {!photoError ? (
                  <img
                    src={activePhotoUrl}
                    alt="Portrait of Sajjatul Alam"
                    onError={() => setPhotoError(true)}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <>
                    <span className="portrait-monogram" aria-hidden="true">
                      SA
                    </span>
                    <small className="absolute bottom-4 inset-x-0 text-[13px] text-[var(--mut)]">
                      Computer Science &amp; Engineering
                    </small>
                  </>
                )}
              </div>
              <figcaption className="grid grid-cols-2 mt-3 border border-[var(--line)] font-display font-semibold text-[15px]">
                <div className="p-2.5 border-r border-b border-[var(--line)]">
                  <small className="block font-sans font-medium text-xs text-[var(--c)]">
                    Name
                  </small>
                  Sajjatul Alam
                </div>
                <div className="p-2.5 border-b border-[var(--line)]">
                  <small className="block font-sans font-medium text-xs text-[var(--c)]">
                    Degree
                  </small>
                  BSc CSE (3.79)
                </div>
                <div className="p-2.5 border-r border-[var(--line)]">
                  <small className="block font-sans font-medium text-xs text-[var(--c)]">
                    Role
                  </small>
                  IT Intern
                </div>
                <div className="p-2.5">
                  <small className="block font-sans font-medium text-xs text-[var(--c)]">
                    Company
                  </small>
                  ONE Bank PLC
                </div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            <div>
              <h2 className="section-heading">About me</h2>
              <div className="space-y-4 text-[18px] text-[var(--mut)] max-w-[62ch]">
                <p>
                  My foundation is a{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    BSc in Computer Science and Engineering
                  </strong>{' '}
                  at{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    Northern University Bangladesh
                  </strong>{' '}
                  (CGPA: 3.79 / 4.00): programming, databases, networking, and software
                  engineering.
                </p>
                <p>
                  As an{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    IT Intern at ONE Bank PLC
                  </strong>{' '}
                  (Security &amp; Hardware Team), I have worked hands-on with endpoint security,
                  banking-sector cybersecurity threats, PC and IP phone network configuration, and
                  remote technical support.
                </p>
                <p>
                  I am also a{' '}
                  <strong className="text-[var(--fg)] font-semibold">
                    Conference Paper Presenter
                  </strong>{' '}
                  at the 7th International Conference on Integrated Sciences (2025), presenting
                  research on cognitive fatigue, nutrition, and sleep behavior among students.
                </p>
              </div>
            </div>

            <dl className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5 divide-y divide-[var(--line)]">
              <div className="pb-3.5">
                <dt className="text-sm font-semibold text-[var(--c)]">Degree &amp; CGPA</dt>
                <dd className="mt-0.5 text-[var(--fg)]">
                  BSc in CSE · CGPA 3.79 / 4.00 (2023 – 2027)
                </dd>
              </div>
              <div className="py-3.5">
                <dt className="text-sm font-semibold text-[var(--c)]">University</dt>
                <dd className="mt-0.5 text-[var(--fg)]">Northern University Bangladesh</dd>
              </div>
              <div className="py-3.5">
                <dt className="text-sm font-semibold text-[var(--c)]">Experience</dt>
                <dd className="mt-0.5 text-[var(--fg)]">
                  IT Intern (Security &amp; Hardware), ONE Bank PLC
                </dd>
              </div>
              <div className="pt-3.5">
                <dt className="text-sm font-semibold text-[var(--c)]">Location</dt>
                <dd className="mt-0.5 text-[var(--fg)]">Ashkuna, Dokhin Khan, Dhaka</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6">
            <h2 className="section-heading">Technical skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SKILL_GROUPS.map((group) => {
                const Icon = group.icon;
                return (
                  <div
                    key={group.title}
                    className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5 hover:border-[var(--c)]/60 transition-colors"
                  >
                    <span className="w-11.5 h-11.5 rounded-full grid place-items-center mb-4.5 border border-[var(--a)]/45 bg-[var(--a)]/10 text-[var(--a)]">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-xl font-bold">{group.title}</h3>
                    <p className="mt-4 text-[15px] text-[var(--mut)] leading-relaxed">
                      {group.items.join(' · ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6">
            <h2 className="section-heading">Experience</h2>
            <div className="relative pl-9.5 before:content-[''] before:absolute before:left-[7px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-[var(--a)] before:to-[var(--line)]">
              <span
                className="absolute left-0 top-8 w-4 h-4 rounded-full bg-[var(--a)] shadow-[0_0_0_5px_rgba(255,178,36,0.25)]"
                aria-hidden="true"
              />
              <article className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5">
                <div className="flex flex-wrap justify-between gap-2.5 items-baseline">
                  <h3 className="text-xl font-bold">IT Intern – Security &amp; Hardware Team</h3>
                  <span className="text-sm font-semibold text-[var(--a)]">
                    ONE Bank PLC · IT Department
                  </span>
                </div>
                <p className="text-[var(--mut)] mt-1">
                  Assisted with information &amp; endpoint security, banking cybersecurity
                  operations, IP addressing, and hardware troubleshooting.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6">
                  {EXPERIENCE_DUTIES.map((duty) => (
                    <li
                      key={duty.title}
                      className="p-3.5 rounded-md border border-[var(--line)] bg-[var(--bg)]/30"
                    >
                      <small className="block text-[13px] text-[var(--c)] font-medium">
                        {duty.category}
                      </small>
                      <span className="text-[15px]">{duty.title}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6">
            <h2 className="section-heading">Featured projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_PROJECTS.map((project, idx) => (
                <article
                  key={project.id}
                  style={
                    {
                      '--shot-tint': idx % 2 === 1 ? 'var(--a)' : 'var(--c)',
                    } as React.CSSProperties
                  }
                  className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c)]/70"
                >
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[var(--line)] bg-[var(--bg)]/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]" />
                    <span className="ml-2.5 text-xs text-[var(--mut)] truncate">
                      {project.title.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  </div>

                  <div className="project-shot">
                    <span className="px-3 py-1.5 rounded bg-[var(--bg)]/80 text-xs text-[var(--mut)] border border-[var(--line)]">
                      {project.tech.join(' · ')}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-[var(--mut)] text-base flex-1">{project.desc}</p>
                    <p className="text-xs font-medium text-[var(--c)]">
                      {project.tech.join(' · ')}
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      <a
                        href={socialConfig.github || project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn-pill github py-2 px-4 text-xs"
                        aria-label={`${project.title} GitHub repository`}
                      >
                        <span className="text-[var(--a)]">
                          <BrandSvgIcon id="github" size={15} />
                        </span>
                        <span>GitHub</span>
                        <ExternalLink size={13} className="opacity-70" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Research Section */}
        <section id="education" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6">
            <h2 className="section-heading">Education &amp; Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5 flex items-start gap-5">
                <div
                  className="w-15 h-15 shrink-0 rounded-md border-2 border-[var(--a)] grid place-items-center font-display font-extrabold text-lg"
                  aria-hidden="true"
                >
                  NUB
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    B.Sc. in Computer Science &amp; Engineering
                  </h3>
                  <p className="text-[var(--mut)] mt-0.5">Northern University Bangladesh</p>
                  <p className="text-sm font-medium text-[var(--c)] mt-2 tabular-nums">
                    2023 – 2027 · CGPA: 3.79 / 4.00
                  </p>
                </div>
              </article>

              <article className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5 flex items-start gap-5">
                <div
                  className="w-15 h-15 shrink-0 rounded-md border-2 border-[var(--c)] grid place-items-center font-display font-extrabold text-lg text-[var(--c)]"
                  aria-hidden="true"
                >
                  MC
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Higher Secondary Certificate (HSC) – Science
                  </h3>
                  <p className="text-[var(--mut)] mt-0.5">Milestone College</p>
                  <p className="text-sm font-medium text-[var(--c)] mt-2 tabular-nums">
                    2020 – 2021 · GPA: 5.00 / 5.00
                  </p>
                </div>
              </article>
            </div>

            <article className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5">
              <p className="text-xs font-semibold text-[var(--a)]">
                Research &amp; Conference · 2025
              </p>
              <h3 className="text-lg font-bold mt-1">
                Paper Presenter – 7th International Conference on Integrated Sciences (2025)
              </h3>
              <p className="text-[var(--mut)] mt-1">
                Presented research on cognitive fatigue, nutrition, and sleep behavior among
                students.
              </p>
            </article>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 scroll-mt-14">
          <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            <div>
              <h2 className="section-heading">Get in touch</h2>
              <p className="text-[var(--mut)] text-[17px]">
                I’m open to internships, job opportunities and collaborations. Click any of the
                GitHub, LinkedIn, or Gmail cards below to connect directly, or send a message.
              </p>

              {/* Clickable GitHub, LinkedIn, Gmail Cards with Hidden Links */}
              <ContactSocialRows
                config={socialConfig}
                onNotify={showToast}
                onOpenConfig={() => setConfigModalOpen(true)}
              />
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleContactSubmit}
              aria-label="Contact form"
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] backdrop-blur-md p-6.5 grid gap-4"
              noValidate
            >
              <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
                <span>Full name</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    setFormStatus(null);
                  }}
                  className="w-full px-3.5 py-3 rounded-md border border-[var(--line)] bg-[var(--bg)]/55 text-[var(--fg)] focus:outline-none focus:border-[var(--a)]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setFormStatus(null);
                  }}
                  className="w-full px-3.5 py-3 rounded-md border border-[var(--line)] bg-[var(--bg)]/55 text-[var(--fg)] focus:outline-none focus:border-[var(--a)]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
                <span>Subject</span>
                <input
                  name="subject"
                  type="text"
                  required
                  minLength={3}
                  maxLength={150}
                  autoComplete="off"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, subject: e.target.value }));
                    setFormStatus(null);
                  }}
                  className="w-full px-3.5 py-3 rounded-md border border-[var(--line)] bg-[var(--bg)]/55 text-[var(--fg)] focus:outline-none focus:border-[var(--a)]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium text-[var(--mut)]">
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={5000}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                    setFormStatus(null);
                  }}
                  className="w-full px-3.5 py-3 rounded-md border border-[var(--line)] bg-[var(--bg)]/55 text-[var(--fg)] focus:outline-none focus:border-[var(--a)]"
                />
              </label>

              <div className="sr-only" aria-hidden="true">
                <label>
                  Fax (leave empty)
                  <input
                    name="fax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.fax}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fax: e.target.value }))
                    }
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="justify-self-start inline-flex items-center gap-2.5 px-5.5 py-3 rounded-full border border-[var(--a)] bg-[var(--a)] text-[var(--ink)] font-semibold text-[15px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
              >
                <Send size={17} />
                <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
              </button>

              {formStatus && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-[15px] font-medium ${
                    formStatus.ok ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-8 text-[var(--mut)] text-[15px]">
        <div className="max-w-[1120px] mx-auto px-6 flex flex-wrap gap-4 justify-between items-center">
          <span>© {new Date().getFullYear()} Sajjatul Alam. All rights reserved.</span>
          <FooterSocialButtons config={socialConfig} />
        </div>
      </footer>

      {/* Toast Notification */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 bottom-6.5 -translate-x-1/2 max-w-[calc(100%-32px)] px-5 py-3 rounded-lg bg-[var(--fg)] text-[var(--bg)] text-[15px] font-medium shadow-xl z-50 transition-all duration-300 pointer-events-none ${
          toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {toastMsg}
      </div>

      {/* Format & Customize Social Buttons Modal */}
      <SocialConfigModal
        isOpen={configModalOpen}
        config={socialConfig}
        formatStyle={formatStyle}
        onClose={() => setConfigModalOpen(false)}
        onSave={handleSaveSocialConfig}
        onNotify={showToast}
      />
    </div>
  );
}
