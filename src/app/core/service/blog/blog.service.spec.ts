import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BlogService } from './blog.service';
import { environment } from '../../../../environments/environment';
import { BlogEntryPreview } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });

    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load a blog entry by id', (done) => {
    const mockBlog = {
      id: 1,
      title: 'Test Blog',
      content: 'Hello World',
      author: 'John Doe',
      createdAt: '2024-01-01',
      likes: 5,
      comments: [],
      createdByMe: false,
      likedByMe: false,
      updatedAt: '2024-01-01',
    };

    service.loadBlogById('1').subscribe((result) => {
      expect(result).toEqual(mockBlog);
      expect(service.blogDetail()?.id).toBe(1);
      done();
    });

    const req = httpMock.expectOne(`${environment.serviceUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockBlog);
  });

  it('should handle error when loading blog by id fails', (done) => {
    service.loadBlogById('1').subscribe((result) => {
      expect(result).toBeNull();
      expect(service.errorDetail()).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${environment.serviceUrl}/1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch blogs and update state', fakeAsync(() => {
    const mockBlogs: BlogEntryPreview[] = [
      {
        id: 1,
        title: 'A Blog',
        contentPreview: 'Preview text',
        headerImageUrl: 'https://example.com/image.jpg',
        author: 'Tester',
        createdAt: '2024-01-01',
        likes: 0,
      },
    ];

    service.rxGetBlogs({ searchString: 'test' });

    // WICHTIG: tick(250) muss vor expectOne() stehen, um die debounceTime(200) zu überwinden.
    tick(250);

    const req = httpMock.expectOne(
      (request) =>
        request.url === environment.serviceUrl &&
        request.params.get('searchstring') === 'test',
    );

    expect(req.request.method).toBe('GET');
    req.flush({ data: mockBlogs });

    tick();

    expect(service.blogs().length).toBe(1);
    expect(service.loading()).toBeFalse();
  }));

  it('should set error state if blogs request fails', fakeAsync(() => {
    service.rxGetBlogs({ searchString: '' });
    tick(250);

    const req = httpMock.expectOne(`${environment.serviceUrl}`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(service.error()).toBeTruthy();
    expect(service.blogs().length).toBe(0);
  }));
});
