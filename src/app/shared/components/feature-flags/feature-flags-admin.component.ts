import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagService } from '../../../core/services/feature-flag.service';

/**
 * Component for administering feature flags.
 * This is typically only shown to developers or admins.
 */
@Component({
  selector: 'app-feature-flags-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-flags-container p-4 bg-white rounded shadow-md">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Feature Flags</h2>
      <p class="mb-4 text-sm text-gray-600">
        Toggle features on/off for trunk-based development testing.
      </p>
      
      <div class="space-y-3">
        @for (flag of allFlags(); track flag[0]) {
          <div class="flex items-center justify-between p-2 border-b border-gray-200">
            <span class="font-medium text-gray-700">{{ formatFlagName(flag[0]) }}</span>
            <div class="flex items-center">
              <span class="mr-2 text-sm" [class.text-green-600]="flag[1]" [class.text-red-600]="!flag[1]">
                {{ flag[1] ? 'Enabled' : 'Disabled' }}
              </span>
              <button 
                (click)="toggleFlag(flag[0])"
                class="px-3 py-1 rounded text-sm font-medium"
                [class.bg-red-100]="flag[1]"
                [class.text-red-700]="flag[1]"
                [class.hover:bg-red-200]="flag[1]"
                [class.bg-green-100]="!flag[1]"
                [class.text-green-700]="!flag[1]"
                [class.hover:bg-green-200]="!flag[1]"
              >
                {{ flag[1] ? 'Disable' : 'Enable' }}
              </button>
            </div>
          </div>
        }
      </div>
      
      <div class="mt-6 flex justify-end">
        <button 
          (click)="resetFlags()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  `,
  styles: [`
    .feature-flags-container {
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class FeatureFlagsAdminComponent implements OnInit {
  private featureFlagService = inject(FeatureFlagService);
  
  // Computed signal that returns all flags as entries for easy iteration
  allFlags = this.featureFlagService.allFlags.transform(flags => 
    Object.entries(flags).sort((a, b) => a[0].localeCompare(b[0]))
  );
  
  ngOnInit(): void {
    // Load flags from localStorage
    this.featureFlagService.loadFlags();
  }
  
  /**
   * Toggle a feature flag
   */
  toggleFlag(flagName: string): void {
    this.featureFlagService.toggle(flagName);
  }
  
  /**
   * Reset all flags to their default values
   */
  resetFlags(): void {
    this.featureFlagService.resetFlags();
  }
  
  /**
   * Format flag name for display
   * Converts 'flag-name' to 'Flag Name'
   */
  formatFlagName(flagName: string): string {
    return flagName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
