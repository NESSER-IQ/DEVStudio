/**
 * ThemeRegistry - Manages themes
 */

import { Theme, IThemeRegistry } from './types';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

/**
 * Theme registry implementation
 */
export class ThemeRegistry implements IThemeRegistry {
  private themes: Map<string, Theme> = new Map();
  private currentThemeId: string = 'light';

  // Event listeners
  private themeChangeListeners: Array<(theme: Theme) => void> = [];

  constructor() {
    // Register default themes
    this.registerTheme(lightTheme);
    this.registerTheme(darkTheme);
  }

  /**
   * Registers a theme
   */
  registerTheme(theme: Theme): void {
    if (this.themes.has(theme.id)) {
      console.warn(`Theme already registered: ${theme.id}`);
      return;
    }

    this.themes.set(theme.id, theme);
  }

  /**
   * Unregisters a theme
   */
  unregisterTheme(themeId: string): void {
    // Prevent unregistering default themes
    if (themeId === 'light' || themeId === 'dark') {
      console.warn('Cannot unregister default themes');
      return;
    }

    this.themes.delete(themeId);

    // If current theme was unregistered, switch to light theme
    if (this.currentThemeId === themeId) {
      this.setCurrentTheme('light');
    }
  }

  /**
   * Gets a theme by ID
   */
  getTheme(themeId: string): Theme | undefined {
    return this.themes.get(themeId);
  }

  /**
   * Gets all registered themes
   */
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Gets themes by type
   */
  getThemesByType(type: 'light' | 'dark'): Theme[] {
    return this.getAllThemes().filter(theme => theme.type === type);
  }

  /**
   * Gets the current theme
   */
  getCurrentTheme(): Theme {
    return this.themes.get(this.currentThemeId) || lightTheme;
  }

  /**
   * Sets the current theme
   */
  setCurrentTheme(themeId: string): void {
    const theme = this.themes.get(themeId);

    if (!theme) {
      console.warn(`Theme not found: ${themeId}`);
      return;
    }

    this.currentThemeId = themeId;
    this.notifyThemeChange(theme);
  }

  /**
   * Toggles between light and dark theme
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newThemeId = currentTheme.type === 'light' ? 'dark' : 'light';
    this.setCurrentTheme(newThemeId);
  }

  /**
   * Registers a theme change listener
   */
  onThemeChange(listener: (theme: Theme) => void): () => void {
    this.themeChangeListeners.push(listener);
    return () => {
      const index = this.themeChangeListeners.indexOf(listener);
      if (index >= 0) {
        this.themeChangeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifies theme change listeners
   */
  private notifyThemeChange(theme: Theme): void {
    for (const listener of this.themeChangeListeners) {
      listener(theme);
    }
  }
}

/**
 * Global theme registry instance
 */
export const themeRegistry = new ThemeRegistry();
