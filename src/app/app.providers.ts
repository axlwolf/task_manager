import { EnvironmentProviders, Provider } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AnimationService } from './shared/services/animation.service';

export const APP_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideAnimations(),
  AnimationService
];
