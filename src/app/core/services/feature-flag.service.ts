import { Injectable, signal } from '@angular/core';

/**
 * Service for managing feature flags in the application.
 * This allows for trunk-based development with feature toggles.
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  // Default feature flags
  private readonly defaultFlags: Record<string, boolean> = {
    'new-task-dialog': true,
    'task-filtering': false,
    'user-management': false,
    'dark-mode': true,
    'analytics-dashboard': false
  };

  // Current feature flags state
  private readonly flagsSignal = signal<Record<string, boolean>>({ ...this.defaultFlags });

  // Expose readonly signal
  readonly allFlags = this.flagsSignal.asReadonly();

  constructor() {
    this.loadFlags();
  }

  /**
   * Check if a feature flag is enabled
   * @param flagName Name of the feature flag
   * @returns boolean indicating if the feature is enabled
   */
  isEnabled(flagName: string): boolean {
    return this.flagsSignal()[flagName] === true;
  }

  /**
   * Toggle a feature flag
   * @param flagName Name of the feature flag to toggle
   */
  toggle(flagName: string): void {
    if (flagName in this.flagsSignal()) {
      this.flagsSignal.update(flags => ({
        ...flags,
        [flagName]: !flags[flagName]
      }));
      this.saveFlags();
    } else {
      console.warn(`Feature flag "${flagName}" does not exist.`);
    }
  }

  /**
   * Reset all feature flags to their default values
   */
  resetFlags(): void {
    this.flagsSignal.set({ ...this.defaultFlags });
    this.saveFlags();
  }

  /**
   * Load feature flags from localStorage
   */
  loadFlags(): void {
    try {
      const savedFlags = localStorage.getItem('featureFlags');
      if (savedFlags) {
        const parsedFlags = JSON.parse(savedFlags);
        // Merge with default flags to ensure new flags are included
        this.flagsSignal.set({
          ...this.defaultFlags,
          ...parsedFlags
        });
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
      this.resetFlags();
    }
  }

  /**
   * Save feature flags to localStorage
   */
  private saveFlags(): void {
    try {
      localStorage.setItem('featureFlags', JSON.stringify(this.flagsSignal()));
    } catch (error) {
      console.error('Error saving feature flags:', error);
    }
  }
}
