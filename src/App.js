import React, { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./App.css";

const App = () => {
  const [converter, setConverter] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    let type;
    let code = converter;
    setError("");
    setCopied(false);
    if (code.includes("rgb")) {
      type = "rgb";
      code = code.trim();
    } else if (code.includes("#")) {
      type = "hex";
      code = code.replace("#", "");
    } else {
      if (code.length === 6) {
        type = "hex";
      } else if (code.length === 3) {
        type = "hex";
        code = code + code;
      } else {
        setResult("");
        setError("RGB or Hex code not recognized!");
      }
    }
    const { data } = await axios.get(
      `https://www.thecolorapi.com/id?${type}=${code}`
    );
    if (type === "hex") {
      setResult(data.rgb.value);
    } else if (type === "rgb") {
      setResult(data.hex.value);
    }
  };
  const onChange = (e) => {
    setConverter(e.target.value);
  };

  const onClick = (e) => {
    if (copied) {
      setConverter("");
      setResult("");
    }
  };

  const onEnterPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      handleConvert();
    }
  };
  let convertedStyle = {
    background: `${result}`,
  };
  if (
    result === "000000" ||
    result === "rgb(0, 0, 0)" ||
    result.split("0").length - 1 >= 3 ||
    (result.split("r").length > 1 && result.split("0").length - 1 >= 1)
  ) {
    convertedStyle = {
      background: `${result}`,
      color: "#ffffff",
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
          value={converter}
          onChange={onChange}
          onClick={onClick}
          onKeyPress={onEnterPress}
        />
        <button className="button" onClick={handleConvert}>
          Convert
        </button>
      </section>

      <div className="converter__group">
        {result && (
          <>
            <span className="converter__result" style={convertedStyle}>
              {result}
            </span>
            <CopyToClipboard text={result} onCopy={() => setCopied(true)}>
              <button className="button">Copy</button>
            </CopyToClipboard>
            {copied && <span className="copied-message">Copied</span>}
          </>
        )}
      </div>
      <div className="converter__error">{error}</div>
    </main>
  );
};

export default App;
