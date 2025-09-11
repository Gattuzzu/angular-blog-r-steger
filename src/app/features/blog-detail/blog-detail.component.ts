import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogEntry } from '../../core/service/blog/blog.service';
import { BlogDetailViewComponent } from '../../shared/blog-detail-view/blog-detail-view.component';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, BlogDetailViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="blog-detail">
      <app-blog-detail-view [blog]="blog"></app-blog-detail-view>
      <div class="back">
        <button [routerLink]="['/blog/']">Zurück</button>
      </div>
    </div>
  `,
  styleUrl: './blog-detail.component.scss',
})
export default class BlogDetailComponent {
  blog = inject(ActivatedRoute).snapshot.data['data'] as BlogEntry;
}
