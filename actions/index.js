import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_REDDIT = 'SELECT_REDDIT';
export const ERROR_HAPPENED = 'ERROR_HAPPENED';

export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  };
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit: reddit
  };
}

function errorHappened(reddit) {
  return {
    type: ERROR_HAPPENED
  };
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

var timeout;

export function fetchPosts(reddit) {
  return dispatch => {
    clearTimeout(timeout);
    dispatch(requestPosts(reddit));
    return fetch(`https://www.reddit.com/r/${reddit}.json`)
      .then(
        response => response.json(), 
        error => {
          dispatch(errorHappened());
          timeout = setTimeout(() => dispatch(fetchPosts(reddit)), 1500);
        })
      .then(json => {
        if (json) dispatch(receivePosts(reddit, json));
      });
  };
}
