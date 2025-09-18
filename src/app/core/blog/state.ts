import { computed, inject, Injectable, signal } from '@angular/core';

import { Router } from '@angular/router';
import { Action, ActionType, Dispatcher } from '../dispatcher.service';
import { filter } from 'rxjs';

interface BlogState {
  error: string | undefined;
  isUploading: boolean;
}

const initialState: BlogState = {
  error: undefined,
  isUploading: false,
};

@Injectable({
  providedIn: 'root',
})
export class BlogStore {
  private dispatcher = inject(Dispatcher);
  readonly router = inject(Router);
  readonly stateSignal = signal<BlogState>(initialState);

  // Selektoren
  public readonly error = computed(() => this.stateSignal().error);
  public readonly isUploading = computed(() => this.stateSignal().isUploading);

  constructor() {
    this.dispatcher.action
      .pipe(filter((action) => action.type === ActionType.SET_UPLOADING_STATE))
      .subscribe((action) => {
        const typedAction = action as Action<{ isUploading: boolean }>;
        this.setUploadingState(typedAction.payload!.isUploading);
      });

    this.dispatcher.action
      .pipe(
        filter(
          (action) => action.type === ActionType.SET_UPLOADING_ERROR_STATE,
        ),
      )
      .subscribe((action) => {
        const typedAction = action as Action<{ error: string }>;
        this.setErrorState(typedAction.payload!.error);
      });
  }

  setErrorState(newError: string | undefined) {
    this.stateSignal.update((actState) => ({ ...actState, error: newError }));
  }

  setUploadingState(value: boolean) {
    this.stateSignal.update((actState) => ({
      ...actState,
      isUploading: value,
    }));
  }
}
