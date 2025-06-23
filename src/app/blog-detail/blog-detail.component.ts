import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BlogEntry } from '../service/blog.service';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  template: `
    <div class="blog-detail">
      <div class="blog-content">
        @if (blog === null) {
          <p>Blog konnte nicht geladen werden.</p>
        } @else {
          <div>
            <h1>{{ this.blog.title }}</h1>
            <p>Blog Id: {{ this.blog.id }}</p>
          </div>
          <p>{{ this.blog.content }}</p>
          <p class="author">Author: {{ this.blog.author }}</p>
        }
      </div>
    </div>
  `,
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  blogId: string | null = null;
  blog: BlogEntry | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
  ) {}

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    if (this.blogId != null) {
      this.blogService.loadBlog(this.blogId).subscribe({
        next: (loadedBlog) => {
          this.blog = loadedBlog;
          console.log('Blog ' + this.blogId + ' erfolgreich geladen');
        },
        error: (err) => {
          console.error('Fehler beim Laden vom Blog ' + this.blogId);
          console.error(err);
        },
      });
    }
  }
}
