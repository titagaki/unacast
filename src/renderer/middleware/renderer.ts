import { call, take, takeEvery, fork, put, race, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import log from 'electron-log';
import { electronEvent } from '../../main/const';
import { sleep } from '../../main/util';
import electron, { shell } from 'electron';
import { RootState } from '../reducer/renderer';
import { DialogType } from '../reducer/renderer/dialog';
const ipcRenderer = electron.ipcRenderer;

export default function* rootSaga() {
  yield call(loadConfigToLocalStrage);
  yield takeEvery(getType(actions.startServer), startServer);
  yield takeEvery(getType(actions.stopServer), stopServer);
  yield takeEvery(getType(actions.applyConfig), applyConfig);
}

/** サーバー起動 */
function* startServer(action: ReturnType<typeof actions.startServer>) {
  try {
    //設定情報取得
    const config = action.payload;
    console.log('[renderer.js]config=');
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);
    yield put(actions.updateConfig(config));

    // URLとポートを指定していない場合はエラー
    if (config.url === null || config.url.length < 1 || config.port === null || (config.port as any).length < 1) {
      yield call(dialogHandler, { type: 'alert', message: '入力値に不備があります。' });
      return;
    }

    // サーバー開始メッセージを送信する
    yield put(actions.updateRunningState(true));
    ipcRenderer.send('start-server', config);
  } catch (e) {
    console.error(e);
  }
}

/** サーバー停止 */
function* stopServer(action: ReturnType<typeof actions.stopServer>) {
  // ダイアログ表示
  const result: boolean = yield call(dialogHandler, { type: 'confirm', message: 'サーバーを停止しますか？' });
  // OKなら停止
  if (result) {
    yield put(actions.updateRunningState(false));
    ipcRenderer.send('stop-server');
  }
}

/** 設定適用 */
function* applyConfig(action: ReturnType<typeof actions.applyConfig>) {
  try {
    yield put(actions.updateConfig(action.payload));

    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(action.payload);
    ipcRenderer.send(electronEvent['apply-config'], action.payload);
  } catch (e) {
    console.error(e);
  }
}

/** ダイアログ制御 */
function* dialogHandler(dialog: Partial<DialogType>) {
  const state: RootState = yield select();
  // ダイアログ表示
  yield put(actions.updateDialog({ ...dialog, open: true }));

  // ボタン待ち
  const { ok } = yield race({
    ok: take(getType(actions.dialogOkClick)),
    cancel: take(getType(actions.dialogCancelClick)),
  });
  // ダイアログ消す
  yield put(actions.updateDialog({ open: false }));

  return !!ok;
}

/**
 * 設定をローカルストレージへ保存する
 * サーバー起動時に呼び出される
 */
const saveConfigToLocalStrage = (config: typeof globalThis['config']) => {
  localStorage.setItem('config', JSON.stringify(config));
};

/**
 * ローカルストレージから設定をロードする
 */
function* loadConfigToLocalStrage() {
  const initConfig: typeof globalThis['config'] = {
    url: '',
    resNumber: '',
    initMessage: 'スレッド読み込みを開始しました',
    port: 3000,
    interval: 10,
    dispNumber: NaN,
    youtubeId: '',
    twitchId: '',
    niconicoId: '',
    dispSort: false,
    newLine: true,
    showIcon: true,
    showNumber: true,
    showName: false,
    showTime: false,
    wordBreak: true,
    thumbnail: 0,
    sePath: '',
    playSeVolume: 100,
    playSe: false,
    typeYomiko: 'none',
    tamiyasuPath: '',
    bouyomiPort: 50001,
    bouyomiVolume: 50,
    notifyThreadConnectionErrorLimit: 0,
    notifyThreadResLimit: 0,
    commentProcessType: 0,
    dispType: 0,
  };

  const storageStr = localStorage.getItem('config');
  const storageJson: typeof globalThis['config'] = storageStr ? JSON.parse(storageStr) : {};

  const config = {
    ...initConfig,
    ...storageJson,
  };
  yield put(actions.updateConfig(config));

  // // 表示に反映する
  // // アイコン表示初期化
  // (document.getElementById('checkbox-showIcon') as any).checked = config.showIcon;
  // // レス番表示初期化
  // (document.getElementById('checkbox-showNumber') as any).checked = config.showNumber;
  // // 名前表示初期化
  // (document.getElementById('checkbox-showName') as any).checked = config.showName;
  // // 時刻表示初期化
  // (document.getElementById('checkbox-showTime') as any).checked = config.showTime;
  // // 自動改行初期化
  // (document.getElementById('checkbox-wordBreak') as any).checked = config.wordBreak;
  // // レス表示順ラジオ初期化
  // if (config.dispSort) {
  //   (document.getElementById('newResDown') as any).checked = true;
  // } else {
  //   (document.getElementById('newResUp') as any).checked = true;
  // }

  // // 改行設定初期化
  // if (config.newLine) {
  //   (document.getElementById('enableNewLine') as any).checked = true;
  // } else {
  //   (document.getElementById('disableNewLine') as any).checked = true;
  // }

  // (document.getElementById('text-port-number') as any).value = config.port;
  // (document.getElementById('spanDisp') as any).innerHTML = config.interval;
  // (document.getElementById('rangeSpan') as any).value = config.interval;
  // (document.getElementById('text-init-message') as any).value = config.initMessage;
  // (document.getElementById('text-url') as any).value = config.url;
  // (document.getElementById('text-res-number') as any).value = config.resNumber.toString();
  // (document.getElementById('text-youtube-id') as any).value = config.youtubeId;
  // (document.getElementById('text-twitch-id') as any).value = config.twitchId;
  // (document.getElementById('text-niconico-id') as any).value = config.niconicoId;
  // // レス着信音
  // (document.getElementById('text-se-path') as any).value = config.sePath;
  // (document.getElementById('checkbox-playSe') as any).checked = config.playSe;
  // (document.getElementById('disp-playSe-volume') as any).innerHTML = config.playSeVolume;
  // (document.getElementById('playSe-volume') as any).value = config.playSeVolume;

  // // サムネイル表示
  // (document.getElementById(`thumbnail_${config.thumbnail}`) as any).checked = true;

  // // 読み子の種類
  // switch (config.typeYomiko) {
  //   case 'none':
  //     (document.getElementById('yomiko_none') as any).checked = true;
  //     break;
  //   case 'tamiyasu':
  //     (document.getElementById('yomiko_tamiyasu') as any).checked = true;
  //     break;
  //   case 'bouyomi':
  //     (document.getElementById('yomiko_bouyomi') as any).checked = true;
  //     break;
  // }

  // switch (config.commentProcessType) {
  //   case 0:
  //   case 1:
  //     (document.getElementById(`commentProcessType_${config.commentProcessType}`) as any).checked = true;
  //     break;
  // }

  // switch (config.dispType) {
  //   case 0:
  //   case 1:
  //     (document.getElementById(`dispType_${config.dispType}`) as any).checked = true;
  //     break;
  // }

  // (document.getElementById('text-tamiyasu-path') as any).value = config.tamiyasuPath;
  // (document.getElementById('text-bouyomi-port') as any).value = config.bouyomiPort;
  // (document.getElementById('disp-bouyomi-volume') as any).innerHTML = config.bouyomiVolume;
  // (document.getElementById('bouyomi-volume') as any).value = config.bouyomiVolume;
  // (document.getElementById('text-notify-threadConnectionErrorLimit') as any).value = config.notifyThreadConnectionErrorLimit;
  // (document.getElementById('text-notify-threadResLimit') as any).value = config.notifyThreadResLimit;

  // console.debug('[renderer.js]config loaded');
}

