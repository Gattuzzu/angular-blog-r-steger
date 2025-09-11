import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-blog',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Blog hinzufügen</h1>
    <p>Das ist eine Dummy Seite.</p>
    <button [routerLink]="['/blog/']">Zurück</button>
  `,
  styleUrl: './add-blog.component.scss',
})
export default class BlogDetailComponent {}
