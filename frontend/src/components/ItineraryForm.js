import React, { Component } from 'react'

class ItineraryForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      itineraryName : '',
    }
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  render() {
    return (
        <div style={{textAlign: 'center'}}>
            <li className="list-group-item">
                Itinerary name: <input type="text" name="itineraryName" onChange={this.handleChange} style={{margin:'10px'}}/>
                <button type="button" className="btn btn-info btn-sm" onClick={() => this.props.onAdd({name : this.state.itineraryName})}>
                    <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                </button>
            </li> 
        </div>
    )
  }
}

export default ItineraryForm
