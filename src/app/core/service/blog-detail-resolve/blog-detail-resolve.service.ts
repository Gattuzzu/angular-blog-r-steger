import { inject } from '@angular/core';
import { BlogEntry, BlogService } from '../blog/blog.service';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';

export const blogDetailResolver: ResolveFn<BlogEntry | null> = (
  route /*, state */,
) => {
  const dateService = inject(BlogService);
  const blogId: string | null = route.paramMap.get('id');
  if (blogId != null) {
    return dateService.loadBlog(blogId);
  }
  return of(null);
};
