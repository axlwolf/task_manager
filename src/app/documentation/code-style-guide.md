# Guía de Estilo de Código

Esta guía establece las convenciones de codificación y estructura de archivos para el proyecto Angular.

## Estructura de Archivos

### Componentes

Los componentes deben seguir una estructura consistente:

```
component-name/
├── component-name.component.ts
├── component-name.component.html
├── component-name.component.scss
└── component-name.component.spec.ts
```

**Excepciones**: 
- Para componentes muy pequeños (menos de 15 líneas de HTML y 30 líneas de CSS), se permite el uso de templates y estilos inline.
- Los componentes de utilidad o de presentación simples pueden usar templates inline.

### Directivas

Las directivas deben seguir esta estructura:

```
directives/
├── directive-name.directive.ts
└── directive-name.directive.spec.ts
```

### Servicios

Los servicios deben seguir esta estructura:

```
services/
├── service-name.service.ts
└── service-name.service.spec.ts
```

## Convenciones de Nomenclatura

### Archivos

- **Componentes**: `feature-name.component.ts`
- **Directivas**: `feature-name.directive.ts`
- **Servicios**: `feature-name.service.ts`
- **Interfaces**: `feature-name.interface.ts`
- **Enums**: `feature-name.enum.ts`
- **Modelos**: `feature-name.model.ts`
- **DTOs**: `feature-name.dto.ts`
- **Casos de Uso**: `feature-name.usecase.ts`

### Componentes y Directivas

- Los selectores de componentes deben usar el prefijo `app-`: `app-feature-name`
- Los selectores de directivas deben usar camelCase: `appFeatureName`

## Estructura de Componentes

### Standalone Components (Recomendado para Angular 18)

```typescript
@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss']
})
export class FeatureNameComponent {
  // Propiedades
  // Constructor
  // Métodos de ciclo de vida
  // Métodos públicos
  // Métodos privados
}
```

### Template Inline (para componentes pequeños)

```typescript
@Component({
  selector: 'app-small-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [`
    .container {
      padding: var(--space-4);
    }
    h2 {
      color: var(--color-primary);
    }
  `]
})
export class SmallComponent {
  @Input() title = '';
  @Input() description = '';
}
```

## Control de Flujo

Utiliza la sintaxis de control de flujo moderna (disponible desde Angular 17):

```html
@if (condition) {
  <div>Content shown when condition is true</div>
} @else {
  <div>Content shown when condition is false</div>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>No items found</div>
}

@switch (status) {
  @case ('active') { <span class="active">Active</span> }
  @case ('pending') { <span class="pending">Pending</span> }
  @default { <span class="unknown">Unknown</span> }
}
```

## Inyección de Dependencias

Utiliza la API de inyección funcional (disponible desde Angular 14):

```typescript
import { Component, inject } from '@angular/core';
import { MyService } from './my.service';

@Component({...})
export class MyComponent {
  private myService = inject(MyService);
  
  // Resto del código...
}
```

En lugar de:

```typescript
@Component({...})
export class MyComponent {
  constructor(private myService: MyService) {}
  
  // Resto del código...
}
```

## Estilo CSS

- Usa variables CSS para temas y valores reutilizables
- Sigue las convenciones de espaciado con variables CSS:

```scss
.container {
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  border-radius: var(--radius-md);
  background-color: var(--color-card-bg);
}
```

## Manejo de Estado

- Usa señales de Angular para estado local de componentes
- Usa servicios con señales para estado compartido entre componentes

```typescript
import { Component, signal } from '@angular/core';

@Component({...})
export class MyComponent {
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1);
  }
}
```

## Tipado

- Siempre usa tipado estricto
- Evita `any` siempre que sea posible
- Crea interfaces para modelos de datos

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};
```

## Testing

- Escribe pruebas unitarias para todos los componentes, servicios y pipes
- Usa el patrón de función `setup` para configurar las pruebas
- Sigue el patrón AAA (Arrange, Act, Assert)

```typescript
describe('MyComponent', () => {
  const setup = (config?: { someInput?: string }) => {
    // Arrange (setup component with dependencies)
    TestBed.configureTestingModule({
      imports: [MyComponent]
    });
    
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    
    if (config?.someInput) {
      component.someInput = config.someInput;
    }
    
    fixture.detectChanges();
    
    return { fixture, component };
  };
  
  it('should create', () => {
    // Act
    const { component } = setup();
    
    // Assert
    expect(component).toBeTruthy();
  });
});
```

## Exportación e Importación

- Usa archivos de barril (`index.ts`) para exportar elementos relacionados
- Importa desde el archivo de barril en lugar de archivos individuales

```typescript
// shared/components/index.ts
export * from './button/button.component';
export * from './input/input.component';
export * from './card/card.component';

// usage in another file
import { ButtonComponent, InputComponent, CardComponent } from '@app/shared/components';
```

Seguir estas directrices ayudará a mantener la consistencia en todo el proyecto y facilitará el mantenimiento del código a largo plazo.
