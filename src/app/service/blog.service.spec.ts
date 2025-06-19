import { TestBed } from '@angular/core/testing';
import { BlogService } from './blog.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), BlogService],
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
