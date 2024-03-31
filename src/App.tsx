import { useState } from "react";
import "./App.css";
import Inputfield from "./components/Inputfield/Inputfield";
import { ClipLoader } from "react-spinners";
import Result from "./components/Result/result";
import sourceTips from "./tips";
import React from "react";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);
  const [url, setUrl] = useState("");
  const [isCurrent, setIsCurrent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCurrent(false);
    if (!url) {
      alert("Please enter a URL");
      return;
    }
    setIsLoading(true);
    console.log(url);
    const res = await fetch("https://phishsafe-server.onrender.com/checkURL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    console.log(data);
    setResult(data.result);
    setIsLoading(false);
    setIsLoaded(true);
  };

  //tips
  const [tips] = useState(sourceTips);
  const [tipIndex, setTipIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length, tipIndex]);

  return (
    <div className="App">
      <header>
        <h1>PhishSafe</h1>
      </header>
      <main>
        <Inputfield url={url} setUrl={setUrl} handleSubmit={handleSubmit} />
        <button
          className="checkCurrent"
          onClick={async () => {
            setIsLoading(true);
            setIsCurrent(true);
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            const tab = tabs[0];
            const url = tab.url!;
            setUrl(url);
            const res = await fetch("https://phishsafe-server.onrender.com/checkURL", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url }),
            });
            const data = await res.json();
            console.log(data);
            setResult(data.result);
            setIsLoading(false);
            setIsLoaded(true);
          }}
        >
          Check Current Site
        </button>
        {isLoading ? (
          <div className="loading">
            <ClipLoader color="#000" loading={isLoading} size={75} />
            <h2>Scanning...</h2>
            <div className="tipContainer">
              <p className="tip">{tips[tipIndex]}</p>
            </div>
          </div>
        ) : (
          isLoaded && <Result result={result} url={url} isCurrent={isCurrent} />
        )}
      </main>
    </div>
  );
}

export default App;
