import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddBlogService,
  CreatedBlog,
} from '../../core/service/add-blog/add-blog.service';
import { BlogStore } from '../../core/blog/state';
import { ActionType, Dispatcher } from '../../core/dispatcher.service';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <h1>Blog hinzufügen</h1>
    <form [formGroup]="formTyped" (ngSubmit)="onSubmit()">
      <div class="blog-input">
        @if (this.blogState.error()) {
          <div class="error-message">
            <mat-icon>error</mat-icon>
            <span
              >Oops, der Blog konnte nicht gespeichert werden. Bitte versuchen
              Sie es später nochmals.</span
            >
          </div>
        }
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input
            matInput
            formControlName="title"
            placeholder="Bitte Titel eingeben."
          />
          <mat-error>
            @if (formTyped.get('title')?.hasError('required')) {
              <span>Der Titel ist ein Pflichtfeld!</span>
            } @else if (formTyped.get('title')?.hasError('minlength')) {
              <span>Der Titel muss mindestens 3 Zeichen beinhalten!</span>
            } @else if (formTyped.get('title')?.hasError('maxlength')) {
              <span>Der Titel darf maximal 100 Zeichen beinhalten!</span>
            } @else if (formTyped.get('title')?.hasError('pattern')) {
              <span>Der Titel muss mit einem Grossbuchstaben beginnen!</span>
            } @else if (formTyped.get('title')?.hasError('custom')) {
              <span>Der Titel darf nicht "Test" sein!</span>
            }
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Text</mat-label>
          <textarea
            matInput
            rows="20"
            formControlName="content"
            placeholder="Bitte Text eingeben."
          ></textarea>
          <mat-error>
            @if (formTyped.get('content')?.hasError('required')) {
              <span>Der Text ist ein Pflichtfeld!</span>
            } @else if (formTyped.get('content')?.hasError('minlength')) {
              <span>Der Text muss mindestens 10 Zeichen beinhalten!</span>
            }
          </mat-error>
        </mat-form-field>
        <div class="button-group">
          <button
            type="reset"
            mat-raised-button
            [disabled]="this.blogState.isUploading()"
            color="secondary"
          >
            Reset Form
          </button>
          <button
            type="submit"
            class="submit-button"
            mat-raised-button
            [disabled]="formTyped.invalid || this.blogState.isUploading()"
            color="primary"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
    <button [routerLink]="['/blog/']">Zurück</button>
  `,
  styleUrl: './add-blog.component.scss',
})
export default class AddBlogComponent {
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  dispatcher = inject(Dispatcher);

  blogState = inject(BlogStore);
  addBlogService = inject(AddBlogService);

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
      asyncValidators: [],
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

  customValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.toLowerCase() === 'test') {
      return { custom: true };
    }
    return null;
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
