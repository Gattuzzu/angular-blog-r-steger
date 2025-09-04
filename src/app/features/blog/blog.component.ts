import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { BlogService } from '../../core/service/blog/blog.service';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';

@Component({
  selector: 'app-blog',
  imports: [BlogCardComponent],
  styleUrl: './blog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Blog Übersicht</h1>

    @if (loading()) {
      <p>Lade Daten...</p>
      <div class="blog-container">
        <span class="loader"></span>
      </div>
    } @else if (error()) {
      <p style="color: red;">{{ error() }}</p>
    } @else {
      <div class="blog-container">
        @for (blog of filteredBlogs(); track blog.id) {
          <app-blog-card
            [blogEntry]="blog"
            (blogId)="handleClickOnBlogEntry($event)"
          ></app-blog-card>
        } @empty {
          <p>Keine Blogeinträge vorhanden.</p>
        }
      </div>
    }
  `,
})
export class BlogComponent {
  blogService = inject(BlogService);
  router = inject(Router);

  filteredBlogs = this.blogService.blogs;
  loading = this.blogService.loading;
  error = this.blogService.error;

  constructor() {
    this.blogService.rxGetBlogs({ searchString: '' });
  }

  handleClickOnBlogEntry(blogId: number) {
    this.router.navigate(['/blog/', blogId]);
  }
}
