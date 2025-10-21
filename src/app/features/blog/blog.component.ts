import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { BlogService } from '../../core/service/blog/blog.service';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { Authentication } from '../../core/auth';
import { StateHandler } from '../../core/state-management/appstate.service';

@Component({
  selector: 'app-blog',
  imports: [BlogCardComponent, RouterLink, TranslatePipe],
  styleUrl: './blog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ 'BLOG.TITLE' | translate }}</h1>

    @if (loading()) {
      <p>{{ 'BLOG.LOADING' | translate }}</p>
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
          <p>{{ 'BLOG.NO_BLOG_FOUND' | translate }}</p>
        }
        @if (this.authState.isAuthenticated()) {
          @if (this.blogState.isHandset()) {
            <button class="small" [routerLink]="['/add-blog/']">+</button>
          } @else {
            <button [routerLink]="['/add-blog/']">
              {{ 'BLOG.ADD_BLOG' | translate }}
            </button>
          }
        }
      </div>
    }
  `,
})
export default class BlogComponent {
  blogService = inject(BlogService);
  router = inject(Router);
  authState = inject(Authentication);
  blogState = inject(StateHandler);

  filteredBlogs = this.blogService.blogs;
  loading = this.blogService.loading;
  error = this.blogService.error;

  constructor() {
    this.blogService.rxGetBlogs({ searchString: '' });
  }

  handleClickOnBlogEntry(blogId: number) {
    this.router.navigateByUrl(`/blog/${blogId}`);
  }
}
