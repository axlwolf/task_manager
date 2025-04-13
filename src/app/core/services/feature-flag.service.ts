import { Injectable, signal, computed } from '@angular/core';

/**
 * Service for managing feature flags in the application.
 * This allows for trunk-based development by hiding incomplete features
 * until they are ready for production.
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  /**
   * Signal containing all feature flags and their states
   */
  private flags = signal<Record<string, boolean>>({
    // Default flags - add new features here
    'new-task-dialog': true,
    'task-filtering': false,
    'user-management': false,
    'advanced-reporting': false,
    'team-collaboration': false
  });

  /**
   * Computed signal that returns all flags
   */
  readonly allFlags = computed(() => this.flags());

  /**
   * Check if a feature flag is enabled
   * @param flagName The name of the feature flag
   * @returns True if the feature is enabled, false otherwise
   */
  isEnabled(flagName: string): boolean {
    return this.flags()[flagName] ?? false;
  }

  /**
   * Enable a feature flag
   * @param flagName The name of the feature flag
   */
  enable(flagName: string): void {
    this.flags.update(flags => ({...flags, [flagName]: true}));
    this.saveFlags();
  }

  /**
   * Disable a feature flag
   * @param flagName The name of the feature flag
   */
  disable(flagName: string): void {
    this.flags.update(flags => ({...flags, [flagName]: false}));
    this.saveFlags();
  }

  /**
   * Toggle a feature flag
   * @param flagName The name of the feature flag
   */
  toggle(flagName: string): void {
    const currentValue = this.isEnabled(flagName);
    this.flags.update(flags => ({...flags, [flagName]: !currentValue}));
    this.saveFlags();
  }

  /**
   * Save flags to localStorage for persistence
   */
  private saveFlags(): void {
    localStorage.setItem('featureFlags', JSON.stringify(this.flags()));
  }

  /**
   * Load flags from localStorage
   */
  loadFlags(): void {
    const savedFlags = localStorage.getItem('featureFlags');
    if (savedFlags) {
      try {
        const parsedFlags = JSON.parse(savedFlags);
        // Merge saved flags with default flags to ensure new flags are included
        this.flags.update(flags => ({...flags, ...parsedFlags}));
      } catch (error) {
        console.error('Error loading feature flags:', error);
      }
    }
  }

  /**
   * Reset all flags to their default values
   */
  resetFlags(): void {
    localStorage.removeItem('featureFlags');
    this.flags.set({
      'new-task-dialog': true,
      'task-filtering': false,
      'user-management': false,
      'advanced-reporting': false,
      'team-collaboration': false
    });
  }
}
