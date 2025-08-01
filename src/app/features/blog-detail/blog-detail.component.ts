import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogEntry } from '../../core/service/blog/blog.service';
import { Comment } from '../../core/service/blog/blog.service';
import { BlogDetailViewComponent } from '../../shared/blog-detail-view/blog-detail-view.component';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, BlogDetailViewComponent],
  template: `
    <div class="blog-detail">
      <app-blog-detail-view [blog]="this.blog"></app-blog-detail-view>
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
