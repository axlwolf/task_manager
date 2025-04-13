import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appShake]',
  standalone: true
})
export class ShakeDirective {
  @Input() shakeDuration: number = 500;
  @Input() shakeIntensity: number = 5;
  @Input() shakeOnHover: boolean = false;
  @Input() shakeOnClick: boolean = true;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.shakeOnHover) {
      this.shake();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.shakeOnClick) {
      this.shake();
    }
  }

  private shake() {
    const animation = this.animationService.createShakeAnimation(
      this.shakeDuration,
      this.shakeIntensity
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}