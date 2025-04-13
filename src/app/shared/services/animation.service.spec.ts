import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animation.service';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AnimationService', () => {
  let service: AnimationService;
  let animationBuilder: jasmine.SpyObj<AnimationBuilder>;
  let animationFactory: jasmine.SpyObj<AnimationFactory>;
  let animationPlayer: jasmine.SpyObj<AnimationPlayer>;

  beforeEach(() => {
    // Create spies
    animationPlayer = jasmine.createSpyObj('AnimationPlayer', ['play', 'destroy']);
    animationFactory = jasmine.createSpyObj('AnimationFactory', ['create']);
    animationFactory.create.and.returnValue(animationPlayer);
    animationBuilder = jasmine.createSpyObj('AnimationBuilder', ['build']);
    animationBuilder.build.and.returnValue(animationFactory);

    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        AnimationService,
        { provide: AnimationBuilder, useValue: animationBuilder }
      ]
    });

    service = TestBed.inject(AnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a pulse animation', () => {
    // Act
    const result = service.createPulseAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a bounce animation', () => {
    // Act
    const result = service.createBounceAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a shake animation', () => {
    // Act
    const result = service.createShakeAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a fade in animation', () => {
    // Act
    const result = service.createFadeInAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a fade out animation', () => {
    // Act
    const result = service.createFadeOutAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a rotate animation', () => {
    // Act
    const result = service.createRotateAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a highlight animation', () => {
    // Act
    const result = service.createHighlightAnimation();
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a slide animation with left direction', () => {
    // Act
    const result = service.createSlideAnimation(300, 'left', 50);
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a slide animation with right direction', () => {
    // Act
    const result = service.createSlideAnimation(300, 'right', 50);
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a slide animation with top direction', () => {
    // Act
    const result = service.createSlideAnimation(300, 'top', 50);
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should create a slide animation with bottom direction', () => {
    // Act
    const result = service.createSlideAnimation(300, 'bottom', 50);
    
    // Assert
    expect(animationBuilder.build).toHaveBeenCalled();
    expect(result).toBe(animationFactory);
  });

  it('should play an animation on an element', () => {
    // Arrange
    const element = document.createElement('div');
    
    // Act
    const result = service.playAnimation(element, animationFactory);
    
    // Assert
    expect(animationFactory.create).toHaveBeenCalledWith(element);
    expect(animationPlayer.play).toHaveBeenCalled();
    expect(result).toBe(animationPlayer);
  });
});
