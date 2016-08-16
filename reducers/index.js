import { combineReducers } from 'redux';
import { SELECT_REDDIT, REQUEST_POSTS, RECEIVE_POSTS, ERROR_HAPPENED } from '../actions';

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit;
    default:
      return state;
  }
}

function posts(state = {isFetching: false, items: [], error: false}, action) {
  switch (action.type) {
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        error: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.posts,
        lastUpdated: action.receivedAt,
      });
    case ERROR_HAPPENED:
      return Object.assign({}, state, {error: true});
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedReddit,
  posts,
});

export default rootReducer;
