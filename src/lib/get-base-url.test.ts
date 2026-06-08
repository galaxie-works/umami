import { expect, test } from 'vitest';
import { HOMEPAGE_URL } from './constants';
import { getAuthLinkBaseUrl, getBaseUrl } from './get-base-url';

function createHeaders(entries: Record<string, string>) {
  return {
    get(name: string) {
      return entries[name.toLowerCase()] ?? null;
    },
  };
}

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

test('prefers forwarded host and protocol', () => {
  const url = getBaseUrl(
    createHeaders({
      'x-forwarded-host': 'umami.is',
      'x-forwarded-proto': 'https',
      host: 'localhost:3000',
    }),
  );

  expect(url.toString()).toBe('https://umami.is/');
});

test('falls back to host header', () => {
  const url = getBaseUrl(
    createHeaders({
      host: 'analytics.example.com',
    }),
  );

  expect(url.toString()).toBe('https://analytics.example.com/');
});

test('uses http for localhost hosts', () => {
  const url = getBaseUrl(
    createHeaders({
      host: 'localhost:3000',
    }),
  );

  expect(url.toString()).toBe('http://localhost:3000/');
});

test('falls back to homepage when host is missing', () => {
  const url = getBaseUrl(createHeaders({}));

  expect(url.toString()).toBe(`${HOMEPAGE_URL}/`);
});

test('uses configured public origin for auth links', () => {
  const previous = process.env.AUTH_PUBLIC_BASE_URL;

  process.env.AUTH_PUBLIC_BASE_URL = 'https://analytics.example.com';

  try {
    const url = getAuthLinkBaseUrl();

    expect(url.toString()).toBe('https://analytics.example.com/');
  } finally {
    restoreEnv('AUTH_PUBLIC_BASE_URL', previous);
  }
});

test('does not use request headers for auth links', () => {
  const previous = process.env.AUTH_PUBLIC_BASE_URL;

  process.env.AUTH_PUBLIC_BASE_URL = 'https://login.example.com';

  try {
    const headerStore = createHeaders({
      'x-forwarded-host': 'evil.example.net',
      'x-forwarded-proto': 'https',
      host: 'localhost:3000',
    });
    const url = getAuthLinkBaseUrl();

    expect(headerStore.get('x-forwarded-host')).toBe('evil.example.net');
    expect(url.toString()).toBe('https://login.example.com/');
  } finally {
    restoreEnv('AUTH_PUBLIC_BASE_URL', previous);
  }
});

test('falls back to homepage for auth links when configured origin is invalid', () => {
  const previous = process.env.AUTH_PUBLIC_BASE_URL;

  process.env.AUTH_PUBLIC_BASE_URL = 'javascript:alert(1)';

  try {
    const url = getAuthLinkBaseUrl();

    expect(url.toString()).toBe(`${HOMEPAGE_URL}/`);
  } finally {
    restoreEnv('AUTH_PUBLIC_BASE_URL', previous);
  }
});
