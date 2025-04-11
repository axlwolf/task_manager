import { Injectable } from '@angular/core';
import { 
  AnimationBuilder, 
  AnimationFactory, 
  AnimationPlayer,
  style, 
  animate, 
  keyframes 
} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  constructor(private builder: AnimationBuilder) {}

  /**
   * Creates a pulse animation
   * @param duration Duration in ms
   * @param scale Scale factor
   */
  createPulseAnimation(duration: number = 300, scale: number = 1.2): AnimationFactory {
    return this.builder.build([
      animate(`${duration}ms ease-in-out`, keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: `scale(${scale})`, offset: 0.5 }),
        style({ transform: 'scale(1)', offset: 1 })
      ]))
    ]);
  }

  /**
   * Creates a bounce animation
   * @param duration Duration in ms
   * @param height Bounce height in pixels
   */
  createBounceAnimation(duration: number = 500, height: number = 10): AnimationFactory {
    return this.builder.build([
      animate(`${duration}ms ease-in-out`, keyframes([
        style({ transform: 'translateY(0)', offset: 0 }),
        style({ transform: `translateY(-${height}px)`, offset: 0.4 }),
        style({ transform: 'translateY(0)', offset: 1 })
      ]))
    ]);
  }

  /**
   * Creates a shake animation
   * @param duration Duration in ms
   * @param intensity Shake intensity in pixels
   */
  createShakeAnimation(duration: number = 500, intensity: number = 5): AnimationFactory {
    return this.builder.build([
      animate(`${duration}ms ease-in-out`, keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: `translateX(-${intensity}px)`, offset: 0.1 }),
        style({ transform: `translateX(${intensity}px)`, offset: 0.3 }),
        style({ transform: `translateX(-${intensity}px)`, offset: 0.5 }),
        style({ transform: `translateX(${intensity}px)`, offset: 0.7 }),
        style({ transform: `translateX(-${intensity}px)`, offset: 0.9 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ]))
    ]);
  }

  /**
   * Creates a fade in animation
   * @param duration Duration in ms
   */
  createFadeInAnimation(duration: number = 300): AnimationFactory {
    return this.builder.build([
      style({ opacity: 0 }),
      animate(`${duration}ms ease-in`, style({ opacity: 1 }))
    ]);
  }

  /**
   * Creates a fade out animation
   * @param duration Duration in ms
   */
  createFadeOutAnimation(duration: number = 300): AnimationFactory {
    return this.builder.build([
      style({ opacity: 1 }),
      animate(`${duration}ms ease-out`, style({ opacity: 0 }))
    ]);
  }

  /**
   * Creates a rotate animation
   * @param duration Duration in ms
   * @param degrees Rotation degrees
   */
  createRotateAnimation(duration: number = 300, degrees: number = 360): AnimationFactory {
    return this.builder.build([
      animate(`${duration}ms ease-in-out`, keyframes([
        style({ transform: 'rotate(0deg)', offset: 0 }),
        style({ transform: `rotate(${degrees}deg)`, offset: 1 })
      ]))
    ]);
  }

  /**
   * Creates a highlight animation
   * @param duration Duration in ms
   * @param color Highlight color
   */
  createHighlightAnimation(duration: number = 1000, color: string = 'rgba(255, 255, 0, 0.3)'): AnimationFactory {
    return this.builder.build([
      animate(`${duration}ms ease-in-out`, keyframes([
        style({ backgroundColor: 'transparent', offset: 0 }),
        style({ backgroundColor: color, offset: 0.5 }),
        style({ backgroundColor: 'transparent', offset: 1 })
      ]))
    ]);
  }

  /**
   * Creates a slide in animation
   * @param duration Duration in ms
   * @param direction Direction ('left', 'right', 'top', 'bottom')
   * @param distance Distance in pixels
   */
  createSlideAnimation(
    duration: number = 300, 
    direction: 'left' | 'right' | 'top' | 'bottom' = 'left', 
    distance: number = 50
  ): AnimationFactory {
    let initialStyle: any = {};
    let finalStyle: any = {};

    switch (direction) {
      case 'left':
        initialStyle = { transform: `translateX(-${distance}px)`, opacity: 0 };
        finalStyle = { transform: 'translateX(0)', opacity: 1 };
        break;
      case 'right':
        initialStyle = { transform: `translateX(${distance}px)`, opacity: 0 };
        finalStyle = { transform: 'translateX(0)', opacity: 1 };
        break;
      case 'top':
        initialStyle = { transform: `translateY(-${distance}px)`, opacity: 0 };
        finalStyle = { transform: 'translateY(0)', opacity: 1 };
        break;
      case 'bottom':
        initialStyle = { transform: `translateY(${distance}px)`, opacity: 0 };
        finalStyle = { transform: 'translateY(0)', opacity: 1 };
        break;
    }

    return this.builder.build([
      style(initialStyle),
      animate(`${duration}ms ease-out`, style(finalStyle))
    ]);
  }

  /**
   * Plays an animation on an element
   * @param element Element to animate
   * @param animation Animation factory
   * @returns Animation player
   */
  playAnimation(element: HTMLElement, animation: AnimationFactory): AnimationPlayer {
    const player = animation.create(element);
    player.play();
    return player;
  }
}