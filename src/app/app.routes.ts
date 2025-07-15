import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { BlogComponent } from './blog/blog.component'; // Wird nur bei Eager Loading benötigt
// import { CalculatorComponent } from './calculator/calculator.component'; // Wird nur bei Eager Loading benötigt
// import { BlogDetailComponent } from './blog-detail/blog-detail.component'; // Wird nur bei Eager Loading benötigt
import { blogDetailResolver } from './service/blog-detail-resolve/blog-detail-resolve.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/blog',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    // component: BlogComponent,
    loadComponent: () =>
      import('./blog/blog.component').then((c) => c.BlogComponent), // Lazy Loading aktivieren
  },
  {
    path: 'blog/:id',
    // component: BlogDetailComponent, // Wird nicht mehr benötig, da dies Eager Loading ist.
    resolve: { data: blogDetailResolver },
    loadComponent: () =>
      import('./blog-detail/blog-detail.component').then(
        (c) => c.BlogDetailComponent,
      ), // Lazy Loading aktivieren
  },
  {
    path: 'calculator',
    // component: CalculatorComponent, // Wird nicht mehr benötig, da dies Eager Loading ist.
    loadComponent: () =>
      import('./calculator/calculator.component').then(
        (c) => c.CalculatorComponent,
      ), // Lazy Loading aktivieren
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
