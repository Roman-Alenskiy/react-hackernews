import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = (searchTerm) => (
  (item) => (
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
      searchTerm: ''
    }

    this.onSearchChange = this.onSearchChange.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter((item) => {
      return item.objectID !== id
    })
    this.setState({ list: updatedList })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  render() {
    const {list, searchTerm} = this.state

    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          <p>
            Search
          </p>
        </Search>

        <Table 
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        >
          <p>
            Table
          </p>
        </Table>
      </div>
    )
  }
}

const Search = ({ value, onChange, children }) => (
  <form>
    {children}
    <input 
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>
)

const Table = ({ list, pattern, onDismiss, children }) => (
  <div>
    {children}
    {list.filter(isSearched(pattern.trim())).map((item) => {
      const onHandleDismiss = () => onDismiss(item.objectID)

      return (
        <div key={item.objectID}>
          <span><a href={item.url}>{item.title}</a></span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
            <Button
              onClick={onHandleDismiss}
            >
              Dismiss
            </Button>
          </span>
        </div>
      )
    })}
  </div>
)

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