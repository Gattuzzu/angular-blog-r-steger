import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as deTranslations from '../../../../public/i18n/de-DE.json';

import CalculatorComponent from './calculator.component';
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

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent, TranslatePipe],
      providers: [
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          fallbackLang: 'en-US',
          lang: 'en-US',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
