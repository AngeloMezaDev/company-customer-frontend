import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './features/companies/company-list/company-list.component';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: 'companies', component: CompanyListComponent },
    { path: 'customers', component: CustomerListComponent },
    { path: '', redirectTo: '/companies', pathMatch: 'full' },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }

