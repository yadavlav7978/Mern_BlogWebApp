import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from './theme/themeSlice';
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

{
  /*//! ----------------- What is Reducer in Redux---------------------
        A reducer in Redux is a pure function that takes the current state and an action as arguments and returns the next state. 
        It is a fundamental concept in Redux and is responsible for handling state transitions in our application.
        They do not modify the state directly; instead, they return a new state object based on the current state and the action received.
*/
}

{
  /* When we use Redux Persist, we essentially modify our regular reducer (created with Redux Toolkit or Redux) to become a persisted reducer,
and our regular store becomes a persisted store.
*/
}

// persistConfig provides essential details for how Redux state should be persisted across sessions.
const persistConfig = {
  key: "root", // Key for the persisted state , This key is essential because it distinguishes your application's persisted state from other data stored in the same storage area.
  storage, // Storage engine to use (defaults to localStorage for web)
};

// If we have two or more reducers in Redux Toolkit ,then we can add in one reducer known as rootReducer.
const rootReducer = combineReducers({
  user: userReducer,
  theme:themeReducer,
});

// It transforms a normal reducer into a persisted reducer by wrapping it with persistence logic.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store with the persistedReducer.
export const store = configureStore({
  reducer: persistedReducer,

});

{
  /* This middleware is used to disable the default serializability checks in Redux Toolkit. 
    This is done to prevent errors related to non-serializable actions or state,
    which can occur when you're working with third-party libraries or APIs that return non-serializable data, such as functions or Promises.*/
}

// export const store = configureStore({
//   reducer: {
//     user : userReducer,
//   },
// })

// It transforms a normal or redux store into a persisted store by wrapping it with persistence logic.
export const persistor = persistStore(store);
