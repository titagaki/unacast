import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Paper, Typography, makeStyles, Theme, Button, TextField, Tooltip, IconButton } from '@material-ui/core';
import * as actions from '../actions/renderer';
import Dialog from './dialog';
import { RootState } from '../reducer/renderer';
import { shell } from 'electron';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '5px 1em 5px 1em',
  },
  button: {
    margin: 5,
  },
  helpButton: {
    padding: 0,
  },
}));

// state
const mapStateToProps = (state: RootState) => {
  return {
    isRunning: state.renderer.isRunning,
    config: state.renderer.config,
    status: state.renderer.status,
  };
};

// action
const mapDispatchToProps = {
  startServer: actions.startServer,
  stopServer: actions.stopServer,
  applyConfig: actions.applyConfig,
};

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;
type Props = ComponentProps & ActionProps;

const urlopen = (url: string) => {
  let tmp = url;
  if (url.match(/^ttp/)) {
    tmp = `h${url}`;
  }
  // console.log(tmp);
  shell.openExternal(tmp);
};

const HelpTooltip = (props: { message: ReactNode }) => {
  const classes = useStyles({});

  return (
    <div style={{ float: 'right' }}>
      <Tooltip title={<div>{props.message}</div>} placement="left-end">
        <IconButton classes={{ root: classes.helpButton }}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const App: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles({});

  const [config, setConfig] = React.useState(props.config);
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [event.target.name]: event.target.value,
    });
  };
  const onChangeInputNumberText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [event.target.name]: Number(event.target.value),
    });
  };

  const showVal = (id: string, newVal: string) => {
    const dom = document.getElementById(`${id}`);
    if (dom) dom.innerText = newVal;
  };

  const startServer = () => {
    props.startServer(config);
  };

  const stopServer = () => props.stopServer();
  const applyConfig = () => {
    props.applyConfig(config);
  };

  return (
    <Paper className={classes.root}>
      <div>
        <div style={{ marginRight: 10 }}>
          <HelpTooltip message={<span>サーバー起動、適用ボタンクリックで設定が反映されます。</span>} />
        </div>
        <div>
          <Button className={classes.button} variant={'contained'} color={'default'} onClick={applyConfig}>
            適用
          </Button>

          <Button className={classes.button} variant={'contained'} color={'primary'} onClick={startServer} disabled={props.isRunning}>
            サーバー起動
          </Button>

          <Button className={classes.button} variant={'contained'} color={'secondary'} onClick={stopServer} disabled={!props.isRunning}>
            停止
          </Button>
        </div>

        <div className="block">
          <div>
            {!props.isRunning && (
              <div>
                <HelpTooltip
                  message={
                    <span>
                      サーバーが稼働するポート番号です。
                      <br />
                      他のアプリケーションが使用していない番号を指定してください。
                      <br />
                      配信PCで本アプリケーションを動かす場合、ポート開放の必要はありません。
                    </span>
                  }
                />

                <div className="subtitle">ポート番号</div>
                <div className="labeledInputArea">
                  <span>http://localhost:</span>
                  <TextField name="port" required={true} inputProps={{ pattern: '[0-9]{0,4}?' }} value={config.port} onChange={onChangeInputNumberText} />
                </div>
              </div>
            )}
            {props.isRunning && (
              <div>
                <div className="subtitle">サーバーURL</div>
                <div style={{ cursor: 'pointer', color: 'blue', width: 'fit-content' }} onClick={() => urlopen(`http://localhost:${config.port}`)}>
                  {`http://localhost:${config.port}`}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="block">
          <HelpTooltip message={<span>サーバ起動中に掲示板URLを変更した場合、最新の1レスがコメント欄に表示されます。</span>} />
          <Typography variant={'h6'}>レス・コメント取得先</Typography>
          <div>
            <div>
              <div className="subtitle">掲示板URL</div>
              <TextField
                name="url"
                required={true}
                fullWidth={true}
                inputProps={{ pattern: 'http.?://.+/$' }}
                value={config.url}
                onChange={onChangeInputText}
                placeholder={'https://jbbs.shitaraba.net/bbs/read.cgi/game/51638/1587841373/'}
              />
            </div>
            <div className="bbsStatusArea">
              <span className="status">
                <span className="status-label">status:</span>
                <span>{props.status.bbs[0]?.message}</span>
              </span>
            </div>
          </div>

          <div>
            <div className="subtitle">Youtube チャンネルID</div>
            <div className="labeledInputArea">
              <span>https://www.youtube.com/channel/</span>
              <TextField name="youtubeId" fullWidth={true} inputProps={{ pattern: '^(?!.*http.?:)(?!.*/.*).*$' }} value={config.youtubeId} onChange={onChangeInputText} />/
            </div>
            <div className="youtubeStatusArea">
              <span className="status">
                <span className="status-label">status:</span>
                <span>{props.status.youtube.message}</span>
              </span>
              <span className="status">
                <span className="status-label">liveId:</span>
                <span>{props.status.youtube.liveId}</span>
              </span>
            </div>
          </div>

          <div>
            <div className="subtitle">Twitch ユーザID</div>
            <div className="labeledInputArea">
              <span>https://www.twitch.tv/</span>
              <TextField name="twitchId" fullWidth={true} inputProps={{ pattern: '^(?!.*http.?:)(?!.*/.*).*$' }} value={config.twitchId} onChange={onChangeInputText} />/
            </div>
          </div>
          <div className="twitchStatusArea">
            <span className="status">
              <span className="status-label">status:</span>
              <span>{props.status.twitch.message}</span>
            </span>
          </div>

          <div>
            <div className="subtitle">ニコニココミュニティID</div>
            <div className="labeledInputArea">
              <span>https://com.nicovideo.jp/community/</span>
              <TextField name="niconicoId" fullWidth={true} inputProps={{ pattern: '^(?!.*http.?:)(?!.*/.*).*$' }} value={config.niconicoId} />/
            </div>
          </div>
          <div className="niconicoStatusArea">
            <span className="status">
              <span className="status-label">status:</span>
              <span id="niconico-connection-status">none</span>
            </span>
          </div>
        </div>

        <div className="block">
          <Typography variant={'h6'}>掲示板取得設定</Typography>
          <div>
            <div className="subtitle">開始レス番号</div>
            <div className="caption">サーバ起動後、ブラウザからの初回アクセス時に表示するレスの開始番号です。省略した場合は表示しません。</div>
            <input id="text-res-number" type="text" pattern="[0-9]{0,3}?" value="" />
            <span className="mdl-textfield__error">0-999 までの数値を入れてください</span>
          </div>

          <p>
            更新間隔 <span id="spanDisp">10</span>秒
          </p>
          <p style={{ width: '80%' }}>
            <input
              id="rangeSpan"
              className="mdl-slider mdl-js-slider"
              type="range"
              min="5"
              max="30"
              value="10"
              tabIndex={0}
              onChange={(event) => showVal('spanDisp', event.currentTarget.value)}
            />
          </p>
        </div>

        <div className="block">
          <Typography variant={'h6'}>表示設定</Typography>
          <div>
            <div className="subtitle">表示タイプ</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="dispType_0">
              <input id="dispType_0" className="mdl-radio__button" type="radio" name="dispType" value="0" />
              <span className="mdl-radio__label">チャット風</span>
            </label>

            <label className="mdl-radio mdl-js-radio" htmlFor="dispType_1">
              <input id="dispType_1" className="mdl-radio__button" type="radio" name="dispType" value="1" />
              <span className="mdl-radio__label">SpeechCast風</span>
            </label>
          </div>

          <div>
            <div className="subtitle">初期表示テキスト</div>
            <div className="caption">SpeechCast風表示ではレスが無い時の字幕になります。</div>
            <input id="text-init-message" type="text" value="" />
          </div>

          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-showIcon">
            <input type="checkbox" id="checkbox-showIcon" className="mdl-checkbox__input" value="1" checked />
            <span className="mdl-checkbox__label">アイコン表示</span>
          </label>

          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-showNumber">
            <input type="checkbox" id="checkbox-showNumber" className="mdl-checkbox__input" value="1" checked />
            <span className="mdl-checkbox__label">レス番表示(掲示板レスのみ有効)</span>
          </label>

          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-showName">
            <input type="checkbox" id="checkbox-showName" className="mdl-checkbox__input" value="1" checked />
            <span className="mdl-checkbox__label">名前表示</span>
          </label>

          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-showTime">
            <input type="checkbox" id="checkbox-showTime" className="mdl-checkbox__input" value="1" checked />
            <span className="mdl-checkbox__label">時刻表示(掲示板レスのみ有効)</span>
          </label>

          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-wordBreak">
            <input type="checkbox" id="checkbox-wordBreak" className="mdl-checkbox__input" value="1" checked />
            <span className="mdl-checkbox__label">横幅超過時に自動改行する</span>
          </label>

          <div className="mdl-textfield mdl-js-textfield">
            <div className="subtitle">レス表示順序</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="newResUp">
              <input id="newResUp" className="mdl-radio__button" type="radio" name="dispSort" />
              <span className="mdl-radio__label">新着が上</span>
            </label>

            <label className="mdl-radio mdl-js-radio" htmlFor="newResDown">
              <input id="newResDown" className="mdl-radio__button" type="radio" name="dispSort" />
              <span className="mdl-radio__label">新着が下</span>
            </label>
          </div>

          <div className="mdl-textfield mdl-js-textfield">
            <div className="subtitle">名前と本文を改行で分ける</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="disableNewLine">
              <input id="disableNewLine" className="mdl-radio__button" type="radio" name="newLine" />
              <span className="mdl-radio__label">分けない</span>
            </label>
            <label className="mdl-radio mdl-js-radio" htmlFor="enableNewLine">
              <input id="enableNewLine" className="mdl-radio__button" type="radio" name="newLine" />
              <span className="mdl-radio__label">分ける</span>
            </label>
          </div>

          <div>
            <div className="subtitle">画像URLのサムネイル表示</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="thumbnail_0">
              <input id="thumbnail_0" className="mdl-radio__button" type="radio" name="thumbnail" value="0" />
              <span className="mdl-radio__label">非表示</span>
            </label>
            <label className="mdl-radio mdl-js-radio" htmlFor="thumbnail_1">
              <input id="thumbnail_1" className="mdl-radio__button" type="radio" name="thumbnail" value="1" />
              <span className="mdl-radio__label">チャット欄に表示</span>
            </label>
            <label className="mdl-radio mdl-js-radio" htmlFor="thumbnail_2">
              <input id="thumbnail_2" className="mdl-radio__button" type="radio" name="thumbnail" value="2" />
              <span className="mdl-radio__label">チャット欄＋サーバに表示</span>
            </label>
          </div>
        </div>
        <div className="block">
          <h5>レス・コメント着信音設定</h5>
          <div style={{ width: 600 }}>
            <div className="subtitle">着信音のフォルダパス</div>
            <div className="caption">.wavファイルが含まれたフォルダを入力してください。</div>
            <input type="text" id="text-se-path" placeholder="C:\hogehoge\fugafuga" />

            <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-playSe">
              <input type="checkbox" id="checkbox-playSe" className="mdl-checkbox__input" value="1" checked />
              <span className="mdl-checkbox__label">着信音再生を有効にする</span>
            </label>

            <div>
              <span className="subtitle">音量</span> <span id="disp-playSe-volume">100</span>
              <p style={{ width: '80%' }}>
                <input
                  id="playSe-volume"
                  className="mdl-slider mdl-js-slider"
                  type="range"
                  min="0"
                  max="100"
                  value="100"
                  tabIndex={0}
                  onChange={(event) => showVal('disp-playSe-volume', event.currentTarget.value)}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="block">
          <h5>読み子設定</h5>

          <div style={{ width: '100vw' }}>
            <div className="subtitle">読み子の種類</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="yomiko_none">
              <input id="yomiko_none" className="mdl-radio__button" type="radio" name="typeYomiko" value="none" />
              <span className="mdl-radio__label">使用しない</span>
            </label>

            <label className="mdl-radio mdl-js-radio" htmlFor="yomiko_tamiyasu">
              <input id="yomiko_tamiyasu" className="mdl-radio__button" type="radio" name="typeYomiko" value="tamiyasu" />
              <span className="mdl-radio__label">民安☆Talk</span>
            </label>

            <label className="mdl-radio mdl-js-radio" htmlFor="yomiko_bouyomi">
              <input id="yomiko_bouyomi" className="mdl-radio__button" type="radio" name="typeYomiko" value="bouyomi" />
              <span className="mdl-radio__label">棒読みちゃん</span>
            </label>
          </div>

          <div style={{ width: 600 }}>
            <div className="subtitle">民安☆Talkのファイルパス</div>
            <input type="text" id="text-tamiyasu-path" placeholder="C:\hogehoge\fugafuga\vrx.exe" />
          </div>

          <h5>棒読みちゃん設定</h5>
          <div style={{ width: 600 }}>
            <div className="subtitle">待ち受けポート</div>
            <input type="text" id="text-bouyomi-port" />
          </div>
          <div>
            <span className="subtitle">音量</span> <span id="disp-bouyomi-volume">50</span>
            <p style={{ width: '80%' }}>
              <input
                id="bouyomi-volume"
                className="mdl-slider mdl-js-slider"
                type="range"
                min="-1"
                max="100"
                value="50"
                tabIndex={0}
                onChange={(event) => showVal('disp-bouyomi-volume', event.currentTarget.value)}
              />
            </p>
          </div>
        </div>
        <div className="block">
          <h5>その他</h5>
          <div style={{ width: 600 }}>
            <div className="subtitle">スレのレス番号が超えた時に通知する値(0で使用しない)</div>
            <input id="text-notify-threadResLimit" type="text" required={true} pattern="[0-9]{0,5}?" value="0" />
            <span className="mdl-textfield__error">0-10000 までの数値を入れてください</span>
          </div>

          <div style={{ width: 600 }}>
            <div className="subtitle">掲示板が連続で通信エラーになった時に通知する閾値(0で使用しない)</div>
            <input id="text-notify-threadConnectionErrorLimit" type="text" required={true} pattern="[0-9]{0,2}?" value="0" />
            <span className="mdl-textfield__error">0-99 までの数値を入れてください</span>
          </div>

          <div style={{ width: '100vw' }}>
            <div className="subtitle">レスの処理単位</div>
            <label className="mdl-radio mdl-js-radio" htmlFor="commentProcessType_0">
              <input id="commentProcessType_0" className="mdl-radio__button" type="radio" name="commentProcessType" value="0" />
              <span className="mdl-radio__label">新着を優先(着信音等が鳴ってる場合は中断されます)</span>
            </label>

            <label className="mdl-radio mdl-js-radio" htmlFor="commentProcessType_1">
              <input id="commentProcessType_1" className="mdl-radio__button" type="radio" name="commentProcessType" value="1" />
              <span className="mdl-radio__label">1つずつ</span>
            </label>
          </div>
        </div>
      </div>
      <Dialog />
    </Paper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
