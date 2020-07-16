import { deprecated } from 'typesafe-actions';
const { createAction } = deprecated;
import { DialogType } from '../reducer/renderer/dialog';

export const dialogOkClick = createAction('DIALOG_OK_CLICK', (action) => {
  return () => action();
});

export const dialogCancelClick = createAction('DIALOG_CANCEL_CLICK', (action) => {
  return () => action();
});

export const updateDialog = createAction('UPDATE_DIALOG', (action) => {
  return (config: Partial<DialogType>) => action(config);
});
