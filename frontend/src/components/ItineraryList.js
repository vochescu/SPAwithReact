import React, { Component } from 'react'

import Itinerary from './Itinerary'
import ItineraryForm from './ItineraryForm'
import ItineraryStore from '../stores/ItineraryStore'
import {EventEmitter} from 'fbemitter'
import AttractionList from './AttractionList'

const ee = new EventEmitter()
const store = new ItineraryStore(ee)

class ItineraryList extends Component {
  constructor(props){
    super(props)
    this.state = {
      itineraryName: '',
      itineraries: [],
      expandFor : -1,
      selected : null
    }
    
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
    this.selectItinerary = (id) => {
      store.getOne(this.props.cityId,id)
      ee.addListener('SINGLE_ITINERARY_LOAD', () => {
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
     this.addItinerary = (itinerary) => {
      store.addOne(this.props.cityId, itinerary)
    }
    this.saveItinerary = (id,itinerary) => {
      store.saveOne(this.props.cityId, id, itinerary)
    }
    this.deleteItinerary= (id) => {
      store.deleteOne(this.props.cityId, id)
    }
}
componentDidMount(){
  store.getAll(this.props.cityId)
    ee.addListener('ITINERARY_LOAD', () => {
      this.setState({
        itineraries : store.content
      })
    })
  }
 
  
  render() {
   
    if (this.state.expandFor === -1){
      return (
          <div>
            <div className="well well-lg">
            <input type="button" value="Back" className="btn btn-danger" style={{margin:'15px'}}
            onClick={this.props.onCancel} />
            <h3>List of itineraries for {this.props.city}</h3>
            <ul className="list-group">
            {
              this.state.itineraries.map((i) => 
                <Itinerary itinerary={i} key={i.id}  onSelect={this.selectItinerary} onDelete={this.deleteItinerary} 
                onSave={this.saveItinerary} />
              )
            }
            </ul>
            </div>
            <div>
              <ItineraryForm onAdd={this.addItinerary}/>
            </div>
          </div>
      )
    } else{
      return (
        <div>
          <AttractionList id={this.props.cityId} itinerary={this.state.selected}
          onCancel={this.cancelSelection} onDelete={this.deleteAttraction} />
        </div>  
      )
      }
    }
}

export default ItineraryList