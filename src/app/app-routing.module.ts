import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './featured/records/containers/page-not-found/page-not-found.component';

const routes: Routes = [
  // { path: 'home', loadChildren: () => import('./featured/home/home.module').then(m => m.HomeModule) },
  { path: 'page-not-found', component: PageNotFoundComponent, data: { page: 'page-not-found', label: 'Stranka nenajdena'} },
  { path: 'records', loadChildren: () => import('./featured/records/records.module').then(m => m.RecordsModule) },
  { path: '', pathMatch: 'full', loadChildren: () => import('./featured/records/records.module').then(m => m.RecordsModule) },
  { path: '**', component: PageNotFoundComponent, data: { page: 'page-not-found', label: 'Stranka nenajdena'} }

];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
