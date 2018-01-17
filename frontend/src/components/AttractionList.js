import React, { Component } from 'react'
import AttractionStore from '../stores/AttractionStore'
import {EventEmitter} from 'fbemitter'
import Attraction from './Attraction'
import AttractionForm from './AttractionForm'

const ee = new EventEmitter()
const store = new AttractionStore(ee)

class AttractionList extends Component {
  constructor(props){
    super(props)
    this.state = {
      attractions : []
    }
    this.addAttraction = (attraction) => {
      store.addOne(this.props.id, this.props.itinerary.id,attraction)
    }
    this.saveAttraction = (attractionId,attraction) => {
      store.saveOne(this.props.id, this.props.itinerary.id, attractionId,attraction)
    }
    this.deleteAttraction= (attractionId) => {
      store.deleteOne(this.props.id, this.props.itinerary.id, attractionId)
    }
  }
    
  componentDidMount(){
   store.getAll(this.props.id,this.props.itinerary.id)
    ee.addListener('ATTRACTION_LOAD', () => {
      this.setState({
        attractions : store.content
      })
    })
     
  }
  
  componentWillMount(){
   store.getAll(this.props.id,this.props.itinerary.id)
    ee.addListener('ATTRACTION_LOAD', () => {
      this.setState({
        attractions : store.content
      })
    })
    
  }
  render() {
      return (
        <div>
          <div className="well well-lg">
          <input type="button" value="Back" className="btn btn-danger" style={{margin:'15px'}} onClick={this.props.onCancel}/>
          <ul className="list-group">
            {
              this.state.attractions.map((a) =>
                <Attraction attraction={a} key={a.id} onDelete={this.deleteAttraction} onSave={this.saveAttraction} />
              )
            }
          </ul>
          </div>
          <div className="row">
          <div className="col-xs-3">
           <h3>Add a new attraction </h3>
          <AttractionForm onAdd={this.addAttraction}/>
          </div>
          <div id="map" className="col-xs-6">
          </div>
          </div>
        </div>
        
      )
  }
}

export default AttractionList
