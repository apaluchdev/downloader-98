import "./App.css";
import "98.css";
import FilesWindow from "./src/components/files-window/files-window";
import UploadWindow from "./src/components/upload-window/upload-window";

function App() {
  return (
    <div className="App">
      <div className="flex h-screen w-screen flex-col items-center justify-center p-6">
        {/* Main windows */}
        <div className="flex w-2/3 max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
          <UploadWindow />
          <FilesWindow />
        </div>

        <div className="window fixed bottom-0 left-0 flex w-screen items-start">
          <button className="start-button m-0 p-0"></button>
        </div>
      </div>
    </div>
  );
}

export default App;
