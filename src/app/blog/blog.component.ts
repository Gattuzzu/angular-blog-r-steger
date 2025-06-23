import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from './../service/blog.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [RouterModule],
  styleUrl: './blog.component.scss',
  standalone: true,
  template: `
    <h1>Blog Übersicht</h1>

    @if (blogService.loading()) {
      <p>Lade Daten...</p>
    } @else {
      <div class="blog-container">
        @for (blog of blogs; track blog.id) {
          <article class="blog-entry">
            <img
              [src]="
                blog.headerImageUrl && blog.headerImageUrl !== 'string'
                  ? blog.headerImageUrl
                  : 'assets/images/platzhalter.png'
              "
              alt="Header Image"
            />
            <h2>{{ blog.title }}</h2>
            <p>{{ blog.contentPreview }}</p>
          </article>
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
