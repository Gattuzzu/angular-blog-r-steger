import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { debounceTime, Subject, tap } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogEntries = signal<BlogEntryPreview[]>([]);

  getBlogsAction = new Subject<BlogEntryPreview>();

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

  constructor() {
    // async action
    this.getBlogsAction.pipe(
      debounceTime(200),
      tap(() => this.setLoadingState()),
    );
  }
}
