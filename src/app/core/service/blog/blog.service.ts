import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { z } from 'zod';
import { environment } from '../../../../environments/environment';

export const BlogEntryPreviewSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  contentPreview: z.string(),
  headerImageUrl: z.string().url().optional(),
  author: z.string().min(3).max(100),
  createdAt: z.string(),
  likes: z.number().int().nonnegative(),
});
export type BlogEntryPreview = z.infer<typeof BlogEntryPreviewSchema>;

export const CommentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  author: z.string().min(3).max(10),
  updatedAt: z.string(),
  createdAt: z.string(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const BlogEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  content: z.string(),
  author: z.string().min(3).max(100),
  createdAt: z.string(),
  likes: z.number().int().nonnegative(), // Nur Positiv und 0
  comments: CommentSchema.array(),
  createdByMe: z.boolean(),
  likedByMe: z.boolean(),
  updatedAt: z.string(),
});
export type BlogEntry = z.infer<typeof BlogEntrySchema>;

interface BlogPreviewState {
  isLoading: boolean;
  blogs: BlogEntryPreview[];
  error: Error | null;
}

interface GetBlogsFilter {
  searchString: string;
}

interface BlogDetailState {
  isLoading: boolean;
  blog: BlogEntry | null;
  error: Error | null;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  readonly apiUrl = environment.serviceUrl;

  readonly http = inject(HttpClient);

  // constructor
  constructor() {
    this.createBlogsRequest();
    // this.createBlogDetailRequest(); // Wird nur benötigt, wenn die Abfrage über das Subject gemacht wird
  }

  /* ================================================= 
    BlogPreview
  ================================================= */
  getBlogsAction = new Subject<GetBlogsFilter>();

  // state
  state = signal<BlogPreviewState>({
    isLoading: false,
    blogs: [],
    error: null,
  });

  // selectors
  blogs = computed(() => this.state().blogs);
  loading = computed(() => this.state().isLoading);
  error = computed(() => this.state().error);

  // reducer
  setLoadingState() {
    this.state.update((state) => ({
      ...state,
      isLoading: true,
    }));
  }

  setLoadedBlogs(blogEntrys: BlogEntryPreview[]) {
    this.state.update((state) => ({
      ...state,
      isLoading: false,
      blogs: blogEntrys,
    }));
  }

  setError(error: Error) {
    this.state.update((state) => ({
      ...state,
      isLoading: false,
      error,
    }));
  }

  createBlogsRequest() {
    this.getBlogsAction
      .pipe(
        tap(() => this.setLoadingState()),
        debounceTime(200),
        switchMap((filter) => {
          // Erstellen der HTTP-Parameter basierend auf dem Filterobjekt
          let params = new HttpParams();
          if (filter.searchString) {
            params = params.set('searchstring', filter.searchString);
          }

          return this.http
            .get<{ data: BlogEntryPreview[] }>(this.apiUrl, { params })
            .pipe(
              tap((res) => {
                console.log(res.data);
                // Validierung der Blog Einträge
                res.data.forEach((entry) =>
                  BlogEntryPreviewSchema.parse(entry),
                );
              }),
              catchError((error) => {
                this.setError(error);
                console.log(error);
                return of({ data: [] });
              }),
            );
        }),
      )
      .subscribe({
        next: (res) => {
          this.setLoadedBlogs(res.data);
        },
        error: (error) => this.setError(error),
      });
  }

  // async action
  rxGetBlogs(filter: GetBlogsFilter) {
    this.getBlogsAction.next(filter);
  }

  /* ================================================= 
    Blogdetail
  ================================================= */

  // Die Methode, die das Observable für den Resolver (blog-detail-resolver) zurückgibt.
  loadBlogById(id: string): Observable<BlogEntry | null> {
    this.setLoadingStateDetail(); // Nicht notwendig -> Nur für state überwachung, was die blog-detail-view nicht benötigt, da der Resolver erst auf die neue Seite umschaltet, sobald das Objekt geladen ist.
    return this.http.get<BlogEntry>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        const blogEntry = BlogEntrySchema.parse(res);
        this.setLoadedBlogDetail(blogEntry); // Nicht notwendig, ganzer Map Block könnte durch "map((res) => BlogEntrySchema.parse(res))," ersetzt werden
        return blogEntry;
      }),
      catchError((error) => {
        this.setErrorDetail(error);
        console.error('Fehler beim Laden des Blog-Eintrags:', error);
        return of(null);
      }),
    );
  }

  // Diese Methode nutzt das gleiche Observable wie loadBlogById
  // Wird nur benötigt, wenn die Abfrage über das Subject gemacht wird
  createBlogDetailRequest() {
    this.getBlogDetailAction
      .pipe(
        debounceTime(200),
        switchMap((id) => this.loadBlogById(id)),
      )
      .subscribe();
  }

  // Ihre Signal-basierte Logik bleibt bestehen, wird aber hier nicht direkt vom Resolver genutzt.
  getBlogDetailAction = new Subject<string>();

  // state
  stateDetail = signal<BlogDetailState>({
    isLoading: false,
    blog: null,
    error: null,
  });

  // selectors
  blogDetail = computed(() => this.stateDetail().blog);
  loadingDetail = computed(() => this.stateDetail().isLoading);
  errorDetail = computed(() => this.stateDetail().error);

  // reducer
  setLoadingStateDetail() {
    this.stateDetail.update((state) => ({
      ...state,
      isLoading: true,
    }));
  }

  setLoadedBlogDetail(blogEntry: BlogEntry) {
    this.stateDetail.update((state) => ({
      ...state,
      isLoading: false,
      blog: blogEntry,
    }));
  }

  setErrorDetail(error: Error) {
    this.stateDetail.update((state) => ({
      ...state,
      isLoading: false,
      blog: null,
      error,
    }));
  }

  // async action
  // Wird nur benötigt, wenn die Abfrage über das Subject gemacht wird
  rxGetBlogDetail(id: string) {
    this.getBlogDetailAction.next(id);
  }
}
