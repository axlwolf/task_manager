import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from './modules/icons.module';
import { AnimationsModule } from './modules/animations.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    AnimationsModule,
  ],
  exports: [
    IconsModule,
    AnimationsModule,
  ],
})
export class SharedModule {}
