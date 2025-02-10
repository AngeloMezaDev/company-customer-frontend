import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { CompanyService } from '../../companies/services/company.service';
import { Customer } from '../models/customer.model';
import { Company } from '../../companies/models/company.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,MatSlideToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-overlay.show {
      display: flex;
    }

    .modal-container {
      background: white;
      border-radius: 8px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control, .form-select {
      width: 100%;
      padding: 0.5rem 0rem; 
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.3s ease;
    }

    .form-control::placeholder {
      padding-left: 0.25rem;
    }
    .form-control {
      text-indent: 0.75rem; 
    }
    .form-control:focus, .form-select:focus {
      outline: none;
      border-color: #3498db;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .modal-footer {
      
      display: flex;
      justify-content: flex-end;
      margin-top:1.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border: none;
    }

    .btn-secondary {
      background-color: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .close-btn {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
    }

    .close-btn:hover {
      color: #333;
    }
    .enabled-toggle {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .enabled-toggle label {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .enabled-toggle mat-slide-toggle {
      margin-left: 0;
    }
  `],
 template: `
 <div class="modal-overlay" [class.show]="isVisible">
   <div class="modal-container">
     <div class="modal-header">
       <h2>{{ isEditing ? 'Editar' : 'Crear' }} Cliente</h2>
       <button class="close-btn" (click)="closeModal()">
         <mat-icon>close</mat-icon>
       </button>
     </div>
     
     <div class="modal-body">
       <form #customerForm="ngForm">
         <div class="form-group">
           <label class="form-label">Compañía*</label>
           <select 
             class="form-select" 
             [(ngModel)]="customerData.companyId" 
             name="companyId" 
             required
             #companySelect="ngModel"
           >
             <option value="">Seleccionar Compañía</option>
             <option 
               *ngFor="let company of companies; trackBy: trackByCompanyId" 
               [ngValue]="company.company_id"
             >
               {{ company.company_name }}
             </option>
           </select>
           <div 
             *ngIf="companySelect.invalid && (companySelect.dirty || companySelect.touched)"
             class="error-message"
           >
             Debe seleccionar una compañía
           </div>
         </div>

         <div class="form-group">
           <label class="form-label">Nombre*</label>
           <input 
             type="text" 
             class="form-control" 
             [(ngModel)]="customerData.firstName" 
             name="firstName" 
             required 
             minlength="2" 
             maxlength="100"
             #firstName="ngModel"
             placeholder="Ingrese el nombre"
           >
           <div 
             *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)"
             class="error-message"
           >
             El nombre debe tener entre 2 y 100 caracteres
           </div>
         </div>

         <div class="form-group">
           <label class="form-label">Apellido*</label>
           <input 
             type="text" 
             class="form-control" 
             [(ngModel)]="customerData.lastName" 
             name="lastName" 
             required 
             minlength="2" 
             maxlength="100"
             #lastName="ngModel"
             placeholder="Ingrese el apellido"
           >
           <div 
             *ngIf="lastName.invalid && (lastName.dirty || lastName.touched)"
             class="error-message"
           >
             El apellido debe tener entre 2 y 100 caracteres
           </div>
         </div>

         <div class="form-group">
           <label class="form-label">Correo Electrónico*</label>
           <input 
             type="email" 
             class="form-control" 
             [(ngModel)]="customerData.email" 
             name="email" 
             required 
             email
             maxlength="100"
             #email="ngModel"
             placeholder="Ingrese el correo electrónico"
           >
           <div 
             *ngIf="email.invalid && (email.dirty || email.touched)"
             class="error-message"
           >
             Ingrese un correo electrónico válido
           </div>
         </div>

         <div class="form-group">
           <label class="form-label">Teléfono*</label>
           <input 
             type="tel" 
             class="form-control" 
             [(ngModel)]="customerData.phone" 
             name="phone"
             required
             #phone="ngModel"
             placeholder="Ingrese el teléfono"
           >
           <div 
             *ngIf="phone.invalid && (phone.dirty || phone.touched)"
             class="error-message"
           >
             El número de teléfono es requerido y debe comenzar con 0 y tener 10 dígitos
           </div>
         </div>

         <div class="form-group">
           <label class="form-label">Dirección*</label>
           <input 
             type="text" 
             class="form-control" 
             [(ngModel)]="customerData.address" 
             name="address"
             required
             maxlength="200"
             #address="ngModel"
             placeholder="Ingrese la dirección"
           >
           <div 
             *ngIf="address.invalid && (address.dirty || address.touched)"
             class="error-message"
           >
             La dirección es requerida
           </div>
         </div>
         <div class="enabled-toggle">
              <label>Habilitado</label>
              <mat-slide-toggle 
                [(ngModel)]="customerData.isActive"
                name="isActive"
                color="primary"
              >
              </mat-slide-toggle>
            </div>

            
         <div class="modal-footer">
           <button 
             type="button" 
             class="btn btn-secondary" 
             (click)="closeModal()"
           >
             Cancelar
           </button>
           <button 
             type="button" 
             class="btn btn-primary" 
             (click)="onSubmit()"
             [disabled]="!isFormValid()"
           >
             {{ isEditing ? 'Actualizar' : 'Crear' }}
           </button>
         </div>
       </form>
     </div>
   </div>
 </div>
`
})
export class CustomerModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() isEditing = false;
  @Input() set initialCustomer(customer: Customer | undefined) {
    this.customerData = customer 
      ? { ...customer }
      : this.createEmptyCustomer();
  }
  @Output() modalClose = new EventEmitter<void>();
  @Output() customerSaved = new EventEmitter<Customer>();

  customerData: Customer = this.createEmptyCustomer();
  companies: Company[] = [];

  constructor(
    private customerService: CustomerService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    // Load companies
    this.companyService.getAll().subscribe({
      next: (response: any) => {
        this.companies = response.content;
      },
      error: (error) => {
        console.error('Error cargando compañías', error);
      }
    });
  }

  private createEmptyCustomer(): Customer {
    return {
      companyId: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      isActive: true,
    };
  }

  trackByCompanyId(index: number, company: Company): number {
    return company?.company_id ?? 0;
  }

  isFormValid(): boolean {
    return !!(
      this.customerData.companyId &&
      this.customerData.firstName?.trim().length >= 2 &&
      this.customerData.firstName?.trim().length <= 100 &&
      this.customerData.lastName?.trim().length >= 2 &&
      this.customerData.lastName?.trim().length <= 100 &&
      this.isValidEmail(this.customerData.email) &&
      this.isValidPhone(this.customerData.phone) &&
      this.customerData.address?.trim().length > 0
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      if (this.isEditing) {
        this.updateCustomer();
      } else {
        this.createCustomer();
      }
    }
  }

  createCustomer(): void {
    this.customerService.create(this.customerData).subscribe({
      next: (createdCustomer) => {
        this.customerSaved.emit(createdCustomer);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creando cliente', error);
        // TODO: Implement error handling
      }
    });
  }

  updateCustomer(): void {
    this.customerService.update(this.customerData).subscribe({
      next: (updatedCustomer) => {
        this.customerSaved.emit(updatedCustomer);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error actualizando cliente', error);
        // TODO: Implement error handling
      }
    });
  }

  closeModal(): void {
    this.isVisible = false;
    this.modalClose.emit();
    this.customerData = this.createEmptyCustomer();
  }
}