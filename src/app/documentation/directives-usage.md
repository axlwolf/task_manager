# Directivas de Animación

Este proyecto incluye varias directivas de animación standalone para añadir efectos interactivos a los elementos.

## Directivas Disponibles

### PulseDirective

Hace un efecto de pulsación (escala arriba y abajo) en un elemento.

```html
<div 
  appPulse 
  [pulseDuration]="300" 
  [pulseScale]="1.1" 
  [pulseOnHover]="true" 
  [pulseOnClick]="false">
  Contenido con efecto de pulso
</div>
```

### BounceDirective

Crea un efecto de rebote (arriba y abajo) en un elemento.

```html
<div 
  appBounce 
  [bounceDuration]="500" 
  [bounceHeight]="10" 
  [bounceOnHover]="false" 
  [bounceOnClick]="true">
  Contenido con efecto de rebote
</div>
```

### HighlightDirective

Aplica un efecto de resaltado con color de fondo temporal.

```html
<div 
  appHighlight 
  [highlightDuration]="1000" 
  [highlightColor]="'rgba(var(--primary-rgb), 0.2)'" 
  [highlightOnHover]="true" 
  [highlightOnClick]="false">
  Contenido con efecto de resaltado
</div>
```

### ShakeDirective

Aplica un efecto de sacudida lateral a un elemento.

```html
<div 
  appShake 
  [shakeDuration]="500" 
  [shakeIntensity]="5" 
  [shakeOnHover]="false" 
  [shakeOnClick]="true">
  Contenido con efecto de sacudida
</div>
```

### FadeDirective

Crea efectos de aparecer y desaparecer gradualmente.

```html
<div 
  appFade 
  [fadeDuration]="300"
  [fadeType]="'in'"
  [fadeOnHover]="true"
  [fadeOnClick]="false"
  [fadeOnLeave]="false">
  Contenido con efecto de aparición/desaparición
</div>
```

### RotateDirective

Aplica un efecto de rotación a un elemento.

```html
<div 
  appRotate 
  [rotateDuration]="300"
  [rotateDegrees]="360"
  [rotateOnHover]="false"
  [rotateOnClick]="true">
  Contenido con efecto de rotación
</div>
```

### SlideDirective

Crea un efecto de deslizamiento en una dirección específica.

```html
<div 
  appSlide 
  [slideDuration]="300"
  [slideDirection]="'left'"
  [slideDistance]="50"
  [slideOnHover]="true"
  [slideOnClick]="false">
  Contenido con efecto de deslizamiento
</div>
```

## Uso con Componentes

Estas directivas se pueden combinar con cualquier componente de la aplicación. Por ejemplo:

```html
<app-task-card appHighlight [highlightOnHover]="true" [highlightColor]="'rgba(0, 255, 0, 0.1)'">
</app-task-card>

<button appPulse [pulseOnClick]="true">Pulse Button</button>

<app-icon name="refresh" appRotate [rotateOnClick]="true"></app-icon>
```

## Cómo funcionan

Todas las directivas utilizan el `AnimationService` que aprovecha la API de animaciones de Angular para crear efectos fluidos basados en CSS. Las directivas añaden automáticamente event listeners para varios eventos (hover, click) y aplican las animaciones adecuadas.
