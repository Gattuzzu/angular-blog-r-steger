import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCardComponent } from './blog-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { BlogEntryPreview } from '../../core/service/blog/blog.service';

describe('BlogCard', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;
  let routerMock: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        BlogCardComponent,
      ],
    });
    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;
    routerMock = TestBed.inject(Router);
    routerMock.initialNavigation();
  });

  it('should create', () => {
    // arrange
    fixture.componentRef.setInput('blogEntry', {
      id: 1,
      title: 'A title',
      contentPreview: 'Das ist die Vorschau...',
      headerImageUrl: '',
      author: 'a author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview);

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('show correct author', () => {
    fixture.componentRef.setInput('blogEntry', {
      id: 1,
      title: 'A title',
      contentPreview: 'Das ist die Vorschau...',
      headerImageUrl: '',
      author: 'a author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview);

    fixture.detectChanges();

    const author = fixture.debugElement.query(
      By.css('mat-card-subtitle'),
    ).nativeElement;
    expect(author.innerText).toBe('a author');
  });

  it('show correct card-title', () => {
    fixture.componentRef.setInput('blogEntry', {
      id: 1,
      title: 'A title',
      contentPreview: 'Das ist die Vorschau...',
      headerImageUrl: '',
      author: 'a author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview);

    fixture.detectChanges();

    const title = fixture.debugElement.query(
      By.css('mat-card-title'),
    ).nativeElement;
    expect(title.innerText).toBe('A title');
  });

  it('show correct card-preview', () => {
    fixture.componentRef.setInput('blogEntry', {
      id: 1,
      title: 'A title',
      contentPreview: 'Das ist die Vorschau...',
      headerImageUrl: '',
      author: 'a author',
      createdAt: '',
      likes: 0,
    } as BlogEntryPreview);

    fixture.detectChanges();

    const title = fixture.debugElement.query(
      By.css('mat-card-content p'),
    ).nativeElement;
    expect(title.innerText).toBe('Das ist die Vorschau...');
  });
});
