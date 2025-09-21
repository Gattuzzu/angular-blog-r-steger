import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddBlogService,
  CreatedBlog,
} from '../../core/service/add-blog/add-blog.service';
import { BlogStore } from '../../core/blog/state';
import { ActionType, Dispatcher } from '../../core/dispatcher.service';
import AddBlogFormComponent from '../../shared/add-blog/add-blog-form.component';
import {
  BlogEntryPreview,
  BlogService,
} from '../../core/service/blog/blog.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [AddBlogFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (this.blogState.isUploading()) {
      <div class="overlay">
        <span class="loader"></span>
      </div>
    }
    <app-add-blog-form
      [formTyped]="formTyped"
      (childSubmit)="onSubmit()"
      (childBack)="onBack()"
    ></app-add-blog-form>
  `,
  styleUrl: './add-blog.component.scss',
})
export default class AddBlogComponent {
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  dispatcher = inject(Dispatcher);

  blogState = inject(BlogStore);
  addBlogService = inject(AddBlogService);
  blogService = inject(BlogService);

  formTyped = new FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern('^[A-Z].*'), // Das Erste Zeichen muss ein Grossbuchstaben sein.
        this.customValidator, // Ein Custom Validator
      ],
      asyncValidators: [this.customAsyncValidator.bind(this)],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
      asyncValidators: [],
    }),
  });

  constructor() {
    // Der Error soll beim Betretten der Seite auf null gesetzt werden, da noch der letzte Error anstehend ist.
    this.dispatchErrorState(null);

    this.formTyped.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('Form value changed: ', value);
      });

    this.formTyped.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        console.log('Form Status changed: ', status);
      }); // Status: VALID, INVALID, PENDING, DISABLED
  }

  async onSubmit() {
    if (this.formTyped.valid) {
      this.dispatchUploadingState(true);

      try {
        const blogData = this.formTyped.value;
        console.log(
          'Form data:\n\t' + blogData.title + '\n\t' + blogData.content,
        );

        // Blog speicher
        await this.addBlogService.addBlog(blogData as CreatedBlog);

        this.formTyped.reset();
        // Den User auf die Blogübersichtseite weiterleiten, beim erfolgriechen speichern
        this.router.navigate(['./blog']);
      } catch (error) {
        this.dispatchErrorState(error);
        console.error('Error submitting blog: ', error);
      } finally {
        this.dispatchUploadingState(false);
      }
    } else {
      this.formTyped.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  onBack() {
    this.router.navigate(['./blog/']);
  }

  customValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.toLowerCase() === 'test') {
      return { custom: true };
    }
    return null;
  }

  customAsyncValidator(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    // Erstellen eines neuen Observable, das die HTTP-Anfrage ausführt
    return of(control.value).pipe(
      debounceTime(200), // warten bis der User nichts mehr eingibt
      distinctUntilChanged(), // ändert der User den Wert, wird die alte Anfrage verworfen
      switchMap((searchString) => {
        // Wenn der Wert leer ist, sofort null zurückgeben
        if (!searchString) {
          return of(null);
        }
        return this.blogService.http
          .get<{ data: BlogEntryPreview[] }>(this.blogService.apiUrl, {
            params: new HttpParams().set('searchstring', String(searchString)),
          })
          .pipe(
            take(1), // Schließt das Observable nach dem ersten Wert ab
            map((res) => {
              // Überprüfen, ob ein Blog-Eintrag mit dem gleichen Titel gefunden wurde
              const blogExists = res.data.some(
                (blog) => blog.title === searchString,
              );
              return blogExists ? { titleExists: true } : null;
            }),
            catchError(() => of(null)), // Bei einem Fehler, die Validierung bestehen lassen
          );
      }),
    );
  }

  dispatchUploadingState(value: boolean) {
    this.dispatcher.dispatch({
      type: ActionType.SET_UPLOADING_STATE,
      payload: { isUploading: value },
    });
  }

  dispatchErrorState(newError: unknown) {
    this.dispatcher.dispatch({
      type: ActionType.SET_UPLOADING_ERROR_STATE,
      payload: { error: newError },
    });
  }
}
