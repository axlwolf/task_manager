import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appRotate]',
  standalone: true
})
export class RotateDirective {
  @Input() rotateDuration: number = 300;
  @Input() rotateDegrees: number = 360;
  @Input() rotateOnHover: boolean = false;
  @Input() rotateOnClick: boolean = true;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.rotateOnHover) {
      this.rotate();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.rotateOnClick) {
      this.rotate();
    }
  }

  private rotate() {
    const animation = this.animationService.createRotateAnimation(
      this.rotateDuration,
      this.rotateDegrees
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}