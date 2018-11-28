import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.scss'

const DEFAULT_QUERY = 'react'
const DEFAULT_HPP = '50'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

class App extends Component {
  _isMounted = false

  constructor(props) {
    super(props)

    this.state = {
      results: null,
      isLoading: false,
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
      this.setState({ isLoading: true })

      this.fetchSearchTopStories(searchKey, page)
    }
  }

  componentDidMount() {
    this._isMounted = true
    const { searchTerm } = this.state
    this.setState({ 
      searchKey: searchTerm,
      isLoading: true 
    })
    this.fetchSearchTopStories(searchTerm)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchSearchTopStories(searchTerm, page = 0) {

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error, isLoading: false }))
  }

  render() {
    const {
      results, isLoading, searchTerm, 
      searchKey, error
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
        </div>
        <TableWithError
          error={error} 
          list={list}
          onDismiss={this.onDismiss}
        />
        <div className="interactions">
          <ButtonWithLoading
            className="more-hits-btn"
            onClick={this.onSearchMore(searchKey, page + 1)}
            isLoading={isLoading}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    )
  }
}

class Search extends Component {
  constructor(props) {
    super(props)
    this.searchInput = React.createRef()
  }

  componentDidMount() {
    if (this.searchInput.current) this.searchInput.current.focus()
  }

  render() {
    const { value, onChange, onSubmit, children } = this.props

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={this.searchInput}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    )
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const Table = ({ list, onDismiss, children }) => {
  const largeColumn = {
    width: '40%',
  }
  const midColumn = {
    width: '30%',
  }
  const smallColumn = {
    width: '10%',
  } 

  return (
    <div className="table">
      {list.map((item) => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></span>
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

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

const Button = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
)

Button.defaultProps = {
  className: '',
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

const LoadingIndicator = () => (
  <FontAwesomeIcon icon="spinner" className="loading" pulse/>
)

const withLoading = (Component) => (
  ({ isLoading, ...rest }) => ( 
    isLoading
    ? <LoadingIndicator />
    : <Component {...rest} />
  )
)

const withError = (Component) => (
  ({ error, ...rest }) => (
    error
    ? <div>
        <p>Something went wrong :(</p>
      </div>
    : <Component {...rest} />
  )
)

const ButtonWithLoading = withLoading(Button)
const TableWithError = withError(Table)

export default App

export {
  Button,
  Search,
  Table,
}