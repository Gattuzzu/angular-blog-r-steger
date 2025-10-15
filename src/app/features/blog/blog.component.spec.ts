import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, RouterLink, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import {
  BlogEntryPreview,
  BlogService,
} from '../../core/service/blog/blog.service';
import BlogComponent from './blog.component';
import { Authentication } from '../../core/auth';
import { StateHandler } from '../../core/state-management/appstate.service';

// Hilfskonstante für den BlogService Mock, da er in allen Tests konstant ist
const MOCK_BLOG_SERVICE_VALUE = {
  blogs: () => [
    {
      id: 1,
      title: 'A title',
      contentPreview: 'Das ist die Vorschau...',
      headerImageUrl: '',
      author: 'a author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview,
    {
      id: 2,
      title: 'B title',
      contentPreview: 'Das ist die Vorschau2...',
      headerImageUrl: '',
      author: 'b author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview,
  ],
  loading: () => false,
  error: () => null,
  rxGetBlogs: () => null,
};

// Hilfskonstante für den vollständigen Authentication Mock
const MOCK_AUTH_DEFAULT_VALUE = {
  isAuthenticated: () => false,
  login: () => null,
  logout: () => null,
};

// Hilfskonstante für den vollständigen StateHandler Mock
const MOCK_STATE_HANDLER_PROVIDER = {
  isHandset: () => false,
};

describe('BlogOverview', () => {
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),

        { provide: BlogService, useValue: MOCK_BLOG_SERVICE_VALUE },
        { provide: Authentication, useValue: MOCK_AUTH_DEFAULT_VALUE },
        { provide: StateHandler, useValue: MOCK_STATE_HANDLER_PROVIDER },
      ],
      imports: [BlogComponent, BlogCardComponent, RouterLink],
    });
  });

  it('is Loading', () => {
    TestBed.overrideProvider(BlogService, {
      useValue: {
        ...MOCK_BLOG_SERVICE_VALUE,
        loading: () => true,
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const blog = fixture.debugElement.query(By.css('app-blog-card'));

    const loader = fixture.debugElement.query(By.css('.loader'));

    expect(blog).toBeNull();
    expect(loader).toBeTruthy();
  });

  it('shows error', () => {
    TestBed.overrideProvider(BlogService, {
      useValue: {
        ...MOCK_BLOG_SERVICE_VALUE,
        error: () => 'error A',
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const error = fixture.debugElement
      .query(By.css('p'))
      .nativeElement.textContent.trim();

    expect(error).toBe('error A');
  });

  it('has correct amount of cards', () => {
    fixture = TestBed.createComponent(BlogComponent);

    fixture.detectChanges();

    const bloglist = fixture.debugElement.queryAll(By.css('app-blog-card'));

    expect(bloglist.length).toBe(2);
  });

  it('is not authenticated', () => {
    TestBed.overrideProvider(Authentication, {
      useValue: {
        ...MOCK_AUTH_DEFAULT_VALUE,
        isAuthenticated: () => false,
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.blog-container > button'),
    );

    expect(button).toBeNull();
  });

  it('is authenticated', () => {
    TestBed.overrideProvider(Authentication, {
      useValue: {
        ...MOCK_AUTH_DEFAULT_VALUE,
        isAuthenticated: () => true,
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.blog-container > button'),
    );

    expect(button).toBeTruthy();
  });

  it('is handset mode', () => {
    TestBed.overrideProvider(Authentication, {
      useValue: {
        ...MOCK_AUTH_DEFAULT_VALUE,
        isAuthenticated: () => true,
      },
    });
    TestBed.overrideProvider(StateHandler, {
      useValue: {
        ...MOCK_STATE_HANDLER_PROVIDER,
        isHandset: () => true,
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.blog-container > button'),
    );
    const buttonText = button.nativeElement.textContent.trim();

    expect(buttonText).toBe('+');
  });

  it('is not handset mode', () => {
    TestBed.overrideProvider(Authentication, {
      useValue: {
        ...MOCK_AUTH_DEFAULT_VALUE,
        isAuthenticated: () => true,
      },
    });

    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.blog-container > button'),
    );
    const buttonText = button.nativeElement.textContent.trim();

    expect(buttonText).toBe('Neuer Blog');
  });

  it('routs to blog detail view', () => {
    fixture = TestBed.createComponent(BlogComponent);
    fixture.detectChanges();

    const routerMock = TestBed.inject(Router);
    const navigateSpy = spyOn(routerMock, 'navigateByUrl');

    const bloglist = fixture.debugElement.queryAll(By.css('app-blog-card'));
    bloglist[1].children[0].nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/blog/2');
  });
});
