/**
 * Theme types and interfaces
 */

/**
 * Color definition
 */
export interface ThemeColors {
  // Editor colors
  editorBackground: string;
  editorForeground: string;
  editorLineNumberForeground: string;
  editorLineNumberActiveForeground: string;
  editorCursorForeground: string;
  editorSelectionBackground: string;
  editorInactiveSelectionBackground: string;

  // Syntax highlighting colors
  syntaxKeyword: string;
  syntaxString: string;
  syntaxNumber: string;
  syntaxComment: string;
  syntaxOperator: string;
  syntaxFunction: string;
  syntaxVariable: string;
  syntaxType: string;
  syntaxConstant: string;

  // UI colors
  activityBarBackground: string;
  activityBarForeground: string;
  activityBarBorder: string;

  sideBarBackground: string;
  sideBarForeground: string;
  sideBarBorder: string;

  titleBarBackground: string;
  titleBarForeground: string;
  titleBarBorder: string;

  statusBarBackground: string;
  statusBarForeground: string;
  statusBarBorder: string;

  tabActiveBackground: string;
  tabActiveForeground: string;
  tabInactiveBackground: string;
  tabInactiveForeground: string;
  tabBorder: string;

  // Other UI colors
  buttonBackground: string;
  buttonForeground: string;
  buttonHoverBackground: string;

  inputBackground: string;
  inputForeground: string;
  inputBorder: string;

  listActiveSelectionBackground: string;
  listActiveSelectionForeground: string;
  listHoverBackground: string;
  listFocusBackground: string;

  scrollbarSlider: string;
  scrollbarSliderHover: string;
  scrollbarSliderActive: string;

  // Border colors
  borderColor: string;
  focusBorder: string;

  // Error and warning colors
  errorForeground: string;
  warningForeground: string;
  infoForeground: string;
}

/**
 * Theme definition
 */
export interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark';
  colors: ThemeColors;
}

/**
 * Theme registry interface
 */
export interface IThemeRegistry {
  registerTheme(theme: Theme): void;
  unregisterTheme(themeId: string): void;
  getTheme(themeId: string): Theme | undefined;
  getAllThemes(): Theme[];
  getThemesByType(type: 'light' | 'dark'): Theme[];
}
