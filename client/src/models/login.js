/**
 * Handle authentication
 */
import createAuth0Client from '@auth0/auth0-spa-js';
import options from './../models/auth0'

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

/**
 * Class used to perform Login on Auth0
 */
class Login {
  constructor() {
    this.isAuthenticated = false
    this.user = null
    this.auth0Client = null
  }

  async init() {
    if (this.auth0Client === null) {
      this.auth0Client = await createAuth0Client({
          ...options,
          client_id: options.clientId,
          redirect_uri: window.location.origin
        });
    }
      try {
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback();

          this.error = null;

          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          DEFAULT_REDIRECT_CALLBACK(appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.loading = false;
      }
  }

  /** Authenticates the user using the redirect method */
  loginWithRedirect(o) {
    return this.auth0Client.loginWithRedirect(o)
  }

  /** Logs the user out and removes their session on the authorization server */
  logout(o) {
    return this.auth0Client.logout(o);
  }

  /** Extract JWT token **/
  async getJWTToken(o) {
    let token = await this.auth0Client.getIdTokenClaims(o);
    if (token){
      return token.__raw;
    }
    // refresh token or re-login
    await this.auth0Client.getTokenSilently(o)
    token = await this.auth0Client.getIdTokenClaims(o);
    return token && token.__raw
  }
}

export default Login
