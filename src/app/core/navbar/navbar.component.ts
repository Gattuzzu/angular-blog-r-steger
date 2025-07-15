import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HamburgerIconComponent } from './hamburger-icon/hamburger-icon.component';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
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
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
