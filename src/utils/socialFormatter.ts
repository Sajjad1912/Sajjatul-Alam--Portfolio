export interface SocialProfileConfig {
  github: string;
  linkedin: string;
  email: string;
  cvUrl?: string;
  photoUrl?: string;
  graduationStatus?: string;
}

export interface FormattedSocialButton {
  id: 'github' | 'linkedin' | 'gmail';
  label: string;
  actionLabel: string;
  cardSubtitle: string;
  cardBadge: string;
  href: string;
  webHref: string;
  displayHandle: string;
  shortHandle: string;
  isExternal: boolean;
  copyValue: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  github: string;
  demo: string;
}

export const DEFAULT_SOCIAL_CONFIG: SocialProfileConfig = {
  github: 'https://github.com/Sajjad1912',
  linkedin: 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan-6a33a7315/',
  email: 'sajjatulsunny@gmail.com',
  cvUrl: '/assets/aistudio/Sajjad_dec47f9b.pdf',
  photoUrl: '/assets/aistudio/Sajjad_786d1e19.jpg',
  graduationStatus: '2023 – 2027 · CGPA: 3.79 / 4.00',
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'job-portal',
    title: 'Job Portal Management System',
    desc: 'Desktop-based job portal with Job Seeker, Employer, and Admin modules for job posting, searching, application management, and SQLite3 database operations.',
    tech: ['Python', 'Tkinter', 'SQLite3'],
    github: 'https://github.com/Sajjad1912',
    demo: '',
  },
  {
    id: 'bluetooth-drone',
    title: 'Bluetooth-Controlled Mini Drone',
    desc: 'Built a mini drone prototype controlled smoothly through wireless Bluetooth communication and microcontroller integration.',
    tech: ['Arduino', 'Bluetooth', 'C++'],
    github: 'https://github.com/Sajjad1912',
    demo: '',
  },
  {
    id: 'ultrasonic-distance',
    title: 'Ultrasonic Distance Measurement System',
    desc: 'Designed an Arduino Uno-based precision distance measurement system using an HC-SR04 ultrasonic sensor.',
    tech: ['Arduino Uno', 'HC-SR04', 'C/C++'],
    github: 'https://github.com/Sajjad1912',
    demo: '',
  },
  {
    id: 'hostel-mess',
    title: 'Hostel Mess Management System',
    desc: 'Web application for managing a hostel mess, meal tracking, and member billing built with PHP.',
    tech: ['PHP', 'MySQL', 'HTML/CSS'],
    github: 'https://github.com/Sajjad1912',
    demo: '',
  },
  {
    id: 'inventory-system',
    title: 'Inventory Management System',
    desc: 'High-efficiency inventory tracking and stock control application built with C++ and SQL.',
    tech: ['C++', 'SQL'],
    github: 'https://github.com/Sajjad1912',
    demo: '',
  },
];

/**
 * Formats a raw GitHub input (username or full URL) into structured clickable card metadata with hidden raw URL.
 */
export function formatGitHubButton(rawInput: string): FormattedSocialButton {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      id: 'github',
      label: 'GitHub',
      actionLabel: 'Explore Code',
      cardSubtitle: 'Repositories & open-source projects',
      cardBadge: 'Projects & Code',
      href: 'https://github.com/Sajjad1912',
      webHref: 'https://github.com/Sajjad1912',
      displayHandle: 'github.com/Sajjad1912',
      shortHandle: '@Sajjad1912',
      isExternal: true,
      copyValue: 'https://github.com/Sajjad1912',
    };
  }

  let cleanPath = trimmed
    .replace(/^https?:\/\/(www\.)?github\.com\/?/i, '')
    .replace(/^github\.com\/?/i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');

  if (!cleanPath) {
    cleanPath = 'Sajjad1912';
  }

  const fullUrl = `https://github.com/${cleanPath}`;
  const username = cleanPath.split('/')[0];

  return {
    id: 'github',
    label: 'GitHub',
    actionLabel: 'Explore Code',
    cardSubtitle: 'Repositories & open-source projects',
    cardBadge: 'Projects & Code',
    href: fullUrl,
    webHref: fullUrl,
    displayHandle: `github.com/${cleanPath}`,
    shortHandle: `@${username}`,
    isExternal: true,
    copyValue: fullUrl,
  };
}

/**
 * Formats a raw LinkedIn input (slug, username, or full URL) into structured clickable card metadata with hidden raw URL.
 */
export function formatLinkedInButton(rawInput: string): FormattedSocialButton {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      id: 'linkedin',
      label: 'LinkedIn',
      actionLabel: 'Connect',
      cardSubtitle: 'Professional network & experience',
      cardBadge: 'Let’s Connect',
      href: 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan',
      webHref: 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan',
      displayHandle: 'linkedin.com/in/sajjatul-alam-bhuiyan',
      shortHandle: 'in/sajjatul-alam-bhuiyan',
      isExternal: true,
      copyValue: 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan',
    };
  }

  let slug = trimmed
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/i, '')
    .replace(/^(www\.)?linkedin\.com\/(in\/)?/i, '')
    .replace(/^in\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');

  if (!slug) {
    slug = 'sajjatul-alam-bhuiyan';
  }

  const fullUrl = `https://www.linkedin.com/in/${slug}`;

  return {
    id: 'linkedin',
    label: 'LinkedIn',
    actionLabel: 'Connect',
    cardSubtitle: 'Professional network & experience',
    cardBadge: 'Let’s Connect',
    href: fullUrl,
    webHref: fullUrl,
    displayHandle: `linkedin.com/in/${slug}`,
    shortHandle: `in/${slug}`,
    isExternal: true,
    copyValue: fullUrl,
  };
}

/**
 * Formats a raw Email / Gmail input into structured clickable card metadata with hidden email text.
 */
export function formatGmailButton(rawInput: string): FormattedSocialButton {
  const trimmed = rawInput.trim().replace(/^mailto:/i, '');
  let email = trimmed || 'sajjatulsunny@gmail.com';

  if (!email.includes('@')) {
    email = `${email}@gmail.com`;
  }

  const mailtoHref = `mailto:${email}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  return {
    id: 'gmail',
    label: 'Gmail',
    actionLabel: 'Send Mail',
    cardSubtitle: 'Direct email for inquiries & roles',
    cardBadge: 'Drop a Message',
    href: mailtoHref,
    webHref: gmailComposeUrl,
    displayHandle: email,
    shortHandle: email,
    isExternal: false,
    copyValue: email,
  };
}

/**
 * Returns all three formatted social buttons in order: GitHub, LinkedIn, Gmail.
 */
export function getFormattedSocialButtons(config: SocialProfileConfig): FormattedSocialButton[] {
  return [
    formatGitHubButton(config.github),
    formatLinkedInButton(config.linkedin),
    formatGmailButton(config.email),
  ];
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  fax?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (input.fax && input.fax.trim().length > 0) {
    return { valid: false, errors: { fax: 'Spam detected' } };
  }

  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const subject = (input.subject || '').trim();
  const message = (input.message || '').trim();

  if (name.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (subject.length < 3) {
    errors.subject = 'Please enter a subject (at least 3 characters).';
  }
  if (message.length < 10) {
    errors.message = 'Please enter your message (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
