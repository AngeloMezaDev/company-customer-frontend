import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../services/customer.service';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { Customer } from '../models/customer.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomerModalComponent,
    MatIconModule,
    MatTooltipModule
  ],
  styles: [`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .status-cell {
    width: 100px;
  }
  
  .status-active {
    color: #2ecc71;
  }
  
  .status-inactive {
    color: #e74c3c;
  }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
      font-weight: 600;
    }
    
    .btn-add {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }
    
    .btn-add:hover {
      background-color: #2980b9;
    }
    
    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    
    .table th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid #eee;
    }
    
    .table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      color: #34495e;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
    
    .action-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    
    .action-btn:hover {
      background-color: #f8f9fa;
    }
    
    .action-btn.edit mat-icon {
      color: #3498db;
    }
    
    .action-btn.delete mat-icon {
      color: #e74c3c;
    }
    
    tr:hover {
      background-color: #f8f9fa;
    }
  `],
  template: `
    <div class="container">
      <div class="header">
        <h2>Administrador de clientes por compañia</h2>
        <button class="btn-add" (click)="openCreateModal()">
          <mat-icon>add</mat-icon>
          <strong>Añadir</strong>
        </button>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Compañia asociada</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of customers">
              <td>{{ customer.firstName }}</td>
              <td>{{ customer.lastName }}</td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.companyId }}</td>
              <td class="text-center status-cell">
                <mat-icon [ngClass]="{'status-active': customer.isActive === true, 'status-inactive': customer.isActive === false}"
                [matTooltip]="customer.isActive ? 'Habilitado' : 'Deshabilitado'">
                  {{ customer.isActive === true ? 'check_circle' : 'cancel' }}
                </mat-icon>
              </td>
              <td class="text-center">
                <div class="actions">
                  <button class="action-btn edit" (click)="editCustomer(customer)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="action-btn delete" (click)="deleteCustomer(customer.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Customer Modal -->
      <app-customer-modal
  [isVisible]="isModalVisible"
  [isEditing]="isEditing"
  [initialCustomer]="selectedCustomer"
  (modalClose)="closeModal()"
  (customerSaved)="onCustomerSaved($event)"
></app-customer-modal>
    </div>
  `
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  
  // Modal control properties
  isModalVisible = false;
  isEditing = false;
  selectedCustomer?: Customer;

  constructor(private customerService: CustomerService, private snackBar: MatSnackBar,  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (response: any) => {
        // Assuming the API returns a response with a 'content' property
        this.customers = response;
      },
      error: (error) => {
        console.error('Error loading customers', error);
        // TODO: Implement error handling (e.g., show error message)
      }
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedCustomer = undefined;
    this.isModalVisible = true;
  }

  editCustomer(customer: Customer): void {
    this.isEditing = true;
    this.selectedCustomer = { ...customer };
    this.isModalVisible = true;
  }

  deleteCustomer(id?: number): void {
    if (!id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.delete(id).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.id !== id);
            
            // Mostrar el MatSnackBar después de eliminar la compañía
            this.snackBar.open('Cliente eliminado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error eliminando el cliente', error);
            
            // Mostrar el MatSnackBar en caso de error al eliminar la compañía
            this.snackBar.open('Error al eliminar el cliente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.isEditing = false;
    this.selectedCustomer = undefined;
  }

  onCustomerSaved(customer: Customer): void {
    if (this.isEditing) {
      // Update existing customer in the list
      const index = this.customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        this.customers[index] = customer;
      }
    } else {
      // Add new customer to the list
      this.customers.push(customer);
    }
    this.closeModal();
  }
}