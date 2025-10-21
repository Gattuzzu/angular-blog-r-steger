import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BlogEntry } from '../../core/service/blog/blog.service';

@Component({
  selector: 'app-blog-detail-view',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (blog() === null) {
      <p>{{ 'BLOG_DETAIL_VIEW.ERROR' | translate }}</p>
    } @else {
      <div class="blog-content">
        <div>
          <h1>{{ this.blog()!.title }}</h1>
          <p>
            {{
              'BLOG_DETAIL_VIEW.BLOG_ID' | translate: { id: this.blog()!.id }
            }}
          </p>
        </div>
        <p class="date">{{ this.blog()!.createdAt }}</p>
        <p>{{ this.blog()!.content }}</p>
        <div class="end">
          <p class="author">
            {{
              'BLOG_DETAIL_VIEW.AUTHOR'
                | translate: { author: this.blog()!.author }
            }}
          </p>
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
            <p>
              {{
                'BLOG_DETAIL_VIEW.COMMENT.COMMENT_ID'
                  | translate: { id: comment.id }
              }}
            </p>
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
