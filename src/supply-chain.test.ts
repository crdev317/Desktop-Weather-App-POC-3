import { test, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The toolchain policy (Technical-Context.MD): every npm dependency is exact-pinned
// and the lockfile is committed, so `npm ci` reproduces the exact tree an agent/CI run
// was proven against. A floating range (^/~/>=/*) lets a transitive-free dependency
// drift between installs — the dependency-substitution/drift threat this guards.

const repoRoot = (relative: string) =>
  fileURLToPath(new URL(`../${relative}`, import.meta.url));

const pkg = JSON.parse(readFileSync(repoRoot('package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

// An exact pin is a bare semver version — no range operator, no wildcard, no tag.
const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

test('every declared dependency is exact-pinned (no ^/~/range/wildcard)', () => {
  const declared = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
  const floating = Object.entries(declared).filter(
    ([, version]) => !EXACT_SEMVER.test(version),
  );
  expect(floating).toEqual([]);
});

test('the committed lockfile exists so npm ci can reproduce the exact tree', () => {
  expect(existsSync(repoRoot('package-lock.json'))).toBe(true);
});
