import * as React from 'react'
const logo = require('./logo.svg')
import './App.css'

import { Mic } from './Mic'


export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Mic />
        <hr />
        <a href="https://github.com/ovrmrw/webaudio-meetup-react-example">GitHub</a>
      </div>
    )
  }
}