// 着信音再生
const audioElem = new Audio();
ipcRenderer.on(electronEvent['play-sound-start'], (event: any, arg: { wavfilepath: string; volume: number }) => {
  try {
    audioElem.volume = arg.volume / 100;
    audioElem.src = arg.wavfilepath;
    audioElem.play();
    audioElem.onended = () => {
      ipcRenderer.send(electronEvent['play-sound-end']);
    };
    audioElem.onerror = () => {
      ipcRenderer.send(electronEvent['play-sound-end']);
    };
  } catch (e) {
    log.error(e);
    ipcRenderer.send(electronEvent['play-sound-end']);
  }
});

ipcRenderer.on(electronEvent['wait-yomiko-time'], async (event: any, arg: string) => {
  await yomikoTime(arg);
  ipcRenderer.send(electronEvent['speaking-end']);
});

/**
 * 音声合成が終わってそうな頃にreturn返す
 * @param 読み込む文章
 */
const yomikoTime = async (msg: string) => {
  return new Promise((resolve) => {
    const uttr = new globalThis.SpeechSynthesisUtterance(msg);
    uttr.volume = 0;
    uttr.onend = (event) => {
      resolve();
    };
    speechSynthesis.speak(uttr);

    // 10秒経ったら強制的に終わらせる
    sleep(10 * 1000).then(() => {
      resolve();
    });
  });
};

// 何かしら通知したいことがあったら表示する
ipcRenderer.on(electronEvent['show-alert'], async (event: any, args: string) => {
  // 停止確認ダイアログ
  ((document.getElementById('alert-dialog') as HTMLElement).getElementsByClassName('mdl-dialog__content')[0] as HTMLElement).innerText = args;

  const alertDialog = document.getElementById('alert-dialog') as HTMLElement;
  (alertDialog as any).showModal();
});

// 何かしら通知したいことがあったら表示する
ipcRenderer.on(electronEvent.UPDATE_STATUS, function* (event: any, args: { commentType: 'bbs' | 'youtube' | 'twitch' | 'niconico'; category: string; message: string }) {
  console.log(`[UPDATE_STATUS]`);
  switch (args.commentType) {
    case 'bbs': {
      (document.getElementById('bbs-connection-status') as HTMLElement).innerText = args.message;
      break;
    }
    case 'youtube': {
      if (args.category === 'status') {
        yield put(actions.updateRunningState(true));
        (document.getElementById('youtube-connection-status') as HTMLElement).innerText = args.message;
      } else {
        (document.getElementById('youtube-live-id') as HTMLElement).innerText = args.message;
      }
      break;
    }
    case 'twitch': {
      (document.getElementById('twitch-connection-status') as HTMLElement).innerText = args.message;
      break;
    }
    case 'niconico': {
      if (args.category === 'status') {
        (document.getElementById('niconico-connection-status') as HTMLElement).innerText = args.message;
      }
      break;
    }
  }
});
