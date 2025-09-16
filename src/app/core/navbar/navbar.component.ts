import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HamburgerIconComponent } from './hamburger-icon/hamburger-icon.component';
import { StateHandler } from '../state-management/appstate.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="user">
        @if (authState.isAuthenticated()) {
          <div
            class="circle"
            [title]="
              authState.userData()?.preferred_username +
              '
Rollen:
  ' +
              authState.roles()?.join(
                '
  '
              )
            "
          >
            <span>{{ authState.userData()?.preferred_username[0] }}</span>
          </div>
          <button (click)="authState.logout()">Logout</button>
        } @else {
          <button (click)="authState.login()">Login</button>
        }
      </div>
      <div class="nav-links" [class.open]="isMenuOpen">
        <a [routerLink]="['/blog']" (click)="closeMenu()">Blog</a>
        <a [routerLink]="['/calculator']" (click)="closeMenu()">Rechner</a>
      </div>
      <app-hamburger-icon
        (click)="toggleMenu()"
        [isOpen]="isMenuOpen"
      ></app-hamburger-icon>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
  imports: [HamburgerIconComponent, RouterLink],
})
export class NavbarComponent {
  readonly stateHandler = inject(StateHandler);
  readonly authState = this.stateHandler.authState;

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
