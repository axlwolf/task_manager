import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appPulse]',
  standalone: true
})
export class PulseDirective {
  @Input() pulseDuration: number = 300;
  @Input() pulseScale: number = 1.1;
  @Input() pulseOnHover: boolean = true;
  @Input() pulseOnClick: boolean = false;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.pulseOnHover) {
      this.pulse();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.pulseOnClick) {
      this.pulse();
    }
  }

  private pulse() {
    const animation = this.animationService.createPulseAnimation(
      this.pulseDuration,
      this.pulseScale
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}