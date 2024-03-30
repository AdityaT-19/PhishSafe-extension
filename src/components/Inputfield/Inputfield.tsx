import React from "react";
import "./style.css";

interface InputfieldProps {
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const Inputfield = (  {url,setUrl,handleSubmit} : InputfieldProps ) => {
  return (
    <div className="ipfield">
      <form 
      onSubmit={handleSubmit}
      >
        <input
          type="url"
          placeholder="Enter URL"
          className="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          
        />
        <button type="submit" className="submit">Submit</button>
      </form>
    </div>
  );
};

export default Inputfield;
