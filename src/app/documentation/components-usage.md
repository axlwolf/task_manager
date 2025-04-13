# Componentes del Proyecto

## Componentes Compartidos

### IconComponent

El `IconComponent` es un componente reutilizable para mostrar iconos de Feather en la aplicación.

#### Uso

```html
<app-icon 
  name="check-circle" 
  [size]="24" 
  theme="primary" 
  [strokeWidth]="2"
  [animate]="true"
  [interactive]="true"
  effect="pulse"
  [effectDuration]="300"
  (click)="handleIconClick()"
></app-icon>
```

#### Propiedades

- `name`: Nombre del icono (requerido)
- `size`: Tamaño del icono en píxeles (default: 24)
- `theme`: Tema del color ('primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark')
- `strokeWidth`: Grosor del trazo (1, 2, 3)
- `animate`: Si el icono debe animarse en interacciones
- `interactive`: Si el icono es interactivo (con efectos hover)
- `effect`: Tipo de efecto ('pulse', 'bounce', 'none')
- `effectDuration`: Duración del efecto en milisegundos

#### Eventos

- `click`: Emitido cuando se hace clic en el icono
- `mouseEnter`: Emitido cuando el cursor entra en el icono
- `mouseLeave`: Emitido cuando el cursor sale del icono

### DialogComponent

El `DialogComponent` es un componente modal reutilizable para mostrar diálogos en la aplicación.

#### Uso con DialogService

```typescript
import { DialogService } from '@app/shared/components/dialog/dialog.service';

@Component({...})
export class MyComponent {
  constructor(private dialogService: DialogService) {}

  openDialog() {
    const dialogRef = this.dialogService.open({
      title: 'Confirmation',
      content: 'Are you sure you want to proceed?',
      confirmText: 'Yes',
      cancelText: 'No'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed
        console.log('User confirmed');
      } else {
        // User cancelled
        console.log('User cancelled');
      }
    });
  }
}
```

#### Uso Directo

```html
<app-dialog
  title="Dialog Title"
  [showFooter]="true"
  [hideDefaultButtons]="false"
  confirmText="Confirm"
  cancelText="Cancel"
  dialogClass="dialog-md"
  [closeOnEscape]="true"
  [closeOnBackdropClick]="true"
  (dialogClose)="handleClose()"
  (dialogConfirm)="handleConfirm()"
>
  <p>Dialog content goes here</p>
  
  <ng-container dialog-footer>
    <!-- Custom footer content -->
    <button>Custom Button</button>
  </ng-container>
</app-dialog>
```

#### Propiedades

- `title`: Título del diálogo
- `showFooter`: Si se debe mostrar el pie del diálogo
- `hideDefaultButtons`: Si se deben ocultar los botones predeterminados
- `confirmText`: Texto del botón de confirmación
- `cancelText`: Texto del botón de cancelación
- `dialogClass`: Clase CSS adicional para el diálogo (dialog-sm, dialog-md, dialog-lg, dialog-xl, dialog-fullscreen)
- `closeOnEscape`: Si el diálogo se debe cerrar al presionar Esc
- `closeOnBackdropClick`: Si el diálogo se debe cerrar al hacer clic fuera

#### Eventos

- `dialogClose`: Emitido cuando se cierra el diálogo
- `dialogConfirm`: Emitido cuando se confirma el diálogo
