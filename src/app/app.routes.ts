import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from './blog/blog.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

export const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
