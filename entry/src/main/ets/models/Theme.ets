/**
 * Theme Models - نماذج السمات
 * تحدد ألوان وأنماط التطبيق
 */

export interface ThemeColors {
  // Background colors
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  editorBg: string;
  sidebarBg: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Border colors
  border: string;
  borderLight: string;

  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;

  // Git colors
  gitAdded: string;
  gitModified: string;
  gitDeleted: string;
  gitConflict: string;

  // Syntax highlighting (for editor)
  syntaxKeyword: string;
  syntaxString: string;
  syntaxComment: string;
  syntaxFunction: string;
  syntaxVariable: string;
  syntaxNumber: string;
}

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  type: 'dark' | 'light' | 'high-contrast';
  colors: ThemeColors;
  monacoTheme: 'vs-dark' | 'vs-light' | 'hc-black';
}

export class ThemePresets {
  /**
   * Dark Theme (VS Code Dark+)
   */
  static readonly DARK: Theme = {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark Theme',
    type: 'dark',
    monacoTheme: 'vs-dark',
    colors: {
      primaryBg: '#1E1E1E',
      secondaryBg: '#252526',
      tertiaryBg: '#2D2D30',
      editorBg: '#1E1E1E',
      sidebarBg: '#252526',

      textPrimary: '#D4D4D4',
      textSecondary: '#858585',
      textMuted: '#6A6A6A',

      accent: '#007ACC',
      accentHover: '#1C97EA',

      border: '#3E3E42',
      borderLight: '#2D2D30',

      success: '#4EC9B0',
      error: '#F48771',
      warning: '#CE9178',
      info: '#75BEFF',

      gitAdded: '#81B88B',
      gitModified: '#E2C08D',
      gitDeleted: '#C74E39',
      gitConflict: '#E51400',

      syntaxKeyword: '#C586C0',
      syntaxString: '#CE9178',
      syntaxComment: '#6A9955',
      syntaxFunction: '#DCDCAA',
      syntaxVariable: '#9CDCFE',
      syntaxNumber: '#B5CEA8'
    }
  };

  /**
   * Light Theme (VS Code Light+)
   */
  static readonly LIGHT: Theme = {
    id: 'light',
    name: 'light',
    displayName: 'Light Theme',
    type: 'light',
    monacoTheme: 'vs-light',
    colors: {
      primaryBg: '#FFFFFF',
      secondaryBg: '#F3F3F3',
      tertiaryBg: '#E5E5E5',
      editorBg: '#FFFFFF',
      sidebarBg: '#F3F3F3',

      textPrimary: '#000000',
      textSecondary: '#616161',
      textMuted: '#8E8E8E',

      accent: '#0066BF',
      accentHover: '#005A9E',

      border: '#E5E5E5',
      borderLight: '#EBEBEB',

      success: '#14A37F',
      error: '#E51400',
      warning: '#BF8803',
      info: '#0066BF',

      gitAdded: '#587C0C',
      gitModified: '#895503',
      gitDeleted: '#AD0707',
      gitConflict: '#E51400',

      syntaxKeyword: '#AF00DB',
      syntaxString: '#A31515',
      syntaxComment: '#008000',
      syntaxFunction: '#795E26',
      syntaxVariable: '#001080',
      syntaxNumber: '#098658'
    }
  };

  /**
   * High Contrast Theme
   */
  static readonly HIGH_CONTRAST: Theme = {
    id: 'high-contrast',
    name: 'high-contrast',
    displayName: 'High Contrast Theme',
    type: 'high-contrast',
    monacoTheme: 'hc-black',
    colors: {
      primaryBg: '#000000',
      secondaryBg: '#000000',
      tertiaryBg: '#1A1A1A',
      editorBg: '#000000',
      sidebarBg: '#000000',

      textPrimary: '#FFFFFF',
      textSecondary: '#FFFFFF',
      textMuted: '#C0C0C0',

      accent: '#00FFFF',
      accentHover: '#00E5E5',

      border: '#6FC3DF',
      borderLight: '#6FC3DF',

      success: '#00FF00',
      error: '#FF0000',
      warning: '#FFFF00',
      info: '#00FFFF',

      gitAdded: '#00FF00',
      gitModified: '#FFFF00',
      gitDeleted: '#FF0000',
      gitConflict: '#FF00FF',

      syntaxKeyword: '#569CD6',
      syntaxString: '#CE9178',
      syntaxComment: '#7CA668',
      syntaxFunction: '#DCDCAA',
      syntaxVariable: '#9CDCFE',
      syntaxNumber: '#B5CEA8'
    }
  };

  /**
   * Get all available themes
   */
  static getAllThemes(): Theme[] {
    return [
      ThemePresets.DARK,
      ThemePresets.LIGHT,
      ThemePresets.HIGH_CONTRAST
    ];
  }

  /**
   * Get theme by ID
   */
  static getThemeById(id: string): Theme {
    switch (id) {
      case 'light':
        return ThemePresets.LIGHT;
      case 'high-contrast':
        return ThemePresets.HIGH_CONTRAST;
      case 'dark':
      default:
        return ThemePresets.DARK;
    }
  }
}
