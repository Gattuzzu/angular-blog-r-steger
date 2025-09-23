import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  isHandset: boolean;
}

const initialState: AppState = {
  page: AppStates.onUnknown,
  isLoading: false,
  isHandset: false,
};

@Injectable({
  providedIn: 'root',
})
export class StateHandler {
  destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);
  readonly router = inject(Router);
  readonly stateSignal = signal<AppState>(initialState);

  // Signal, das den aktuellen Zustand darstellt
  // über diese erfolgt der Zugriff von aussen
  // Selektoren
  public readonly actPage = computed(() => this.stateSignal().page);
  public readonly isLoading = computed(() => this.stateSignal().isLoading);
  public readonly isHandset = computed(() => this.stateSignal().isHandset);

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

    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((result) => result.matches),
        shareReplay(),
      )
      .subscribe((isHandset) => {
        this.updateHandset(isHandset);
      });
  }

  setActPageState(newState: AppStates) {
    this.stateSignal.update((actState) => ({ ...actState, page: newState }));
  }

  setLoadingState(value: boolean) {
    this.stateSignal.update((state) => ({ ...state, isLoading: value }));
  }

  updateHandset(value: boolean) {
    this.stateSignal.update((state) => ({ ...state, isHandset: value }));
  }
}
