import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from './blog/blog.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { blogDetailResolver } from './service/blog-detail-resolve/blog-detail-resolve.service';

export const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  {
    path: 'blog/:id',
    component: BlogDetailComponent,
    resolve: { data: blogDetailResolver },
  },
  { path: 'calculator', component: CalculatorComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
