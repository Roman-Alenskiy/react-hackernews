import React from 'react' 
import ReactDOM from 'react-dom' 
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { App } from '.'
import { updateSearchTopStoriesState } from './App'
import { Search } from '../Search'

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