import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Windows 98 style window using 98.css */}
      <div className="window" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="title-bar">
          <div className="title-bar-text">Downloader 98</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <div className="field-row" style={{ justifyContent: "space-between" }}>
            <span>Welcome to the 98-style window!</span>
            <div className="status-bar" style={{ minWidth: 160 }}>
              <p className="status-bar-field">Ready</p>
            </div>
          </div>

          <hr />

          <div className="field-row-stacked">
            <label htmlFor="url">URL</label>
            <input id="url" className="" type="text" placeholder="https://example.com/file.zip" />
          </div>

          <div className="field-row" style={{ marginTop: 8 }}>
            <button>Browse...</button>
            <button onClick={() => setCount((c) => c + 1)}>Download ({count})</button>
          </div>

          <div className="status-bar" style={{ marginTop: 12 }}>
            <p className="status-bar-field">Speed: 0 KB/s</p>
            <p className="status-bar-field">Progress: 0%</p>
            <p className="status-bar-field">Queue: 0</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
