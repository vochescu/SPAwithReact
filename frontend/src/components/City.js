import React, {Component} from 'react'

class City extends Component {
  constructor(props){
    super(props)
    this.state = {
      cityLatitude : '',
      cityLongitude: ''
    }
     this.handleChange = (event) => {
      this.setState({
        [event.target.city] :event.target.value
      })
    }
  }
  
  componentDidMount(){
    this.setState({
      cityName : this.props.city.city,
      cityLatitude : this.props.city.latitude,
      cityLongitude : this.props.city.longitude
    })
  }
  
  render() {
       return (
          <li className="list-group-item" >
          <h4>{this.props.city.city}</h4>
          <input type="button" className="btn btn-info" value="Details" onClick={() => this.props.onSelect(this.props.city.id)}/>
          </li>
    )
    }
}

export default City
