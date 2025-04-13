import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Directive({
  selector: '[appFade]',
  standalone: true
})
export class FadeDirective {
  @Input() fadeDuration: number = 300;
  @Input() fadeType: 'in' | 'out' = 'in';
  @Input() fadeOnHover: boolean = true;
  @Input() fadeOnClick: boolean = false;
  @Input() fadeOnLeave: boolean = false;

  private originalDisplay: string = '';

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.fadeOnHover) {
      if (this.fadeType === 'in') {
        this.fadeIn();
      } else {
        this.fadeOut();
      }
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.fadeOnLeave) {
      if (this.fadeType === 'in') {
        this.fadeOut();
      } else {
        this.fadeIn();
      }
    }
  }

  @HostListener('click')
  onClick() {
    if (this.fadeOnClick) {
      if (this.fadeType === 'in') {
        this.fadeIn();
      } else {
        this.fadeOut();
      }
    }
  }

  private fadeIn() {
    const animation = this.animationService.createFadeInAnimation(this.fadeDuration);
    this.el.nativeElement.style.display = this.originalDisplay || 'block';
    this.animationService.playAnimation(this.el.nativeElement, animation);
  }

  private fadeOut() {
    if (!this.originalDisplay) {
      this.originalDisplay = this.el.nativeElement.style.display;
    }
    
    const animation = this.animationService.createFadeOutAnimation(this.fadeDuration);
    const player = this.animationService.playAnimation(this.el.nativeElement, animation);
    
    player.onDone(() => {
      this.el.nativeElement.style.display = 'none';
    });
  }
}