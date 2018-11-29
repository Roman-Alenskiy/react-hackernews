import React from 'react' 
import ReactDOM from 'react-dom' 
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Search } from '.'

Enzyme.configure({ adapter: new Adapter() })

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