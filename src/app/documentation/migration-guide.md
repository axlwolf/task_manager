# Guía de Migración a Angular 18

Esta guía proporciona instrucciones sobre cómo migrar componentes y módulos antiguos a componentes standalone y el enfoque moderno de Angular 18.

## ¿Por qué migrar?

Angular 18 prioriza el uso de componentes standalone sobre los módulos NgModule. Las ventajas incluyen:

1. **Menos boilerplate**: Elimina la necesidad de declarar componentes en un módulo
2. **Importaciones más claras**: Las dependencias se declaran directamente en el componente
3. **Mejor rendimiento**: Facilita el tree-shaking y optimización del código
4. **Mejor DX**: Experiencia de desarrollo más fluida

## Pasos para migrar un componente

### 1. Migrar de NgModule a componente standalone

**Antes**:
```typescript
// component.ts
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss']
})
export class MyComponent {
  // ...
}

// module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [MyComponent],
  exports: [MyComponent]
})
export class MyModule { }
```

**Después**:
```typescript
// component.ts
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss'],
  standalone: true,
  imports: [CommonModule, OtherStandaloneComponent]
})
export class MyComponent {
  // ...
}
```

### 2. Uso del archivo `shared-imports.ts`

Para importar componentes, directivas y pipes compartidos, utiliza el archivo `shared-imports.ts`:

```typescript
import { SHARED_IMPORTS } from '@app/shared/shared-imports';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss'],
  standalone: true,
  imports: [SHARED_IMPORTS]
})
export class MyComponent {
  // ...
}
```

O selecciona solo lo que necesitas:

```typescript
import { CommonModule } from '@angular/common';
import { IconComponent, DialogComponent } from '@app/shared/components';
import { HighlightDirective } from '@app/shared/directives';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    DialogComponent,
    HighlightDirective
  ]
})
export class MyComponent {
  // ...
}
```

### 3. Migración de servicios

Los servicios ya no deben registrarse en `providers` de los módulos, sino usar `providedIn: 'root'`:

**Antes**:
```typescript
@Injectable()
export class MyService {
  // ...
}

@NgModule({
  providers: [MyService]
})
export class MyModule { }
```

**Después**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {
  // ...
}
```

### 4. Migración de rutas

Utiliza componentes standalone en tus rutas:

```typescript
export const routes: Routes = [
  {
    path: '',
    component: StandaloneLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component')
          .then(m => m.HomeComponent)
      }
    ]
  }
];
```

## Ejemplos de control de flujo moderno

Angular 18 introduce una nueva sintaxis de control de flujo que reemplaza a las directivas estructurales como `*ngIf` y `*ngFor`:

### Condicionales (@if/@else)

**Antes**:
```html
<div *ngIf="user; else noUser">
  Welcome, {{ user.name }}!
</div>
<ng-template #noUser>
  Please log in.
</ng-template>
```

**Después**:
```html
@if (user) {
  <div>Welcome, {{ user.name }}!</div>
} @else {
  <div>Please log in.</div>
}
```

### Bucles (@for)

**Antes**:
```html
<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackByFn">
    {{ i }}: {{ item.name }}
  </li>
</ul>
```

**Después**:
```html
<ul>
  @for (item of items; track item.id; let i = $index) {
    <li>{{ i }}: {{ item.name }}</li>
  }
</ul>
```

### Empty states (@empty)

```html
<ul>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  } @empty {
    <li>No items found</li>
  }
</ul>
```

### Switch (@switch)

**Antes**:
```html
<div [ngSwitch]="status">
  <p *ngSwitchCase="'active'">Active</p>
  <p *ngSwitchCase="'inactive'">Inactive</p>
  <p *ngSwitchDefault>Unknown</p>
</div>
```

**Después**:
```html
@switch (status) {
  @case ('active') {
    <p>Active</p>
  }
  @case ('inactive') {
    <p>Inactive</p>
  }
  @default {
    <p>Unknown</p>
  }
}
```

## Checklist de migración

- [ ] Convertir componente a standalone
- [ ] Actualizar importaciones
- [ ] Migrar de directivas estructurales a control de flujo moderno
- [ ] Actualizar servicios a providedIn: 'root'
- [ ] Eliminar NgModule si es posible
- [ ] Actualizar rutas para usar loadComponent en lugar de loadChildren
- [ ] Actualizar referencias en otros componentes

## Recursos

- [Documentación oficial de Angular](https://angular.io/guide/standalone-components)
- [Angular Control Flow](https://angular.io/guide/control_flow)
- [Guía de migración oficial](https://angular.io/guide/standalone-migration)
