import { Component } from '@angular/core';
import { SidebarComponent } from './core/navbar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected title = 'angular-blog-r-steger';
}
