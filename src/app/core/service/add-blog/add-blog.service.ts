import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';
import { environment } from '../../../../environments/environment';

// Zod Schema für Validierung
const CreatedBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

@Injectable({
  providedIn: 'root',
})
export class AddBlogService {
  private httpClient = inject(HttpClient);

  async addBlog(blog: CreatedBlog): Promise<object> {
    // Daten vor dem Senden validieren
    CreatedBlogSchema.parse(blog);

    // HTTP POST Request
    return lastValueFrom(
      this.httpClient.post(`${environment.serviceUrl}`, blog),
    );
  }
}
