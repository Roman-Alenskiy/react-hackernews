import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './main.scss'

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

export default Search