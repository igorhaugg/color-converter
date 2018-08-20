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
    this.setState({ converter: e.target.value });
  };
  onClick = e => {
    if (this.state.copied) {
      this.setState({ result: '', converter: '' });
    }
  };
  onEnterPress = e => {
    if (e.charCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.handleConvert();
    }
  };
  render() {
    let convertedStyle = {
      background: `${this.state.result}`
    };
    if (
      this.state.result === '000000' ||
      this.state.result === 'rgb(0, 0, 0)' ||
      this.state.result.split('0').length - 1 >= 3 ||
      (this.state.result.split('r').length > 1 &&
        this.state.result.split('0').length - 1 >= 1)
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
            onClick={this.onClick}
            onKeyPress={this.onEnterPress}
          />
          <button className="button" onClick={this.handleConvert}>
            Convert
          </button>
        </section>

        {this.state.result && (
          <div className="converter__group">
            <span className="converter__result" style={convertedStyle}>
              {this.state.result}
            </span>
            <CopyToClipboard
              text={this.state.result}
              onCopy={() => this.setState({ copied: true })}
            >
              <button className="button">Copy</button>
            </CopyToClipboard>
            {this.state.copied && (
              <span className="copied-message">Copied</span>
            )}
          </div>
        )}
        {this.state.error}
      </main>
    );
  }
}

export default App;
