import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SOCIAL_CONFIG,
  formatGitHubButton,
  formatLinkedInButton,
  formatGmailButton,
  getFormattedSocialButtons,
  validateContactForm,
} from './socialFormatter';

test('DEFAULT_SOCIAL_CONFIG contains Sajjatul Alam exact links and assets', () => {
  assert.equal(DEFAULT_SOCIAL_CONFIG.github, 'https://github.com/Sajjad1912');
  assert.equal(
    DEFAULT_SOCIAL_CONFIG.linkedin,
    'https://www.linkedin.com/in/sajjatul-alam-bhuiyan'
  );
  assert.equal(DEFAULT_SOCIAL_CONFIG.email, 'sajjatulsunny@gmail.com');
  assert.equal(DEFAULT_SOCIAL_CONFIG.cvUrl, '/assets/aistudio/Sajjad_dec47f9b.pdf');
  assert.equal(DEFAULT_SOCIAL_CONFIG.photoUrl, '/assets/aistudio/Sajjad_786d1e19.jpg');
});

test('formatGitHubButton formats username and full URLs properly', () => {
  const fromUser = formatGitHubButton('Sajjad1912');
  assert.equal(fromUser.href, 'https://github.com/Sajjad1912');
  assert.equal(fromUser.displayHandle, 'github.com/Sajjad1912');
  assert.equal(fromUser.shortHandle, '@Sajjad1912');
  assert.equal(fromUser.label, 'GitHub');

  const fromUrl = formatGitHubButton('https://github.com/Sajjad1912/');
  assert.equal(fromUrl.href, 'https://github.com/Sajjad1912');
  assert.equal(fromUrl.displayHandle, 'github.com/Sajjad1912');
  assert.equal(fromUrl.shortHandle, '@Sajjad1912');
});

test('formatLinkedInButton formats slug and full LinkedIn URLs properly', () => {
  const fromSlug = formatLinkedInButton('sajjatul-alam-bhuiyan');
  assert.equal(fromSlug.href, 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan');
  assert.equal(fromSlug.displayHandle, 'linkedin.com/in/sajjatul-alam-bhuiyan');
  assert.equal(fromSlug.label, 'LinkedIn');

  const fromUrl = formatLinkedInButton('https://www.linkedin.com/in/sajjatul-alam-bhuiyan/');
  assert.equal(fromUrl.href, 'https://www.linkedin.com/in/sajjatul-alam-bhuiyan');
  assert.equal(fromUrl.shortHandle, 'in/sajjatul-alam-bhuiyan');
});

test('formatGmailButton formats raw email or username into Gmail web compose links', () => {
  const fromEmail = formatGmailButton('sajjatulsunny@gmail.com');
  assert.equal(
    fromEmail.href,
    'https://mail.google.com/mail/?view=cm&fs=1&to=sajjatulsunny%40gmail.com'
  );
  assert.equal(fromEmail.href, fromEmail.webHref);
  assert.equal(fromEmail.displayHandle, 'sajjatulsunny@gmail.com');
  assert.equal(fromEmail.label, 'Gmail');
  assert.equal(fromEmail.isExternal, true);

  const fromUsername = formatGmailButton('sajjatulsunny');
  assert.equal(
    fromUsername.href,
    'https://mail.google.com/mail/?view=cm&fs=1&to=sajjatulsunny%40gmail.com'
  );
  assert.equal(fromUsername.copyValue, 'sajjatulsunny@gmail.com');
});

test('getFormattedSocialButtons returns all 3 buttons in order with hidden-link card subtitles', () => {
  const list = getFormattedSocialButtons({
    github: 'sajjatul-alam',
    linkedin: 'sajjatul-alam',
    email: 'sajjatulsunny@gmail.com',
  });
  assert.equal(list.length, 3);
  assert.deepEqual(
    list.map((b) => b.id),
    ['github', 'linkedin', 'gmail']
  );
  // Ensure cardSubtitle never exposes raw URLs or email addresses
  for (const item of list) {
    assert.equal(item.cardSubtitle.includes('http'), false);
    assert.equal(item.cardSubtitle.includes('@'), false);
    assert.equal(item.cardSubtitle.includes('.com'), false);
    assert.ok(item.href.length > 0);
  }
});

test('validateContactForm enforces field rules and honeypot check', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'bad-email',
    subject: 'Hi',
    message: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Sajjatul Alam',
    email: 'sajjatulsunny@gmail.com',
    subject: 'Internship Opportunity',
    message: 'Hello Sajjatul, we would love to discuss an engineering role with you.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
