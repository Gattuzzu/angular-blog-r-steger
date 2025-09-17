import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, NavbarComponent],
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
