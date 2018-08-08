import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    converter: '',
    result: '',
    error: ''
  };
  handleConvert = async () => {
    let type;
    let code = this.state.converter;
    this.setState({ error: '' });
    if (code.includes('rgb')) {
      type = 'rgb';
      code = code.trim();
    } else if (code.includes('#')) {
      type = 'hex';
      code = code.replace('#', '');
    } else {
      if (code.length === 6) {
        type = 'hex';
      } else if (code.length === 3) {
        type = 'hex';
        code = code + code;
      } else {
        this.setState({ result: '', error: 'RGB or Hex code not recognized!' });
      }
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
    if (
      this.state.result === '000000' ||
      this.state.result === 'rgb(0, 0, 0)'
    ) {
      convertedStyle = {
        background: `${this.state.result}`,
        color: '#ffffff'
      };
    }
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
            placeholder="Type your RGB or Hex code"
            value={this.state.converter}
            onChange={this.onChange}
          />
          <button className="button" onClick={this.handleConvert}>
            Convert
          </button>
        </section>
        <span className="converter__result" style={convertedStyle}>
          {this.state.result} {this.state.error}
        </span>
      </main>
    );
  }
}

export default App;
