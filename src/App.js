import React, { Component } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './App.css';

class App extends Component {
  state = {
    converter: '',
    result: '',
    error: '',
    copied: false
  };
  handleConvert = async () => {
    let type;
    let code = this.state.converter;
    this.setState({ error: '', copied: false });
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

        {this.state.result && (
          <CopyToClipboard
            text={this.state.result}
            onCopy={() => this.setState({ copied: true })}
          >
            <div className="converter__group">
              <span className="converter__result" style={convertedStyle}>
                {this.state.result}
              </span>
              <button className="button">Copy</button>
              {this.state.copied && (
                <span className="copied-message">Copied</span>
              )}
            </div>
          </CopyToClipboard>
        )}
        {this.state.error}
      </main>
    );
  }
}

export default App;
