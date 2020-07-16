import { deprecated } from 'typesafe-actions';
const { createAction } = deprecated;

export const updateConfig = createAction('UPDATE_CONFIG', (action) => {
  return (config: typeof globalThis.config) => action(config);
});

export const startServer = createAction('START_SERVER', (action) => {
  return (config: typeof globalThis.config) => action(config);
});

export const stopServer = createAction('STOP_SERVER', (action) => {
  return () => action();
});

export const applyConfig = createAction('APPLY_CONFIG', (action) => {
  return (config: typeof globalThis.config) => action(config);
});

export const updateRunningState = createAction('UPDATE_RUNNING_STATE', (action) => {
  return (isRunning: boolean) => action(isRunning);
});
