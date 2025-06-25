import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { BlogService } from '../service/blog/blog.service';

@Component({
  selector: 'app-blog',
  imports: [RouterModule, RouterLink, MatCardModule],
  styleUrl: './blog.component.scss',
  standalone: true,
  template: `
    <h1>Blog Übersicht</h1>

    @if (blogService.loading()) {
      <p>Lade Daten...</p>
    } @else {
      <div class="blog-container">
        @for (blog of blogs; track blog.id) {
          <mat-card
            class="blog-card"
            appearance="outlined"
            [routerLink]="['/blog/', blog.id]"
          >
            <p>{{ blog.id }}</p>
            <mat-card-header>
              <mat-card-title>{{ blog.title }}</mat-card-title>
              <mat-card-subtitle>{{ blog.author }}</mat-card-subtitle>
            </mat-card-header>
            <img
              mat-card-image
              [src]="
                blog.headerImageUrl !== '' &&
                typeof blog.headerImageUrl === 'string'
                  ? blog.headerImageUrl
                  : 'images/pictureNotFound.png'
              "
              alt="Missing Picture"
            />
            <mat-card-content>
              <p>{{ blog.contentPreview }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button matButton>LIKE</button>
              <button matButton>SHARE</button>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p>Keine Blogeinträge vorhanden.</p>
        }
      </div>
    }
  `,
})
export class BlogComponent implements OnInit {
  blogService = inject(BlogService);
  title = 'Blog';

  ngOnInit() {
    this.blogService.loadBlogs();
  }

  get blogs() {
    return this.blogService.blogEntries();
  }

  get isLoading() {
    return this.blogService.loading();
  }
}
