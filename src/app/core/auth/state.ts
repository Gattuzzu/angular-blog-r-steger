import { computed, inject, Injectable } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';

//inital state
const initialState = { isAuthenticated: false } as LoginResponse;

@Injectable({ providedIn: 'root' })
export class Authentication {
  readonly oidcSecurityService = inject(OidcSecurityService);

  // state
  readonly authentication = toSignal(this.oidcSecurityService.checkAuth(), {
    initialValue: initialState,
  });

  // Selektoren
  auth = computed(() => this.authentication());
  isAuthenticated = computed(() => this.authentication().isAuthenticated);
  userData = computed(() => this.authentication().userData);
  token = computed(() => this.authentication().accessToken);

  roles = computed(() => {
    const token = this.token();
    if (!token) return null;

    const decodedToken = JSON.parse(atob(token?.split('.')[1]));
    const roles: string[] = decodedToken?.realm_access?.roles || [];
    return roles;
  });

  // actions
  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    return lastValueFrom(this.oidcSecurityService.logoff());
  }
}
