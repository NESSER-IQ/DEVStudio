/**
 * Dark theme definition
 */

import { Theme, ThemeColors } from './types';

/**
 * Dark theme colors
 */
const darkThemeColors: ThemeColors = {
  // Editor colors
  editorBackground: '#1e1e1e',
  editorForeground: '#d4d4d4',
  editorLineNumberForeground: '#858585',
  editorLineNumberActiveForeground: '#c6c6c6',
  editorCursorForeground: '#aeafad',
  editorSelectionBackground: '#264f78',
  editorInactiveSelectionBackground: '#3a3d41',

  // Syntax highlighting colors
  syntaxKeyword: '#569cd6',
  syntaxString: '#ce9178',
  syntaxNumber: '#b5cea8',
  syntaxComment: '#6a9955',
  syntaxOperator: '#d4d4d4',
  syntaxFunction: '#dcdcaa',
  syntaxVariable: '#9cdcfe',
  syntaxType: '#4ec9b0',
  syntaxConstant: '#4fc1ff',

  // UI colors
  activityBarBackground: '#333333',
  activityBarForeground: '#ffffff',
  activityBarBorder: '#333333',

  sideBarBackground: '#252526',
  sideBarForeground: '#cccccc',
  sideBarBorder: '#2c2c2c',

  titleBarBackground: '#3c3c3c',
  titleBarForeground: '#cccccc',
  titleBarBorder: '#3c3c3c',

  statusBarBackground: '#0066cc',
  statusBarForeground: '#ffffff',
  statusBarBorder: '#0066cc',

  tabActiveBackground: '#1e1e1e',
  tabActiveForeground: '#ffffff',
  tabInactiveBackground: '#2d2d2d',
  tabInactiveForeground: '#969696',
  tabBorder: '#2c2c2c',

  // Other UI colors
  buttonBackground: '#0e639c',
  buttonForeground: '#ffffff',
  buttonHoverBackground: '#1177bb',

  inputBackground: '#3c3c3c',
  inputForeground: '#cccccc',
  inputBorder: '#3c3c3c',

  listActiveSelectionBackground: '#094771',
  listActiveSelectionForeground: '#ffffff',
  listHoverBackground: '#2a2d2e',
  listFocusBackground: '#062f4a',

  scrollbarSlider: '#79797966',
  scrollbarSliderHover: '#64646466',
  scrollbarSliderActive: '#bfbfbf66',

  // Border colors
  borderColor: '#2c2c2c',
  focusBorder: '#0066cc',

  // Error and warning colors
  errorForeground: '#f48771',
  warningForeground: '#cca700',
  infoForeground: '#75beff'
};

/**
 * Dark theme
 */
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  type: 'dark',
  colors: darkThemeColors
};
