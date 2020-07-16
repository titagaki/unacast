import { combineReducers } from 'redux';
import renderer, { ReducerType } from './renderer';
import dialog, { DialogType } from './dialog';

const reducers = {
  dialog,
  renderer,
};

export type RootState = {
  dialog: DialogType;
  renderer: ReducerType;
};

export default combineReducers(reducers);
