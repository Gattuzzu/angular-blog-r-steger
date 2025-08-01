import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogEntries = signal<BlogEntryPreview[]>([]);
  loading = signal(true);

  private apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  private http = inject(HttpClient);

  loadBlogs() {
    this.loading.set(true);
    this.http.get<{ data: BlogEntryPreview[] }>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('Empfangene Daten:', res.data);

        // Validierung
        try {
          res.data.forEach((entry) => BlogEntryPreviewSchema.parse(entry));
          console.log('Validation passed.');
          this.blogEntries.set(res.data);
          this.loading.set(false);
        } catch (error) {
          if (error instanceof z.ZodError) {
            for (const issue of error.issues) {
              console.error('Validation failed: ', issue.message);
            }
          } else {
            console.error('Validation failed, non Zod error', error);
          }
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden:', err);
        this.loading.set(false);
      },
    });
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
