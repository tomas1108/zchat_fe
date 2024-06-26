import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import appReducer from './slices/app';

import authReducer from './slices/auth';
import conversationReducer from './slices/conversation';
import groupReducer from './slices/group';
import notificationReducer from './slices/notification';


// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  //   whitelist: [],
  //   blacklist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
  group: groupReducer,
  notifications: notificationReducer,
  


});

export { rootPersistConfig, rootReducer };
