import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BlogService } from '../../core/service/blog/blog.service';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';

@Component({
  selector: 'app-blog',
  imports: [BlogCardComponent],
  styleUrl: './blog.component.scss',
  standalone: true,
  template: `
    <h1>Blog Übersicht</h1>

    @if (blogService.loading()) {
      <p>Lade Daten...</p>
    } @else {
      <div class="blog-container">
        @for (blog of blogs; track blog.id) {
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
export class BlogComponent implements OnInit {
  blogService = inject(BlogService);
  title = 'Blog';

  constructor(private _router: Router) {}

  ngOnInit() {
    this.blogService.loadBlogs();
  }

  get blogs() {
    return this.blogService.blogEntries();
  }

  get isLoading() {
    return this.blogService.loading();
  }

  handleClickOnBlogEntry(blogId: number) {
    this._router.navigate(['/blog/', blogId]);
  }
}
