import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

import { BlogEntryPreview } from '../../core/service/blog/blog.service';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, TranslatePipe],
  styleUrl: './blog-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (this.blogEntry() === null) {
      <p>{{ 'BLOG_CARD.ERROR' | translate }}</p>
    } @else {
      <mat-card
        class="blog-card"
        appearance="outlined"
        (click)="onClickBlogEntry()"
      >
        <p>{{ this.blogEntry()!.id }}</p>
        <mat-card-header>
          <mat-card-title>{{ this.blogEntry()!.title }}</mat-card-title>
          <mat-card-subtitle>{{ this.blogEntry()!.author }}</mat-card-subtitle>
        </mat-card-header>
        <img
          mat-card-image
          [src]="
            this.blogEntry()!.headerImageUrl !== '' &&
            typeof this.blogEntry()!.headerImageUrl === 'string'
              ? this.blogEntry()!.headerImageUrl
              : 'https://picsum.photos/seed/' + this.blogEntry().id + '/348/300'
          "
          alt="Missing Picture"
        />
        <mat-card-content>
          <p>{{ this.blogEntry()!.contentPreview }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button matButton>{{ 'BLOG_CARD.LIKE' | translate }}</button>
          <button matButton>{{ 'BLOG_CARD.SHARE' | translate }}</button>
        </mat-card-actions>
      </mat-card>
    }
  `,
})
export class BlogCardComponent {
  // Deklaration des Input-Signals
  blogEntry = input.required<BlogEntryPreview>();

  // Deklaration des Output-Signals
  blogId = output<number>();

  onClickBlogEntry() {
    // Zugriff auf den Signal-Wert
    const blogEntryValue = this.blogEntry();
    if (blogEntryValue?.id) {
      // Senden des Events
      this.blogId.emit(blogEntryValue.id);
    }
  }
}
