import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'spa-blog',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    // useRefreshToken: true,
    silentRenewUrl: window.location.origin + '/silent-renew.html',
    renewTimeBeforeTokenExpiresInSeconds: 10,
    secureRoutes: [environment.serviceUrl],
    logLevel: LogLevel.Debug,
  },
};

// Wichtig ist: https://angular-auth-oidc-client.com/docs/intro
// und vorallem auch das Interceptor: https://angular-auth-oidc-client.com/docs/documentation/interceptors

// mann darf nur einmal auf den OidcSecurityService.checkAuth() machen
