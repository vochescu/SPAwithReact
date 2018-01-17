import React, {Component} from 'react'

class Attraction extends Component{
  constructor(props){
    super(props)
    this.state = {
      isEditing : false,
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
      attractionName : this.props.attraction.name,
      attractionDescription : this.props.attraction.description,
      attractionDuration: this.props.attraction.duration,
      attractionLatitude: this.props.attraction.latitude,
      attractionLongitude: this.props.attraction.longitude
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      isEditing : false
    })
  }
  render(){
    if (!this.state.isEditing){
      return (
        <div>
        <li className="list-group-item list-group-item-info">
          <h5>{this.props.attraction.name}</h5>
          {this.props.attraction.description}
          {this.props.attraction.duration} minutes
          
          <div>
            <button type="button" className="btn btn-info btn-sm" onClick={() => this.props.onDelete(this.props.attraction.id)}> Delete
            </button>
            <button type="button" className="btn btn-info btn-sm" onClick={() => this.setState({isEditing : true})}>Edit
            </button>
          </div>
          </li>
        </div>  
      )
    }
    else{
        // to set lat and long from map
      return (
        <div>
         <li className="list-group-item list-group-item-warning">
         <div className="form-group">
            <input className="form-control" type="text" name="attractionName" onChange={this.handleChange} value={this.state.attractionName}/> 
            <br/>
            <input className="form-control" type="text" name="attractionDescription" onChange={this.handleChange} value={this.state.attractionDescription}/>
            <br/>
            <input className="form-control" type="text" name="attractionDuration" onChange={this.handleChange} value={this.state.attractionDuration}/> 
             <br/>
            <input className="form-control" type="text" name="attractionLatitude" onChange={this.handleChange} value={this.state.attractionLatitude}/> 
             <br/>
            <input className="form-control" type="text" name="attractionLongitude" onChange={this.handleChange} value={this.state.attractionLongitude}/> 
          </div>
             <button type="button" className="btn btn-warning btn-sm" onClick={() => this.setState({isEditing : false})}>
             Back
             </button>
            
            <button type="button" className="btn btn-warning btn-sm" onClick={() => this.props.onSave(this.props.attraction.id,
            {name : this.state.attractionName, description : this.state.attractionDescription, duration: this.state.attractionDuration,
                latitude: this.state.attractionLatitude, longitude: this.state.attractionLongitude})} > Save </button>
         </li>
        </div>
      )
    }
  }
}

export default Attraction