import React from 'react' 
import ReactDOM from 'react-dom' 
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import App, { Search, Button, Table, updateSearchTopStoriesState } from './App' 

Enzyme.configure({ adapter: new Adapter() })

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div') 
    ReactDOM.render(<App />, div) 
    ReactDOM.unmountComponentAtNode(div) 
  }) 

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <App />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('passes value prop to Search', () => {
    const wrapper = shallow(<App />)
    let searchWrapper = wrapper.find(Search)
    
    expect(searchWrapper.props().value).toBe(wrapper.state().searchTerm)

    wrapper.setState({ searchTerm: 'redux' })

    searchWrapper = wrapper.find(Search)
    expect(searchWrapper.props().value).toBe('redux')
  })

})

describe('Search', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <Search
        value=''
        onChange={() => {}}
        onSubmit={() => {}}
      >
        Search
      </Search>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search
        value=''
        onChange={() => {}}
        onSubmit={() => {}}
      >
        Search
      </Search>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

})

describe('Button', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Button onClick={() => {}}>More</Button>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button onClick={() => {}}>Give</Button>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

})

describe('Table', () => {

  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
    onDismiss: () => {},
    sortKey: 'NONE',
    onSort: () => {},
    isSortReverse: false,
  }

  it('renders without crashing', () => {
    const div = document.createElement('div') 
    ReactDOM.render(<Table { ...props } />, div)
  }) 

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table { ...props } />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('shows two items in list', () => {
    const element = shallow (
      <Table {...props} />
    )

    expect(element.find('.table-row').length).toBe(2)
  })

})

describe('Helpers', () => {
  describe('updateSearchTopStoriesState()', () => {
    const prevState = {
      results: {
        query1: { 
          hits: [ {foo: 'foo'} ],
          page: 1
        }
      },
      isLoading: false,
      searchKey: 'query2'
    }

    const hits = [ {bar: 'bar'} ]
    const page = 1

    const updatedState = { 
      results: {
        query1: { 
          hits: [ {foo: 'foo'} ],
          page: 1
        },
        query2: {
          hits: [ {bar: 'bar'} ],
          page: 1
        }
      },
      isLoading: false,
    }

    it('successfully updates state', () => {
      expect(updateSearchTopStoriesState(hits, page)(prevState)).toEqual(updatedState)
    })
  })
})