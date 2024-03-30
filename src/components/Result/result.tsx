import React from "react";
import "./style.css";

interface ResultProps {
  url: string;
  result: number;
  isCurrent: boolean;
}
const Result = ({ result, url, isCurrent }: ResultProps) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [timer, setTimer] = React.useState(5);

  React.useEffect(() => {
    if (result < 1 && isCurrent) {
      if (isPlaying) {
        const interval = setInterval(() => {
          if (timer === 0) {
            setIsPlaying(false);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id! },
                func: () => {
                  window.location.href = "https://www.google.com";
                },
              });
            });
            window.close();
          }
          if (timer > 0) {
            setTimer((prev) => prev - 1);
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [isPlaying, result, timer, isCurrent]);

  return (
    <div className="results">
      {result < 1 ? (
        <>
          <p className="message_yes">This is a phishing link</p>
          <p className="message_yes">This is not a safe link</p>
          {isCurrent ? (
            <>
              <p className="redirect_message">
                Redirecting to the new page in {timer} seconds
              </p>
              <button
                onClick={() => setIsPlaying(false)}
                className="stop_redirect"
              >
                Stop
              </button>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <p className="message_no">This is a safe link</p>
          {isCurrent ? (
            <></>
          ) : (
            <button
              className="visit_website_button"
              onClick={() => {
                chrome.tabs.create({ url });
                window.close();
              }}
            >
              Visit the website
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Result;
