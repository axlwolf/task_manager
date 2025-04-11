import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appBounce]',
  standalone: true
})
export class BounceDirective {
  @Input() bounceDuration: number = 500;
  @Input() bounceHeight: number = 10;
  @Input() bounceOnHover: boolean = false;
  @Input() bounceOnClick: boolean = true;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.bounceOnHover) {
      this.bounce();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.bounceOnClick) {
      this.bounce();
    }
  }

  private bounce() {
    const animation = this.animationService.createBounceAnimation(
      this.bounceDuration,
      this.bounceHeight
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}