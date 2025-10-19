import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
}

export const SupportedLanguage = {
  deDE: { code: 'de-DE', name: 'GERMAN' } as Language,
  enEN: { code: 'en-US', name: 'ENGLISH' } as Language,
} as const;

@Injectable({
  providedIn: 'root',
})
export class LangState {
  destroyRef = inject(DestroyRef);
  translateService = inject(TranslateService);
  readonly langStateSignal = signal<Language>(SupportedLanguage.enEN);

  public readonly language = computed(() => this.langStateSignal().code);

  setLanguage(language: Language) {
    this.langStateSignal.set(language);
    this.translateService.use(language.code);
  }
}
