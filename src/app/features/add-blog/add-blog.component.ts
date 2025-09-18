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
