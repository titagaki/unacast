import electron from 'electron';
import electronlog from 'electron-log';
import path from 'path';
const log = electronlog.scope('renderer-imagePreview');
import { electronEvent } from '../main/const';
import crypto from 'crypto';
const ipcRenderer = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  log.debug('DOM Content Loaded');
});

ipcRenderer.on(electronEvent.PREVIEW_IMAGE, (event: any, url: string) => {
  document.title = `preview ${url}`;
  log.info('[preview-image] ' + url);
  const md5 = crypto.createHash('md5');
  const id = 'a' + md5.update(url).digest('hex'); // 英文字先頭じゃないとクエリ的に怒られる
  log.info('[preview-image] ' + id);

  const tabname = path.basename(url);

  const tabBartDom = document.getElementById('tab-bar') as HTMLDivElement;
  const tabContentDom = document.getElementById('tab-content') as HTMLDivElement;

  let existsTabdom = tabBartDom.querySelector(`#tab_${id}`);
  const existsContentdom = tabContentDom.querySelector(`#${id}`);

  // アクティブ状態を解除
  let existsdom2 = tabBartDom.querySelector(`.is-active`);
  if (existsdom2) existsdom2.classList.remove('is-active');

  existsdom2 = tabContentDom.querySelector(`.is-active`);
  if (existsdom2) existsdom2.classList.remove('is-active');

  // 既に開いてる場合は、アクティブにするだけ
  if (existsTabdom && existsContentdom) {
    existsTabdom.classList.add('is-active');
    existsContentdom.classList.add('is-active');
    return;
  }

  tabBartDom.insertAdjacentHTML('beforeend', `<a id="tab_${id}" href="#${id}" class="">${tabname}</a>`);
  tabContentDom.insertAdjacentHTML('beforeend', `<div class="mdl-tabs__panel is-active" id="${id}"><div class="content"><img src="${url}" /></div></div>`);

  existsTabdom = tabBartDom.querySelector(`#tab_${id}`);
  if (existsTabdom) {
    existsTabdom.classList.add('mdl-tabs__tab');
    existsTabdom.classList.add('is-active');
    existsTabdom.addEventListener('click', activeTab(url, id));
  }
});

const activeTab = (url: string, id: string) => () => {
  document.title = `preview ${url}`;
  const tabBartDom = document.getElementById('tab-bar') as HTMLDivElement;
  const tabContentDom = document.getElementById('tab-content') as HTMLDivElement;

  const existsTabdom = tabBartDom.querySelector(`#tab_${id}`);
  const existsContentdom = tabContentDom.querySelector(`#${id}`);

  // アクティブ状態を解除
  let existsdom2 = tabBartDom.querySelector(`.is-active`);
  if (existsdom2) existsdom2.classList.remove('is-active');

  existsdom2 = tabContentDom.querySelector(`.is-active`);
  if (existsdom2) existsdom2.classList.remove('is-active');

  if (existsTabdom && existsContentdom) {
    existsTabdom.classList.add('is-active');
    existsContentdom.classList.add('is-active');
    return;
  }
};

// window.addEventListener(
//   'contextmenu',
//   (e) => {
//     //
//   },
//   false,
// );
