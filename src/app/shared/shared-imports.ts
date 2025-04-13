/**
 * Archivo centralizado para importar componentes compartidos
 *
 * Importa este archivo en tus componentes standalone en lugar
 * de importar SharedModule.
 *
 * Ejemplo:
 * ```typescript
 * @Component({
 *   standalone: true,
 *   imports: [SHARED_IMPORTS],
 *   ...
 * })
 * ```
 */

import { Type } from '@angular/core';

// Componentes
import { IconComponent } from './components/icon/icon.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

// Directivas
import { HighlightDirective } from './directives/highlight.directive';
import { BounceDirective } from './directives/bounce.directive';
import { PulseDirective } from './directives/pulse.directive';
import { ShakeDirective } from './directives/shake.directive';
import { FadeDirective } from './directives/fade.directive';
import { RotateDirective } from './directives/rotate.directive';
import { SlideDirective } from './directives/slide.directive';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';

// No more modules needed as we've migrated to standalone components

// Importaciones comunes
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Array de componentes, directivas, pipes y módulos compartidos para importar en componentes standalone
 */
export const SHARED_IMPORTS = [
  // Módulos comunes de Angular
  CommonModule,
  RouterModule,
  ReactiveFormsModule,

  // Componentes standalone
  IconComponent,
  DialogComponent,
  HeaderComponent,
  LogoComponent,
  ThemeSwitcherComponent,

  // Directivas standalone
  HighlightDirective,
  BounceDirective,
  PulseDirective,
  ShakeDirective,
  FadeDirective,
  RotateDirective,
  SlideDirective,

  // Pipes standalone
  TruncatePipe,
] as Type<any>[];

/**
 * Componentes standalone disponibles para el proyecto
 */
export const STANDALONE_COMPONENTS = [
  IconComponent,
  DialogComponent,
  HeaderComponent,
  LogoComponent,
  ThemeSwitcherComponent,
];

/**
 * Directivas standalone disponibles para el proyecto
 */
export const STANDALONE_DIRECTIVES = [
  HighlightDirective,
  BounceDirective,
  PulseDirective,
  ShakeDirective,
  FadeDirective,
  RotateDirective,
  SlideDirective,
];

/**
 * Pipes standalone disponibles para el proyecto
 */
export const STANDALONE_PIPES = [TruncatePipe];
