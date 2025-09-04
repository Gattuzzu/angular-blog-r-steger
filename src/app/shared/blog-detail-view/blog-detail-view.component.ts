import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { BlogEntry } from '../../core/service/blog/blog.service';

@Component({
  selector: 'app-blog-detail-view',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (blog() === null) {
      <p>Blog konnte nicht geladen werden.</p>
    } @else {
      <div class="blog-content">
        <div>
          <h1>{{ this.blog()!.title }}</h1>
          <p>Blog Id: {{ this.blog()!.id }}</p>
        </div>
        <p class="date">{{ this.blog()!.createdAt }}</p>
        <p>{{ this.blog()!.content }}</p>
        <div class="end">
          <p class="author">Author: {{ this.blog()!.author }}</p>
          <div class="likes">
            <img [src]="'images/like.png'" alt="Missing Picture" />
            <p>{{ this.blog()!.likes }}</p>
          </div>
        </div>
      </div>
      <div class="comments">
        @for (comment of this.blog()!.comments; track comment.id) {
          <div class="comment">
            <h2>{{ comment.author }}</h2>
            <p>Comment Id: {{ comment.id }}</p>
            <p>{{ comment.content }}</p>
          </div>
        }
      </div>
    }
  `,
  styleUrl: './blog-detail-view.component.scss',
})
export class BlogDetailViewComponent {
  blog = input.required<BlogEntry>();
}
