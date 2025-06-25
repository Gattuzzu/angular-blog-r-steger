import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { blogDetailResolver } from './blog-detail-resolve.service';
import { BlogEntry } from '../blog/blog.service';

describe('BlogDetailResolveService', () => {
  let blog: ResolveFn<BlogEntry | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    blog = blogDetailResolver;
  });

  it('should be created', () => {
    expect(blog).toBeTruthy();
  });
});
