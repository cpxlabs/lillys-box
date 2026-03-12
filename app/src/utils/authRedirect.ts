export function getAuthRedirectPath({
  isAuthenticated,
  pathname,
}: {
  isAuthenticated: boolean;
  pathname: string | null;
}) {
  const onLoginPage = pathname === '/login';

  if (!isAuthenticated && !onLoginPage) {
    return '/login';
  }

  if (isAuthenticated && onLoginPage) {
    return '/';
  }

  return null;
}
