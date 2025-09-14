// src/reducers/index.js
import { combineReducers } from "redux";
import { userReducer } from "./userReducer.jsx";

export const rootReducer = combineReducers({
  user: userReducer,
});
