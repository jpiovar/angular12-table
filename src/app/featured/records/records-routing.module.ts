import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './containers/table/table.component';

const routes: Routes = [
  { path: 'table', component: TableComponent, data: { page: 'table', label: 'table'} },
  // { path: 'table', pathMatch: 'full', redirectTo: 'table'},
  { path: '', component: TableComponent, data: { page: 'table', label: 'table'} },
  { path: '**', component: TableComponent, data: { page: 'table', label: 'table'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule { }
