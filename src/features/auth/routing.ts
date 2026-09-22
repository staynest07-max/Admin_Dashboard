import type { AuthPrincipal, PlatformRole } from '../../contracts/auth';

export type DashboardRole = Extract<PlatformRole, 'MERCHANT' | 'ADMIN' | 'SUPER_ADMIN'>;
export type AdminRole = Extract<DashboardRole, 'ADMIN' | 'SUPER_ADMIN'>;

export function isAdminRole(role: PlatformRole): role is AdminRole {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function dashboardPath(role: DashboardRole): '/merchant' | '/admin' {
  return role === 'MERCHANT' ? '/merchant' : '/admin';
}

export function navigateToPrincipalDashboard(principal: AuthPrincipal): void {
  if (principal.role !== 'MERCHANT' && !isAdminRole(principal.role)) {
    return;
  }

  const target = dashboardPath(principal.role);
  const isCurrentDashboard =
    principal.role === 'MERCHANT'
      ? window.location.pathname === '/merchant'
      : window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');

  if (!isCurrentDashboard) {
    window.history.replaceState(null, '', target);
  }
}
