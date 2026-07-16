import { test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The renderer runs the City search and Current Conditions fetches directly (Approach A).
// index.html's Content-Security-Policy is the renderer's network-egress gate: it must let
// the app reach ONLY the two Open-Meteo hosts and nothing else, and forbid script sources
// that would let injected code run — the exfiltration threat this guards (Seam 5).

const OPEN_METEO_HOSTS = [
  'https://geocoding-api.open-meteo.com',
  'https://api.open-meteo.com',
];

const indexHtml = readFileSync(
  fileURLToPath(new URL('../index.html', import.meta.url)),
  'utf8',
);

function cspDirectives(html: string): Record<string, string[]> {
  const match = html.match(
    /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*content=(["'])([\s\S]*?)\1/i,
  );
  if (!match) throw new Error('no Content-Security-Policy meta tag in index.html');
  const directives: Record<string, string[]> = {};
  for (const part of match[2].split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const [name, ...sources] = tokens;
    directives[name.toLowerCase()] = sources;
  }
  return directives;
}

test('index.html declares a Content-Security-Policy', () => {
  expect(() => cspDirectives(indexHtml)).not.toThrow();
});

test("default-src is locked to the app's own origin", () => {
  expect(cspDirectives(indexHtml)['default-src']).toEqual(["'self'"]);
});

test("script-src is 'self' only — no unsafe-eval, no inline script", () => {
  const scriptSrc = cspDirectives(indexHtml)['script-src'];
  expect(scriptSrc).toEqual(["'self'"]);
  expect(scriptSrc).not.toContain("'unsafe-eval'");
  expect(scriptSrc).not.toContain("'unsafe-inline'");
});

test('connect-src allows exactly the two Open-Meteo hosts and no wildcard', () => {
  const connectSrc = cspDirectives(indexHtml)['connect-src'];
  expect(connectSrc).not.toContain('*');
  expect([...connectSrc].sort()).toEqual([...OPEN_METEO_HOSTS].sort());
});

test('index.html carries no inline <script> (every script has a src)', () => {
  const scriptTags = indexHtml.match(/<script\b[^>]*>/gi) ?? [];
  for (const tag of scriptTags) {
    expect(tag).toMatch(/\bsrc=/i);
  }
});
