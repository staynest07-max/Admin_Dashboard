import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AuthPrincipal } from '../../contracts/auth';
import { dashboardPath, isAdminRole, navigateToPrincipalDashboard } from './routing';

const principal = (role: AuthPrincipal['role']): AuthPrincipal => ({
  accountId: 'account',
  role,
  sessionId: 'session',
});

describe('dashboard routing', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['MERCHANT', '/merchant'],
    ['ADMIN', '/admin'],
    ['SUPER_ADMIN', '/admin'],
  ] as const)('maps %s to %s', (role, path) => {
    expect(dashboardPath(role)).toBe(path);
  });

  it.each([
    ['ADMIN', true],
    ['SUPER_ADMIN', true],
    ['MERCHANT', false],
  ] as const)('identifies %s admin access', (role, expected) => {
    expect(isAdminRole(role)).toBe(expected);
  });

  it('redirects an admin principal away from the merchant route', () => {
    const replaceState = vi.fn();
    vi.stubGlobal('window', {
      location: { pathname: '/merchant' },
      history: { replaceState },
    });

    navigateToPrincipalDashboard(principal('ADMIN'));

    expect(replaceState).toHaveBeenCalledWith(null, '', '/admin');
  });

  it('preserves an authenticated admin sub-route', () => {
    const replaceState = vi.fn();
    vi.stubGlobal('window', {
      location: { pathname: '/admin/accounts' },
      history: { replaceState },
    });

    navigateToPrincipalDashboard(principal('SUPER_ADMIN'));

    expect(replaceState).not.toHaveBeenCalled();
  });
});
