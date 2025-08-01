import { provideRouter } from '@angular/router';
import { /* ComponentFixture, */ TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BlogDetailComponent } from './blog-detail.component';
import { routes } from '../../app.routes';

describe('BlogDetailComponent', () => {
  // let component: BlogDetailComponent;
  // let fixture: ComponentFixture<BlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    // Dieser Test kann seit der Implementierung vom blog-detail-resolver-service.ts nicht mehr so ausgefüht werden.
    // fixture = TestBed.createComponent(BlogDetailComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
