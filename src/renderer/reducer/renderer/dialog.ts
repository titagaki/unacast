import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../../actions/dialog';

export type DialogType = {
  type: 'alert' | 'confirm';
  open: boolean;
  message: string;
};
const initialState: DialogType = {
  type: 'alert',
  open: false,
  message: '',
};
type Action = ActionType<typeof actions>;

const dialog = (state: DialogType = initialState, action: Action): DialogType => {
  switch (action.type) {
    case getType(actions.updateDialog):
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default dialog;
