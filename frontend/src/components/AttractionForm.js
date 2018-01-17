import React, {Component} from 'react'

class Attraction extends Component{
  constructor(props){
    super(props)
    this.state = {
      attractionName : '',
      attractionDescription : '',
      attractionDuration: -1,
      attractionLatitude: '',
      attractionLongitude: ''
    }
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  componentDidMount(){
    this.setState({
      attractionName : '',
      attractionDescription : '',
      attractionDuration: '',
      attractionLatitude: '',
      attractionLongitude: ''
    })
  }
  render(){
        // to set lat and long from map
      return (
        <div className="form-group">
            Name : <input className="form-control" type="text" name="attractionName" onChange={this.handleChange} value={this.state.attractionName}/> 
            Description : <input className="form-control" type="text" name="attractionDescription" onChange={this.handleChange} value={this.state.attractionDescription}/>
            Duration : <input className="form-control" type="text" name="attractionDuration" onChange={this.handleChange} value={this.state.attractionDuration}/> 
            Latitude : <input className="form-control" type="text" name="attractionLatitude" onChange={this.handleChange} value={this.state.attractionLatitude}/> 
            Longitude : <input className="form-control" type="text" name="attractionLongitude" onChange={this.handleChange} value={this.state.attractionLongitude}/> 
            
            <br/>

            <button type="button" className="btn btn-info btn-lg" onClick={() => this.props.onAdd({name : this.state.attractionName, 
            description : this.state.attractionDescription, duration: this.state.attractionDuration,
            latitude: 0, longitude: 0})} > Save </button>
        </div>
      )
    }
}

export default Attraction