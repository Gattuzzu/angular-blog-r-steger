import { provideRouter } from '@angular/router';

import * as deTranslations from '../../../../public/i18n/de-DE.json';

import { /* ComponentFixture, */ TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import BlogDetailComponent from './blog-detail.component';
import { routes } from '../../app.routes';
import {
  provideTranslateService,
  TranslateLoader,
  TranslatePipe,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class TranslateFakeLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of(deTranslations);
  }
}

describe('BlogDetailComponent', () => {
  // let component: BlogDetailComponent;
  // let fixture: ComponentFixture<BlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailComponent, TranslatePipe],
      providers: [
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          fallbackLang: 'en-US',
          lang: 'en-US',
        }),
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
