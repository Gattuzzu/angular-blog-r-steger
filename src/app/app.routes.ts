import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from './blog/blog.component';
import { CalculatorComponent } from './calculator/calculator.component';

export const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
  { path: '**', redirectTo: '/blog' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
