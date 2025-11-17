/**
 * ThemeService - خدمة إدارة السمات
 * تتعامل مع تطبيق وحفظ السمات
 */

import { Theme, ThemePresets } from '../models/Theme';
import { preferences } from '@kit.ArkData';

export class ThemeService {
  private static instance: ThemeService;
  private currentTheme: Theme;
  private themeChangeListeners: Array<(theme: Theme) => void> = [];
  private preferencesStore: preferences.Preferences | null = null;

  private constructor() {
    this.currentTheme = ThemePresets.DARK; // Default theme
    this.initPreferences();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  /**
   * Initialize preferences for storing theme selection
   */
  private async initPreferences(): Promise<void> {
    try {
      const context = getContext(this);
      this.preferencesStore = await preferences.getPreferences(context, 'arkstudio_settings');

      // Load saved theme
      const savedThemeId = await this.preferencesStore.get('theme', 'dark') as string;
      this.currentTheme = ThemePresets.getThemeById(savedThemeId);
    } catch (error) {
      console.error('Failed to initialize preferences:', error);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  async setTheme(themeId: string): Promise<void> {
    const newTheme = ThemePresets.getThemeById(themeId);
    this.currentTheme = newTheme;

    // Save to preferences
    if (this.preferencesStore) {
      try {
        await this.preferencesStore.put('theme', themeId);
        await this.preferencesStore.flush();
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }

    // Notify listeners
    this.notifyThemeChange(newTheme);
  }

  /**
   * Get all available themes
   */
  getAllThemes(): Theme[] {
    return ThemePresets.getAllThemes();
  }

  /**
   * Register theme change listener
   */
  onThemeChange(listener: (theme: Theme) => void): void {
    this.themeChangeListeners.push(listener);
  }

  /**
   * Unregister theme change listener
   */
  offThemeChange(listener: (theme: Theme) => void): void {
    const index = this.themeChangeListeners.indexOf(listener);
    if (index > -1) {
      this.themeChangeListeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyThemeChange(theme: Theme): void {
    this.themeChangeListeners.forEach(listener => {
      try {
        listener(theme);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }

  /**
   * Get color from current theme
   */
  getColor(colorKey: keyof Theme['colors']): string {
    return this.currentTheme.colors[colorKey];
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme(): boolean {
    return this.currentTheme.type === 'dark' || this.currentTheme.type === 'high-contrast';
  }

  /**
   * Check if current theme is light
   */
  isLightTheme(): boolean {
    return this.currentTheme.type === 'light';
  }

  /**
   * Get Monaco theme name for current theme
   */
  getMonacoTheme(): string {
    return this.currentTheme.monacoTheme;
  }

  /**
   * Toggle between dark and light theme
   */
  async toggleTheme(): Promise<void> {
    const newThemeId = this.isDarkTheme() ? 'light' : 'dark';
    await this.setTheme(newThemeId);
  }
}

// Export singleton instance
export const themeService = ThemeService.getInstance();
