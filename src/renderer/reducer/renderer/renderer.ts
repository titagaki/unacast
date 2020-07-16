import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../../actions/renderer';

export const initialState: {
  /** 設定 */
  config: typeof globalThis.config;
  /** サーバー起動中 */
  isRunning: boolean;
  status: {
    bbs: {
      message: string;
    }[];
    twitch: {
      message: string;
    };
    youtube: {
      message: string;
      liveId: string;
    };
    niconico: {
      message: string;
    };
  };
} = {
  config: {
    url: '',
    resNumber: '',
    initMessage: '',
    port: 3000,
    dispNumber: 0,
    interval: 1000,
    youtubeId: '',
    twitchId: '',
    niconicoId: '',
    dispSort: true,
    newLine: true,
    showIcon: true,
    showNumber: true,
    showName: true,
    showTime: true,
    wordBreak: true,
    thumbnail: 0,
    sePath: '',
    playSe: true,
    playSeVolume: 50,
    typeYomiko: 'none',
    tamiyasuPath: '',
    bouyomiPort: 0,
    bouyomiVolume: 50,
    notifyThreadConnectionErrorLimit: 0,
    notifyThreadResLimit: 0,
    commentProcessType: 0,
    dispType: 0,
  },
  isRunning: false,
  status: {
    bbs: [
      {
        message: 'none',
      },
    ],
    youtube: {
      message: 'none',
      liveId: 'none',
    },
    twitch: {
      message: 'none',
    },
    niconico: {
      message: 'none',
    },
  },
};

export type ReducerType = typeof initialState;
type Action = ActionType<typeof actions>;

const renderer = (state: ReducerType = initialState, action: Action): ReducerType => {
  switch (action.type) {
    case getType(actions.updateConfig):
      return { ...state, config: action.payload };
    case getType(actions.updateRunningState):
      return { ...state, isRunning: action.payload };
    default:
      return state;
  }
};

export default renderer;
