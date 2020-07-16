import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducer/renderer';
import sagas from '../middleware/renderer';

const store = () => {
  const sagaMiddleware = createSagaMiddleware();
  // devtoolを仕込むなら以下のapplyMiddlewareを外に切り出す
  const store = createStore(reducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(sagas);

  return store;
};

export default store;
