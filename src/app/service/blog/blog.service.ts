import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export interface BlogEntryPreview {
  id: number;
  title: string;
  contentPreview: string;
  headerImageUrl: string;
  author: string;
  createdAt: string;
  likes: number;
}

export interface BlogEntry {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: [];
  createdByMe: boolean;
  likedByMe: boolean;
  updatedAt: string;
}

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
        this.blogEntries.set(res.data);
        this.loading.set(false);
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
