import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from './modules/icons.module';
import { AnimationsModule } from './modules/animations.module';
import { IconComponent } from './components/icon/icon.component';
import { PulseDirective } from './directives/pulse.directive';
import { BounceDirective } from './directives/bounce.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { ShakeDirective } from './directives/shake.directive';
import { RotateDirective } from './directives/rotate.directive';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    AnimationsModule,
    IconComponent,
    PulseDirective,
    BounceDirective,
    HighlightDirective,
    ShakeDirective,
    RotateDirective,
  ],
  exports: [
    IconsModule,
    AnimationsModule,
    IconComponent,
    PulseDirective,
    BounceDirective,
    HighlightDirective,
    ShakeDirective,
    RotateDirective,
  ],
})
export class SharedModule {}
