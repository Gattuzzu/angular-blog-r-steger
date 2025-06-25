import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BlogEntry } from '../service/blog/blog.service';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.blog = this.route.snapshot.data['data'];
  }
}
