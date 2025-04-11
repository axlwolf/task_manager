import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseDirective } from '../directives/pulse.directive';
import { BounceDirective } from '../directives/bounce.directive';
import { HighlightDirective } from '../directives/highlight.directive';

const DIRECTIVES = [PulseDirective, BounceDirective, HighlightDirective];

@NgModule({
  imports: [CommonModule, ...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class AnimationsModule {}
