import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    converter: '',
    result: ''
  };
  handleConvert = async () => {
    let type;
    let code = this.state.converter;
    if (this.state.converter.includes('rgb')) {
      type = 'rgb';
      code = code.trim();
    } else if (this.state.converter.includes('#')) {
      type = 'hex';
      code = code.replace('#', '');
    } else {
      console.log('ERror');
    }
    const data = await axios.get(
      `https://www.thecolorapi.com/id?${type}=${code}`
    );
    if (type === 'hex') {
      this.setState({ result: data.data.rgb.value });
    } else if (type === 'rgb') {
      this.setState({ result: data.data.hex.value });
    }
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    let convertedStyle = {
      background: `${this.state.result}`
    };
    return (
      <main className="app full-centralize full-screen">
        <header className="header">
          <h1 className="header__title">Color Converter</h1>
        </header>
        <section className="converter">
          <input
            type="text"
            name="converter"
            className="converter__input"
            placeholder="Type your RGB code or you Hex code"
            value={this.state.converter}
            onChange={this.onChange}
          />
          <button onClick={this.handleConvert}>Convert</button>
          <br />
          <span style={convertedStyle}>{this.state.result}</span>
        </section>
      </main>
    );
  }
}

export default App;
