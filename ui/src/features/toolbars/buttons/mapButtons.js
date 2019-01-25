import * as buttons from './';

export const mappedButtons = {
  [buttons.SET_VIEW_2D]: {
    name: 'SetView',
    value: '2d',
    type: 'string',
    alias: 'SET_VIEW_2D'
  },
  [buttons.SET_VIEW_3D]: {
    name: 'SetView',
    value: '3d',
    type: 'string',
    alias: 'SET_VIEW_3D'
  },
  [buttons.SET_WALK_MODE]: {
    name: 'SetView',
    value: 'walk',
    type: 'string',
    alias: 'SET_WALK_MODE'
  },
  [buttons.CENTER_VIEW]: {
    name: 'SetCameraToCenter',
    type: 'bool',
    alias: 'CENTER_VIEW'
  },
  [buttons.CAMERA_ZOOM]: {
    name: 'SetCameraZoom',
    type: 'number',
    alias: 'CAMERA_ZOOM'
  },
  [buttons.SHOW_CUSTOM_CAMERAS]: {
    name: 'ShowCustomCams',
    type: 'bool',
    alias: 'SHOW_CUSTOM_CAMERAS'
  },
  [buttons.SET_SUN]: {
    name: 'ShowSun',
    type: 'bool',
    alias: 'SET_SUN'
  },
  [buttons.SHOW_GRID]: {
    name: 'ShowGrid',
    type: 'bool',
    alias: 'SHOW_GRID'
  },
  [buttons.GET_INFO_FOR_BUG_REPORT]: {
    name: 'GetInfoForBugreport',
    value: 'getInfoForBugReport',
    type: 'bool',
    alias: 'GET_INFO_FOR_BUG_REPORT'
  },
  [buttons.SHOW_HELP]: {
    name: 'EditorShowHelp',
    value: '',
    type: 'bool',
    alias: 'SHOW_HELP'
  },
}
