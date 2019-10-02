import React, { Fragment, Component } from 'react';
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
    let { converter: code } = this.state;
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
    const { data } = await axios.get(`https://www.thecolorapi.com/id?${type}=${code}`);
    if (type === 'hex') {
      this.setState({ result: data.rgb.value });
    } else if (type === 'rgb') {
      this.setState({ result: data.hex.value });
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
    const { result, error, copied, converter } = this.state;
    let convertedStyle = {
      background: `${this.state.result}`
    };
    if (
      result === '000000' ||
      result === 'rgb(0, 0, 0)' ||
      result.split('0').length - 1 >= 3 ||
      (result.split('r').length > 1 && result.split('0').length - 1 >= 1)
    ) {
      convertedStyle = {
        background: `${result}`,
        color: '#ffffff'
      };
    }
    return (
      <main className='app full-centralize full-screen'>
        <header className='header'>
          <h1 className='header__title'>Color Converter</h1>
        </header>
        <section className='converter'>
          <input
            type='text'
            name='converter'
            className='converter__input'
            placeholder='Type your RGB or Hex code'
            value={converter}
            onChange={this.onChange}
            onClick={this.onClick}
            onKeyPress={this.onEnterPress}
          />
          <button className='button' onClick={this.handleConvert}>
            Convert
          </button>
        </section>

        <div className='converter__group'>
          {result && (
            <Fragment>
              <span className='converter__result' style={convertedStyle}>
                {result}
              </span>
              <CopyToClipboard text={result} onCopy={() => this.setState({ copied: true })}>
                <button className='button'>Copy</button>
              </CopyToClipboard>
              {copied && <span className='copied-message'>Copied</span>}
            </Fragment>
          )}
        </div>
        <div className='converter__error'>{error}</div>
      </main>
    );
  }
}

export default App;
