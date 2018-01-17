import React, { Component } from 'react';
import City from './City'
import CityStore from '../stores/CityStore'
import {EventEmitter} from 'fbemitter'
import ItineraryList from './ItineraryList'
const ee = new EventEmitter()
const store = new CityStore(ee)

class CityList extends Component {
  constructor(props){
    super(props)
    this.state = {
      cities : [],
      expandFor: -1,
      selected: null
      
    }
    this.selectCity = (id) => {
      store.getOne(id)
      ee.addListener('SINGLE_CITY_LOAD', () => {
        this.setState({
          expandFor : store.selected.id,
          selected : store.selected
        })
      })
    }
    this.cancelSelection = () => {
      this.setState({
        expandFor : -1
      })
    }
  }
  componentDidMount(){
    store.getAll()
    ee.addListener('CITY_LOAD', ()=> {
      this.setState({
        cities : store.content
      })
    })
  }
  render() {
    if (this.state.expandFor === -1){
      return (
        <div>
        <h3 className="title">Destinations</h3>
        <ul className="list-group">
          {
            this.state.cities.map((c) => <City city={c} key={c.id} onSelect={this.selectCity}/> )
          }
        </ul>
        <div>
        </div>
      </div>
      )
    }
    else{
      return (
        <div>
         <ul className="list-group">
          <ItineraryList onCancel={this.cancelSelection} cityId={this.state.selected.id}
          /> 
          </ul>
        </div>
      )
    }
  }
}

export default CityList
