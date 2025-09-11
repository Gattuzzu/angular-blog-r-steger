import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../auth';

export enum AppStates {
  onBlogOverview = 'onBlogOverview',
  onBlogDetail = 'onBlogDetail',
  onBlogCreate = 'onBlogCreate',
  onCalculator = 'onCalculator',
  onUnknown = 'onUnknown',
}

// Definieren Sie den Initialen Zustand
interface AppState {
  state: AppStates;
}

const initialState: AppState = {
  state: AppStates.onUnknown,
};

@Injectable({
  providedIn: 'root',
})
export class StateHandler {
  readonly authentication = signal(inject(Authentication));
  readonly router = inject(Router);
  readonly stateSignal = signal<AppState>(initialState);

  // Signal, das den aktuellen Zustand darstellt
  public readonly actState = computed(() => this.stateSignal().state);
  public readonly authState = computed(() => this.authentication());

  constructor() {
    this.router.events.subscribe((/* event */) => {
      if (this.router.url.match('/blog/[0-9]+')) {
        this.goToView(AppStates.onBlogDetail);
      } else if (this.router.url.match('/blog')) {
        this.goToView(AppStates.onBlogOverview);
      } else if (this.router.url.match('/calculator')) {
        this.goToView(AppStates.onCalculator);
      }

      console.log(this.actState() + ' | ' + this.router.url);
    });
  }

  goToView(newState: AppStates) {
    this.stateSignal.update((actState) => ({ ...actState, state: newState }));
  }
}
