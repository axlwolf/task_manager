import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from './modules/icons.module';
import { IconComponent } from './components/icon/icon.component';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    IconComponent
  ],
  exports: [
    IconsModule,
    IconComponent
  ]
})
export class SharedModule { }