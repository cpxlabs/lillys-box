import { getAuthRedirectPath } from '../../src/utils/authRedirect';

describe('getAuthRedirectPath', () => {
  it('redirects unauthenticated users to login from the home route', () => {
    expect(getAuthRedirectPath({ isAuthenticated: false, pathname: '/' })).toBe('/login');
  });

  it('keeps unauthenticated users on the login route', () => {
    expect(getAuthRedirectPath({ isAuthenticated: false, pathname: '/login' })).toBeNull();
  });

  it('redirects authenticated users away from the login route', () => {
    expect(getAuthRedirectPath({ isAuthenticated: true, pathname: '/login' })).toBe('/');
  });

  it('does not redirect authenticated users away from app routes', () => {
    expect(getAuthRedirectPath({ isAuthenticated: true, pathname: '/game/pet-care' })).toBeNull();
  });
});
