import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Company } from '../models/company.model';
import { CompanyService } from '../services/company.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

function rucValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) return null;

  if (!/^\d{13}$/.test(value)) {
    return { invalidLength: true };
  }

  if (!value.endsWith('001')) {
    return { invalidSuffix: true };
  }

  return null;
}

function phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) return null;
  
    if (!/^\d{10}$/.test(value)) {
      return { invalidLength: true };
    }
    if (!value.startsWith('0')) {
        return { invalidSuffix: true };
      }
    return null;
  }
  
@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="modal-overlay" [class.show]="isModalOpen" [class.hide]="!isModalOpen">
      <div class="modal-container">
        <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
          <div class="modal-header">
            <h2 mat-dialog-title>{{ modalMode === 'edit' ? 'Editar Compañía' : 'Agregar nueva compañía' }}</h2>
            <button mat-icon-button (click)="closeModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="modal-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre de la compañía</mat-label>
              <input matInput formControlName="company_name" placeholder="Ingrese un nombre para la compañía">
              <mat-error *ngIf="companyForm.get('company_name')?.errors?.['required']">
                El nombre de la compañía es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>RUC</mat-label>
              <input 
                matInput 
                formControlName="tax_id" 
                placeholder="Número de identificación del contribuyente"
                maxlength="13"
                (input)="onTaxIdInput($event)"
              >
              <mat-error *ngIf="companyForm.get('tax_id')?.errors?.['required']">
                El RUC es requerido
              </mat-error>
              <mat-error *ngIf="companyForm.get('tax_id')?.errors?.['invalidLength']">
                El RUC debe tener exactamente 13 dígitos numéricos
              </mat-error>
              <mat-error *ngIf="companyForm.get('tax_id')?.errors?.['invalidSuffix']">
                El RUC debe terminar en 001
              </mat-error>
              <mat-hint>Formato: XXXXXXXXXXXX001 (13 dígitos)</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo</mat-label>
              <input matInput formControlName="email" placeholder="Ingrese un correo válido">
              <mat-error *ngIf="companyForm.get('email')?.errors?.['required']">
                El correo es requerido.
              </mat-error>
              <mat-error *ngIf="companyForm.get('email')?.errors?.['email']">
                Por favor, ingrese un correo válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="address" placeholder="Ingrese una dirección">
              <mat-error *ngIf="companyForm.get('address')?.errors?.['required']">
                La dirección es requerida.
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Télefono</mat-label>
              <input 
                matInput 
                formControlName="phone" 
                placeholder="Número de télefono"
                maxlength="10"
                (input)="onPhoneInput($event)"
              >
              <mat-error *ngIf="companyForm.get('phone')?.errors?.['required']">
                El número de télefono es requerido.
              </mat-error>
              <mat-error *ngIf="companyForm.get('phone')?.errors?.['invalidLength']">
                El télefono debe tener exactamente 10 dígitos numéricos
              </mat-error>
              <mat-error *ngIf="companyForm.get('phone')?.errors?.['invalidSuffix']">
                El número de télefono debe empezar con el '0'.
              </mat-error>
              <mat-hint>Formato: 0999999999 (10 dígitos)</mat-hint>

            </mat-form-field>
            <mat-slide-toggle formControlName="is_active" color="primary" class="mt-3">
              Habilitado
            </mat-slide-toggle>
          </div>

          <div class="modal-footer">
            <button mat-button type="button" (click)="closeModal()">Cancelar</button>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="!companyForm.valid"
            >
              {{ modalMode === 'edit' ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .modal-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-overlay.hide {
      opacity: 0;
      visibility: hidden;
    }

    .modal-container {
      background: white;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-20px);
      transition: transform 0.3s ease;
    }

    .show .modal-container {
      transform: translateY(0);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #eee;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .mt-3 {
      margin-top: 1rem;
    }
  `]
})
export class CompanyFormComponent implements OnInit {
    @Input() isModalOpen = false;
    @Input() company?: Company;
    @Input() modalMode: 'create' | 'edit' = 'create';
    @Output() modalClosed = new EventEmitter<void>();
    @Output() companySaved = new EventEmitter<Company>();
  
    companyForm: FormGroup;
  
    constructor(private fb: FormBuilder, private companyService: CompanyService) {
      this.companyForm = this.fb.group({
        company_id: [null],
        company_name: ['', [Validators.required]],
        tax_id: ['', [Validators.required, rucValidator]],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required]],
        phone:['',[Validators.required, phoneValidator]],
        is_active: [true],
        is_deleted: [false]
      });
    }
  
    ngOnInit(): void {
      this.initializeForm();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if ((changes['company'] || changes['modalMode'] || changes['isModalOpen']) && this.isModalOpen) {
        this.initializeForm();
      }
    }
  
    private initializeForm(): void {
      if (this.modalMode === 'edit' && this.company) {
        console.log("El id es:"+this.company.company_id);
        this.companyForm.patchValue({
          company_id: this.company.company_id,
          company_name: this.company.company_name,
          tax_id: this.company.tax_id,
          email: this.company.email,
          address: this.company.address,
          phone: this.company.phone,
          is_active: this.company.is_active,
          is_deleted: this.company.is_deleted,
          created_date: Date.now
        });
      } else {
        this.companyForm.reset({
          company_id: null,
          company_name: '',
          tax_id: '',
          email: '',
          address: '',
          phone: '',
          is_active: true,
          is_deleted: false,
          created_date: Date.now
        });
      }
    }
  
    onSubmit(): void {
      if (this.companyForm.valid) {
        const companyData = this.companyForm.value;
        
        const request$ = this.modalMode === 'edit' 
          ? this.companyService.update(companyData)
          : this.companyService.create(companyData);
  
        request$.subscribe({
          next: (company) => {
            this.companySaved.emit(company);
            this.closeModal();
          },
          error: (error) => {
            console.error(`Error ${this.modalMode === 'edit' ? 'actualizando' : 'creando'} la compañía`, error);
          }
        });
      }
    }
    closeModal(): void {
        this.isModalOpen = false;
        this.modalClosed.emit();
        this.companyForm.reset({ is_active: true });
      }
    
      onTaxIdInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const newValue = input.value.replace(/[^0-9]/g, '');
        // Actualiza el valor del control del formulario
        this.companyForm.get('tax_id')?.setValue(newValue);
      }

      onPhoneInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const newValue = input.value.replace(/[^0-9]/g, '');
        // Actualiza el valor del control del formulario
        this.companyForm.get('phone')?.setValue(newValue);
      }
  }