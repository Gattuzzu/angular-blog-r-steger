import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogEntry } from '../service/blog/blog.service';
import { Comment } from '../service/blog/blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink],
  template: `
    <div class="blog-detail">
      @if (blog === null) {
        <p>Blog konnte nicht geladen werden.</p>
      } @else {
        <div class="blog-content">
          <div>
            <h1>{{ this.blog.title }}</h1>
            <p>Blog Id: {{ this.blog.id }}</p>
          </div>
          <p class="date">{{ this.blog.createdAt }}</p>
          <!-- Noch css machen -->
          <p>{{ this.blog.content }}</p>
          <div class="end">
            <p class="author">Author: {{ this.blog.author }}</p>
            <div class="likes">
              <img [src]="'images/like.png'" alt="Missing Picture" />
              <p>{{ this.blog.likes }}</p>
            </div>
          </div>
        </div>
        <div class="comments">
          @for (comment of comments; track comment.id) {
            <div class="comment">
              <h2>{{ comment.author }}</h2>
              <p>Comment Id: {{ comment.id }}</p>
              <p>{{ comment.content }}</p>
            </div>
          }
        </div>
      }
      <div class="back">
        <button [routerLink]="['/blog/']">Zurück</button>
      </div>
    </div>
  `,
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  blogId: string | null = null;
  blog: BlogEntry | null = null;
  comments: Comment[] | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.blog = this.route.snapshot.data['data'];
    this.comments = this.blog?.comments ?? null;
  }
}
