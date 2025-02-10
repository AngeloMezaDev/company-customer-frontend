import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  styleUrls: ['./confirm-dialog.component.css'],
  template: `
  <div class="confirm-dialog-overlay">
    <div class="confirm-dialog">
        <div class="confirm-dialog-content">
            <h2 class="confirm-dialog-title">Confirmar eliminación</h2>
            <p class="confirm-dialog-message">¿Está seguro que desea eliminar esta registro?</p>
            <div class="confirm-dialog-actions">
                <button class="cancel-button" (click)="onNoClick()">Cancelar</button>
                <button class="delete-button" (click)="onConfirm()">Eliminar</button>
            </div>
        </div>
    </div>
</div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}