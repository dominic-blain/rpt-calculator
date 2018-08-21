import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk from 'redux-thunk';
import logger from '../middlewares/logger'

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

export default store;