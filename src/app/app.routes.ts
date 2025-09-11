import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';

// import { BlogComponent } from './blog/blog.component'; // Wird nur bei Eager Loading benötigt
// import { CalculatorComponent } from './calculator/calculator.component'; // Wird nur bei Eager Loading benötigt
// import { BlogDetailComponent } from './blog-detail/blog-detail.component'; // Wird nur bei Eager Loading benötigt
import { blogDetailResolver } from './core/service/blog-detail-resolve/blog-detail-resolve.service';
import { StateHandler } from './core/state-management/appstate.service';

const authGuard: CanActivateFn = async () => {
  const stateHandler = inject(StateHandler);
  const roles = await stateHandler.authState().roles();
  return (
    stateHandler.authState().isAuthenticated() &&
    (roles?.includes('user') ? true : (stateHandler.authState().login(), false))
  );
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/blog',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    // component: BlogComponent,
    loadComponent: () => import('./features/blog/blog.component'),
  },
  {
    path: 'add-blog',
    // component: BlogComponent,
    loadComponent: () => import('./features/add-blog/add-blog.component'),
    canActivate: [authGuard],
  },
  {
    path: 'blog/:id',
    // component: BlogDetailComponent, // Wird nicht mehr benötig, da dies Eager Loading ist.
    resolve: { data: blogDetailResolver },
    loadComponent: () => import('./features/blog-detail/blog-detail.component'),
  },
  {
    path: 'calculator',
    // component: CalculatorComponent, // Wird nicht mehr benötig, da dies Eager Loading ist.
    loadComponent: () => import('./features/calculator/calculator.component'), // Lazy Loading aktivieren // das .then ist obsolet, wenn man die Klasse als default export macht
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
