import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input() highlightDuration: number = 1000;
  @Input() highlightColor: string = 'rgba(var(--primary-rgb), 0.2)';
  @Input() highlightOnHover: boolean = true;
  @Input() highlightOnClick: boolean = false;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.highlightOnHover) {
      this.highlight();
    }
  }

  @HostListener('click')
  onClick() {
    if (this.highlightOnClick) {
      this.highlight();
    }
  }

  private highlight() {
    const animation = this.animationService.createHighlightAnimation(
      this.highlightDuration,
      this.highlightColor
    );
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }
}