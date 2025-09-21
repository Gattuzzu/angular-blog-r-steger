import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogStore } from '../../core/blog/state';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-blog-form',
  imports: [
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  styleUrl: './add-blog-form.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <!-- Dieses Font wird für das <mat-icon> benötigt-->
    <h1>Blog hinzufügen</h1>
    <form [formGroup]="formTyped()" (ngSubmit)="onSubmit()">
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
            @if (formTyped().get('title')?.hasError('required')) {
              <span>Der Titel ist ein Pflichtfeld!</span>
            } @else if (formTyped().get('title')?.hasError('minlength')) {
              <span>Der Titel muss mindestens 3 Zeichen beinhalten!</span>
            } @else if (formTyped().get('title')?.hasError('maxlength')) {
              <span>Der Titel darf maximal 100 Zeichen beinhalten!</span>
            } @else if (formTyped().get('title')?.hasError('pattern')) {
              <span>Der Titel muss mit einem Grossbuchstaben beginnen!</span>
            } @else if (formTyped().get('title')?.hasError('custom')) {
              <span>Der Titel darf nicht "Test" sein!</span>
            } @else if (formTyped().get('title')?.hasError('titleExists')) {
              <span
                >Der Titel existiert bereits! Bitte anderen Titel
                eingeben.</span
              >
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
            @if (formTyped().get('content')?.hasError('required')) {
              <span>Der Text ist ein Pflichtfeld!</span>
            } @else if (formTyped().get('content')?.hasError('minlength')) {
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
            [disabled]="formTyped().invalid || this.blogState.isUploading()"
            color="primary"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
    <button (click)="goBack()">Zurück</button>
  `,
})
export default class AddBlogFormComponent {
  // Store
  blogState = inject(BlogStore);

  // Inputs
  formTyped = input.required<FormGroup>();

  // Outputs
  childSubmit = output<FormGroup>();
  childBack = output();

  // Methoden um die Outputs zu befeuern
  onSubmit() {
    this.childSubmit.emit(this.formTyped());
  }

  goBack() {
    this.childBack.emit();
  }
}
