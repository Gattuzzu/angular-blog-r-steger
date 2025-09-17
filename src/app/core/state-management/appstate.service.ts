import { computed, inject, Injectable, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Dispatcher } from '../dispatcher.service';

export enum AppStates {
  onBlogOverview = 'onBlogOverview',
  onBlogDetail = 'onBlogDetail',
  onBlogCreate = 'onBlogCreate',
  onCalculator = 'onCalculator',
  onAddBlog = 'onAddBlog',
  onUnknown = 'onUnknown',
}

// Definieren Sie den Initialen Zustand
interface AppState {
  page: AppStates;
  isLoading: boolean;
}

const initialState: AppState = {
  page: AppStates.onUnknown,
  isLoading: false,
};

@Injectable({
  providedIn: 'root',
})
export class StateHandler {
  private dispatcher = inject(Dispatcher);
  readonly router = inject(Router);
  readonly stateSignal = signal<AppState>(initialState);

  // Signal, das den aktuellen Zustand darstellt
  // über diese erfolgt der Zugriff von aussen
  // Selektoren
  public readonly actPage = computed(() => this.stateSignal().page);
  public readonly isLoading = computed(() => this.stateSignal().isLoading);

  constructor() {
    this.router.events.subscribe((/* event */) => {
      if (this.router.url.match('/blog/[0-9]+')) {
        this.setActPageState(AppStates.onBlogDetail);
      } else if (this.router.url.match('/blog')) {
        this.setActPageState(AppStates.onBlogOverview);
      } else if (this.router.url.match('/calculator')) {
        this.setActPageState(AppStates.onCalculator);
      } else if (this.router.url.match('/add-blog')) {
        this.setActPageState(AppStates.onAddBlog);
      } else {
        this.setActPageState(AppStates.onUnknown);
      }

      console.log(this.actPage() + ' | ' + this.router.url);
    });

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.setLoadingState(true);
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.setLoadingState(false);
          break;
        }
      }
    });
  }

  setActPageState(newState: AppStates) {
    this.stateSignal.update((actState) => ({ ...actState, page: newState }));
  }

  setLoadingState(value: boolean) {
    this.stateSignal.update((state) => ({ ...state, isLoading: value }));
  }
}
