import React, {Component} from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root');

class Itinerary extends Component {
  constructor(props){
    super(props)
    this.state = {
      itineraryName : '',
      editing: false
    }
    this.handleChange = (event) => {
      this.setState({ [event.target.city] :event.target.value })
     }
    this.labelClicked = this.labelClicked.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  
  componentDidMount(){
    this.setState({
      itineraryName : this.props.itinerary.name
      })
    }
  labelClicked() {
  	this.setState({ editing: true });
  }
  
  
  keyPressed(event) {
  	if(event.key === 'Enter') {
    	this.props.onSave(this.props.itinerary.id,{name : this.state.itineraryName})
    	this.setState({ editing: false });
    }
  }
  
  render() {
    if(this.state.editing){
      return (
      <div>
        <li className="list-group-item">
          <input name="itineraryName" type="text" onChange={this.handleChange}  onKeyPress={this.keyPressed}
            value={this.state.itineraryName} autoFocus/>
            
     
            
          <button type="button" className="btn btn-default btn-sm" onClick={() => this.props.onSelect(this.props.itinerary.id)}>Edit
            <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
          </button>
            
          <button type="button" className="btn btn-default btn-sm" onClick={() => this.props.onDelete(this.props.itinerary.id)}>Delete
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </li> 
     </div>)}else{
      return(
      <div>
        <li className="list-group-item">
          <h3> <div onClick={this.labelClicked} >{this.props.itinerary.name} </div>
          </h3>
            
          <button type="button" className="btn btn-default btn-sm" onClick={() => this.props.onSelect(this.props.itinerary.id)}>Edit
            <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
          </button>
            
          <button type="button" className="btn btn-default btn-sm" onClick={() => this.props.onDelete(this.props.itinerary.id)}>Delete
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </li> 
     </div>
     )}
  }
}

export default Itinerary
