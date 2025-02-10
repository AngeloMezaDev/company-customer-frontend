import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../models/company.model';
import { CompanyService } from '../services/company.service';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog.component';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule, 
    CompanyFormComponent,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  styleUrls: ['./company-list.component.css'],
  template: `
    <div class="container mt-4">
      <div class="header">
        <h2>Administrador de compañias</h2>
        <button class="btn-add" (click)="openCreateModal()">
          <mat-icon>add</mat-icon>
          <strong>Añadir</strong>
        </button>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUC</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Télefono</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies">
              <td>
                <div class="company-name">{{ company.company_name }}</div>
              </td>
              <td>{{ company.tax_id }}</td>
              <td>{{ company.email }}</td>
              <td>{{ company.address }}</td>
              <td>{{ company.phone }}</td>
              <td class="text-center status-cell">
                <mat-icon [ngClass]="{'status-active': company.is_active === true, 'status-inactive': company.is_active === false}"
                [matTooltip]="company.is_active ? 'Habilitado' : 'Deshabilitado'">
                  {{ company.is_active === true ? 'check_circle' : 'cancel' }}
                </mat-icon>
              </td>
              <td class="actions-cell">
                <div class="actions">
                  <button class="action-btn edit" (click)="editCompany(company)" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="action-btn delete" (click)="deleteCompany(company.company_id)" title="Borrar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-company-form
        [isModalOpen]="isModalOpen"
        [company]="selectedCompany"
        [modalMode]="modalMode"
        (modalClosed)="closeModal()"
        (companySaved)="onCompanySaved($event)"
      ></app-company-form>
    </div>
  `
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  isModalOpen = false;
  selectedCompany?: Company;
  modalMode: 'create' | 'edit' = 'create';

  constructor(private companyService: CompanyService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (response: any) => {
        this.companies = response.content;
      },
      error: (error) => {
        console.error('Error loading companies', error);
      }
    });
  }

  editCompany(company: Company): void {
    this.selectedCompany = {...company};
    this.modalMode = 'edit';
    this.isModalOpen = true;
  }

  openCreateModal(): void {
    this.selectedCompany = undefined;
    this.modalMode = 'create';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCompany = undefined;
    this.modalMode = 'create';
  }

  onCompanySaved(company: Company): void {
    this.loadCompanies(); // Recargar la lista completa para asegurar datos actualizados
  }

  deleteCompany(id?: number): void {
    if (!id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companyService.delete(id).subscribe({
          next: () => {
            this.companies = this.companies.filter(c => c.company_id !== id);
            
            // Mostrar el MatSnackBar después de eliminar la compañía
            this.snackBar.open('Compañía eliminada correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error eliminando compañía', error);
            
            // Mostrar el MatSnackBar en caso de error al eliminar la compañía
            this.snackBar.open('Error al eliminar la compañía', 'Cerrar', {
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
}