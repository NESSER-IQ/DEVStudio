/**
 * Light theme definition
 */

import { Theme, ThemeColors } from './types';

/**
 * Light theme colors
 */
const lightThemeColors: ThemeColors = {
  // Editor colors
  editorBackground: '#ffffff',
  editorForeground: '#000000',
  editorLineNumberForeground: '#858585',
  editorLineNumberActiveForeground: '#0066cc',
  editorCursorForeground: '#000000',
  editorSelectionBackground: '#add6ff',
  editorInactiveSelectionBackground: '#e5ebf1',

  // Syntax highlighting colors
  syntaxKeyword: '#0000ff',
  syntaxString: '#a31515',
  syntaxNumber: '#098658',
  syntaxComment: '#008000',
  syntaxOperator: '#000000',
  syntaxFunction: '#795e26',
  syntaxVariable: '#001080',
  syntaxType: '#267f99',
  syntaxConstant: '#0070c1',

  // UI colors
  activityBarBackground: '#2c2c2c',
  activityBarForeground: '#ffffff',
  activityBarBorder: '#2c2c2c',

  sideBarBackground: '#f3f3f3',
  sideBarForeground: '#000000',
  sideBarBorder: '#e0e0e0',

  titleBarBackground: '#dddddd',
  titleBarForeground: '#000000',
  titleBarBorder: '#cccccc',

  statusBarBackground: '#0066cc',
  statusBarForeground: '#ffffff',
  statusBarBorder: '#0066cc',

  tabActiveBackground: '#ffffff',
  tabActiveForeground: '#000000',
  tabInactiveBackground: '#ececec',
  tabInactiveForeground: '#858585',
  tabBorder: '#e0e0e0',

  // Other UI colors
  buttonBackground: '#0066cc',
  buttonForeground: '#ffffff',
  buttonHoverBackground: '#005bb5',

  inputBackground: '#ffffff',
  inputForeground: '#000000',
  inputBorder: '#cecece',

  listActiveSelectionBackground: '#0066cc',
  listActiveSelectionForeground: '#ffffff',
  listHoverBackground: '#e8e8e8',
  listFocusBackground: '#d6ebff',

  scrollbarSlider: '#79797966',
  scrollbarSliderHover: '#64646466',
  scrollbarSliderActive: '#00000099',

  // Border colors
  borderColor: '#e0e0e0',
  focusBorder: '#0066cc',

  // Error and warning colors
  errorForeground: '#f14c4c',
  warningForeground: '#ff8c00',
  infoForeground: '#0066cc'
};

/**
 * Light theme
 */
export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  type: 'light',
  colors: lightThemeColors
};
