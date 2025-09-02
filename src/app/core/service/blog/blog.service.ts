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

@Injectable({
  providedIn: 'root',
})
export class BlogService {
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

  private apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  private http = inject(HttpClient);

  // constructor
  constructor() {
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

  loadBlog(id: string): Observable<BlogEntry | null> {
    return this.http.get<BlogEntry>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        console.log('Empfangene Daten (innerhalb des Pipe-Operators):', res);

        // Validierung
        try {
          BlogEntrySchema.parse(res);
          console.log('Validation passed.');
        } catch (error) {
          if (error instanceof z.ZodError) {
            for (const issue of error.issues) {
              console.error('Validation failed: ', issue.message);
            }
          } else {
            console.error('Validation failed, non Zod error', error);
          }
        }
        return res;
      }),
      catchError((err) => {
        console.error(
          'Fehler beim Laden (innerhalb des catchError-Operators):',
          err,
        );
        return of(null);
      }),
    );
  }
}
