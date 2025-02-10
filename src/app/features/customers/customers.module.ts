// src/app/features/customers/customers.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService } from './services/customer.service';
import { CustomerListComponent } from './customer-list/customer-list.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    CustomerListComponent
  ],
  providers: [CustomerService],
  exports : [CustomerListComponent]
})
export class CustomersModule { }