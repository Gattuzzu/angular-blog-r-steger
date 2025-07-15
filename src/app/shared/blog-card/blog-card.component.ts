import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BlogEntryPreview } from '../../core/service/blog/blog.service';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule],
  styleUrl: './blog-card.component.scss',
  standalone: true,
  template: `
    @if (this.blogEntry === null) {
      <p>Fehler beim anzeigen von der Blog Vorschau!</p>
    } @else {
      <mat-card
        class="blog-card"
        appearance="outlined"
        (click)="onClickBlogEntry()"
      >
        <p>{{ this.blogEntry.id }}</p>
        <mat-card-header>
          <mat-card-title>{{ this.blogEntry.title }}</mat-card-title>
          <mat-card-subtitle>{{ this.blogEntry.author }}</mat-card-subtitle>
        </mat-card-header>
        <img
          mat-card-image
          [src]="
            this.blogEntry.headerImageUrl !== '' &&
            typeof this.blogEntry.headerImageUrl === 'string'
              ? this.blogEntry.headerImageUrl
              : 'images/pictureNotFound.png'
          "
          alt="Missing Picture"
        />
        <mat-card-content>
          <p>{{ this.blogEntry.contentPreview }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button matButton>LIKE</button>
          <button matButton>SHARE</button>
        </mat-card-actions>
      </mat-card>
    }
  `,
})
export class BlogCardComponent {
  @Input() blogEntry: BlogEntryPreview | null = null;

  @Output() blogId = new EventEmitter<number>();

  onClickBlogEntry() {
    if (this.blogEntry?.id) {
      this.blogId.emit(this.blogEntry.id);
    }
  }
}
