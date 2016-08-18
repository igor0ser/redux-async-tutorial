import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectReddit, fetchPosts } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  checkInCache(reddit, posts){
    return posts.filter((post) => post.title === reddit)[0];
  }

  componentDidMount() {
    const { dispatch, selectedReddit } = this.props;
    var selectedItem = this.checkInCache(selectedReddit, this.props.posts);
    if ( !selectedItem ) {
      dispatch(fetchPosts(selectedReddit));
    }
  }

  componentWillReceiveProps(nextProps) {
      const { dispatch, selectedReddit } = nextProps;
    if (this.props.selectedReddit !== selectedReddit){
      if ( !this.checkInCache(selectedReddit, this.props.posts) ) {
        dispatch(fetchPosts(selectedReddit))
      }
    }
  }

  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedReddit } = this.props
    dispatch(fetchPosts(selectedReddit))
  }

  render() {
    const { selectedReddit, posts, isFetching, error } = this.props
    var selectedPosts = [];
    var selectedLastUpdated = false;
    if (!isFetching){
      var selectedItem = this.checkInCache(selectedReddit, posts);
      if (selectedItem){
        selectedPosts = selectedItem.posts;
        selectedLastUpdated = selectedItem.received;
      }
    }
    const isEmpty = selectedPosts.length === 0;
    return (
      <div>
        <Picker
          options={['reactjs', 'frontend', 'angularjs', 'webpack', 'ukraine']}
          value={selectedReddit}
          onChange={this.handleChange}
        />
        <p>
          {selectedLastUpdated &&
            <span>
              Last updated at {new Date(selectedLastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        { !error && (isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={selectedPosts} />
            </div>
        )}
        {error &&
          <h3>some error happened</h3>
        }
      </div>
    )
  }
}

App.propTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedReddit } = state
  const {
    isFetching,
    items: posts,
    error
  } = state.posts

  return {
    selectedReddit,
    posts,
    isFetching,
    error
  }
}

export default connect(mapStateToProps)(App)
