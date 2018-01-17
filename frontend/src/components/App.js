import React, { Component } from 'react'
import '../styles/App.css'
import CityList from './CityList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <img title="Visit Romania" alt="visitRomania" src={require("../styles/img/logo.png")} style ={{height: '40px', weight: '20px'}} />
        <header>
         <div id="bottomHeader">
              <b>Visit Romania</b> is all about the fun of planning the details of your trip in Romanian Cities.<br/>A plan with all you need to see and do.
         </div>
        </header>
        <CityList />
      </div>
    )
  }
}

export default App
