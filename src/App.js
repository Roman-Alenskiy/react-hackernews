import React, { Component } from 'react';
import './App.scss';

const DEFAULT_QUERY = 'react'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      isLoading: false,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  setSearchTopStories(result) {
    this.setState({ result, isLoading: false })
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({ 
      result: {...this.state.result, hits: updatedHits}
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  onSearchSubmit(event) {
    event.preventDefault()
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  fetchSearchTopStories(searchTerm) {
    this.setState({ isLoading: true })

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  render() {
    const {result, isLoading, searchTerm} = this.state

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
        </div>
        {(isLoading || !result)
          ? <p className="table-loading">Loading...</p>
          : <Table 
              list={result.hits}
              onDismiss={this.onDismiss}
            />
        }
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

const Table = ({ list, onDismiss }) => {
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

export default App;