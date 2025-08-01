import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hamburger-icon',
  template: `
    <button
      class="hamburger"
      [class.open]="isOpen"
      (click)="toggleMenu.emit()"
      aria-label="Menü umschalten"
    >
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </button>
  `,
  styleUrl: './hamburger-icon.component.scss',
})
export class HamburgerIconComponent {
  @Input() isOpen = false;

  @Output() toggleMenu = new EventEmitter<void>();
}
