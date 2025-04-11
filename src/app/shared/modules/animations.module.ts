import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseDirective } from '../directives/pulse.directive';
import { BounceDirective } from '../directives/bounce.directive';
import { HighlightDirective } from '../directives/highlight.directive';
import { ShakeDirective } from '../directives/shake.directive';
import { RotateDirective } from '../directives/rotate.directive';

const DIRECTIVES = [
  PulseDirective,
  BounceDirective,
  HighlightDirective,
  ShakeDirective,
  RotateDirective
];

@NgModule({
  imports: [
    CommonModule,
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class AnimationsModule { }