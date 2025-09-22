import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SidebarComponent } from './core/navbar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSlideToggleModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected title = 'angular-blog-r-steger';
  public backgroundRed = false;
  public receivedMessage = '';

  public toggleBackground() {
    this.backgroundRed = !this.backgroundRed;
  }

  onMessageReceived(msg: string) {
    this.receivedMessage = msg;
  }
}
