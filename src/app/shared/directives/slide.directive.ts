import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appSlide]',
  standalone: true
})
export class SlideDirective {
  @Input() slideDuration: number = 300;
  @Input() slideDirection: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() slideDistance: number = 50;
  @Input() slideOnHover: boolean = true;
  @Input() slideOnClick: boolean = false;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.slideOnHover) {
      this.slide();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.slideOnClick) {
      this.slide();
    }
  }

  private slide() {
    const animation = this.animationService.createSlideAnimation(
      this.slideDuration,
      this.slideDirection,
      this.slideDistance
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}