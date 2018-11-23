import React, { Component } from 'react';
import './App.scss';

const DEFAULT_QUERY = 'react'
const DEFAULT_HPP = '50'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: null,
      isLoading: false,
      isLoadingMore: false,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    }

    this.needToSearchTopStories = this.needToSearchTopStories.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  needToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]
  }

  setSearchTopStories(result) {
    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : []
    
    const updatedHits = [...oldHits, ...hits]

    this.setState({ 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false,
      isLoadingMore: false 
    })
  }

  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]

    const isNotId = (item) => item.objectID !== id
    const updatedHits = hits.filter(isNotId)
    
    this.setState({ 
      results: {
        ...results, 
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  onSearchSubmit(event) {
    event.preventDefault()
    const { searchTerm } = this.state

    if (this.needToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
      this.setState({ isLoading: true })
    }

    this.setState({ 
      searchKey: searchTerm,
    })
  }

  onSearchMore(searchKey, page) {
    return () => {
      this.setState({ isLoadingMore: true })

      this.fetchSearchTopStories(searchKey, page)
    }
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.setState({ 
      searchKey: searchTerm,
      isLoading: true 
    })
    this.fetchSearchTopStories(searchTerm)
  }

  fetchSearchTopStories(searchTerm, page = 0) {

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }))
  }

  render() {
    const {
      results, isLoading, isLoadingMore, 
      searchTerm, searchKey, error
    } = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || []
    
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            <p>
              Search
            </p>
          </Search>
          { isLoading && !error && <LoadingIndicator /> }
        </div>
        {
          error
          ? <div>
              <p>Something went wrong :(</p>
            </div>
          : <Table 
              list={list}
              onDismiss={this.onDismiss}
            />
        }
        <div className="interactions">
          { isLoadingMore && <LoadingIndicator /> }
          {
            results &&
            <Button
              className="more-hits-btn"
              onClick={this.onSearchMore(searchKey, page + 1)}
            >
              More
            </Button>
          }
        </div>
      </div>
    )
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input 
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>
)

const Table = ({ list, onDismiss, children }) => {
  const largeColumn = {
    width: '40%',
  };
  const midColumn = {
    width: '30%',
  };
  const smallColumn = {
    width: '10%',
  }; 

  return (
    <div className="table">
      {list.map((item) => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                className="button-inline"
                onClick={() => onDismiss(item.objectID)}
              >
                Dismiss
              </Button>
            </span>
          </div>
        )
      })}
      {children}
    </div>
  )
}

const Button = ({ onClick, className = '', children }) => (
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
)

const LoadingIndicator = () => (
  <p className="table-loading">Loading...</p>
)

export default App;